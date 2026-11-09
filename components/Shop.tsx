"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Icon } from "./Icon";
import { MENU, rupee } from "@/lib/menu";
import { CART_KEY, store } from "@/lib/store";
import { submitForm } from "@/lib/submit";
import { WA_NUMBER } from "@/lib/site";
import { phoneOk, useFieldErrors } from "@/lib/forms";
import { emailOk } from "@/lib/validate";

type Cart = Record<string, number>;

interface ModalState {
  node: ReactNode;
  wide: boolean;
}

interface ShopCtx {
  cart: Cart;
  cartCount: number;
  inc: (id: number | string) => void;
  dec: (id: number | string) => void;
  clear: () => void;
  add: (id: number | string) => void;
  toast: (m: string) => void;
  openCart: (o?: boolean) => void;
  navOpen: boolean;
  setNavOpen: (o: boolean) => void;
  showModal: (node: ReactNode, wide?: boolean) => void;
  closeModal: () => void;
  confirmBox: (title: string, lines: ReactNode[], ref: string, wa: string) => void;
}

const Ctx = createContext<ShopCtx | null>(null);
export const useShop = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useShop must be used inside <ShopProvider>");
  return c;
};

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({});
  const loaded = useRef(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [toastMsg, setToastMsg] = useState("");
  const [toastOn, setToastOn] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // load saved cart after hydration (keeps server HTML identical to first client render)
  useEffect(() => {
    // browser-only data: must be read after hydration to avoid a server/client mismatch
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCart(store.get<Cart>(CART_KEY, {}));
    loaded.current = true;
  }, []);
  useEffect(() => {
    if (loaded.current) store.set(CART_KEY, cart);
  }, [cart]);

  const toast = useCallback((m: string) => {
    setToastMsg(m);
    setToastOn(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastOn(false), 1700);
  }, []);

  const add = useCallback(
    (id: number | string) => {
      setCart((c) => ({ ...c, [id]: 1 }));
      toast("Added to your order");
    },
    [toast],
  );
  const inc = useCallback((id: number | string) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 })), []);
  const dec = useCallback(
    (id: number | string) =>
      setCart((c) => {
        const n = { ...c };
        n[id] = (n[id] || 0) - 1;
        if (n[id] <= 0) delete n[id];
        return n;
      }),
    [],
  );

  const clear = useCallback(() => setCart({}), []);

  const openCart = useCallback((o = true) => setDrawerOpen(o), []);
  const showModal = useCallback((node: ReactNode, wide = false) => setModal({ node, wide }), []);
  const closeModal = useCallback(() => setModal(null), []);

  const confirmBox = useCallback(
    (title: string, lines: ReactNode[], ref: string, wa: string) => {
      showModal(
        <>
          <div className="ok"><Icon name="check" /></div>
          <h3>{title}</h3>
          {lines.map((l, i) => <p key={i}>{l}</p>)}
          <div className="ref">{ref}</div>
          <p style={{ fontSize: 13 }}>Our team will call to confirm.</p>
          <a className="pill" target="_blank" rel="noopener" href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(wa)}`}>
            Confirm on WhatsApp
          </a>
          <button className="pill out" data-close>Close</button>
        </>,
      );
    },
    [showModal],
  );

  // page scroll lock while the drawer or the mobile nav is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen || navOpen ? "hidden" : "";
  }, [drawerOpen, navOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawerOpen(false);
        setNavOpen(false);
        setModal(null);
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  const cartIds = Object.keys(cart).filter((id) => MENU.some((m) => m.id == (id as unknown as number)));
  const cartCount = cartIds.reduce((a, k) => a + cart[k], 0);

  const value = useMemo<ShopCtx>(
    () => ({ cart, cartCount, inc, dec, clear, add, toast, openCart, navOpen, setNavOpen, showModal, closeModal, confirmBox }),
    [cart, cartCount, inc, dec, clear, add, toast, openCart, navOpen, showModal, closeModal, confirmBox],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className={`scrim${drawerOpen ? " on" : ""}`} id="scrim" onClick={() => setDrawerOpen(false)} />
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div
        className={`modal${modal ? " on" : ""}`}
        id="modal"
        onClick={(e) => {
          const t = e.target as HTMLElement;
          if (t === e.currentTarget || t.closest("[data-close]")) setModal(null);
        }}
      >
        <div className="mbox" id="mbox" style={modal?.wide ? { maxWidth: "980px" } : undefined}>
          {modal?.node}
        </div>
      </div>
      <div className={`toast${toastOn ? " on" : ""}`} id="toast" role="status">{toastMsg}</div>
    </Ctx.Provider>
  );
}

function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cart, inc, dec, clear: clearCart, confirmBox } = useShop();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const { errs, setErrs, clear } = useFieldErrors();
  const ids = Object.keys(cart).filter((id) => MENU.some((m) => m.id == (id as unknown as number)));

  let total = 0;
  const rows = ids.map((id) => {
    const m = MENU.find((x) => x.id == (id as unknown as number))!;
    const q = cart[id];
    total += (m.price as number) * q;
    return (
      <div className="ci" key={id}>
        <h4>{m.name}</h4>
        <div className="qty">
          <button aria-label="Remove one" onClick={() => dec(id)}>−</button>
          <span>{q}</span>
          <button aria-label="Add one" onClick={() => inc(id)}>+</button>
        </div>
        <small>{rupee((m.price as number) * q)}</small>
      </div>
    );
  });

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    const e1 = name.trim().length <= 1,
      e2 = !phoneOk(phone),
      e3 = !emailOk(email.trim());
    setErrs({ name: e1, phone: e2, email: e3 });
    if (e1 || e2 || e3) return;
    let t = 0;
    const items = ids.map((id) => {
      const m = MENU.find((x) => x.id == (id as unknown as number))!;
      t += (m.price as number) * cart[id];
      return `${cart[id]}× ${m.name}`;
    });
    const website = (new FormData(e.currentTarget).get("website") as string) || "";
    setSending(true);
    setError("");
    const r = await submitForm("order", {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      items: ids.map((id) => ({ id: Number(id), qty: cart[id] })),
      website,
    });
    setSending(false);
    if (!r.ok) return setError(r.error);
    const d = { name: name.trim(), phone: phone.trim(), items: items.join(", ") };
    clearCart();
    setName("");
    setPhone("");
    setEmail("");
    onClose();
    confirmBox(
      "Order placed",
      [<>Thank you, <b>{d.name}</b>.</>, d.items, <>Total <b>{rupee(t)}</b></>],
      r.ref,
      `Hello TriStar 1947, new order (${r.ref}): ${d.items}. Total ${rupee(t)}. Name: ${d.name}, Phone: ${d.phone}`,
    );
  };

  return (
    <aside className={`drawer${open ? " on" : ""}`} id="drawer" aria-label="Your order" aria-hidden={!open}>
      <div className="dr-h">
        <h3>Your order</h3>
        <button id="drClose" aria-label="Close" onClick={onClose}><Icon name="x" /></button>
      </div>
      <div className="dr-b" id="cartBody">
        {ids.length ? rows : <div className="empty">Your order is empty.</div>}
      </div>
      <div className="dr-f" id="cartFoot" hidden={!ids.length}>
        <div className="tot"><span>Total</span><span id="cartTotal">{rupee(total)}</span></div>
        <form id="ordForm" noValidate onSubmit={submit}>
          <div className={`fld${errs.name ? " err" : ""}`}><input name="name" placeholder="Your name" aria-label="Your name" value={name} onChange={(e) => { setName(e.target.value); clear("name"); }} /><div className="em">Enter your name.</div></div>
          <div className={`fld${errs.phone ? " err" : ""}`}><input name="phone" type="tel" inputMode="tel" placeholder="Phone number" aria-label="Phone number" value={phone} onChange={(e) => { setPhone(e.target.value); clear("phone"); }} /><div className="em">Enter a valid 10-digit number.</div></div>
          <div className={`fld${errs.email ? " err" : ""}`}><input name="email" type="email" inputMode="email" placeholder="Email (optional, for your receipt)" aria-label="Email (optional)" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); clear("email"); }} /><div className="em">Enter a valid email address.</div></div>
          <input name="website" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          {error ? <p className="form-err" role="alert">{error}</p> : null}
          <button className="pill" type="submit" disabled={sending}>{sending ? "Placing order…" : "Place order"}</button>
        </form>
      </div>
    </aside>
  );
}
