"use client";

import Image from "next/image";
import { Fragment, useState } from "react";
import { Icon } from "./Icon";
import { useShop } from "./Shop";
import photos from "@/lib/dish-photos.json";
import { CATS, DIET_LABEL, MENU, rupee, slug, type CatId } from "@/lib/menu";

const PHOTOS = photos as Record<string, { w: number; h: number }>;

/** Tabs (optional), vegetarian switch, intro line and the dish grid for one menu section. */
export function MenuBrowser({ cats, tabsLabel }: { cats: CatId[]; tabsLabel?: string }) {
  const { cart, add, inc, dec } = useShop();
  const [cat, setCat] = useState<CatId>(cats[0]);
  const [veg, setVeg] = useState(false);

  const items = MENU.filter((m) => m.cat === cat && (!veg || m.d !== "n"));
  let last = "";

  return (
    <>
      <div className="mbar rv">
        {cats.length > 1 ? (
          <div className="seg-ctl m-tabs" role="tablist" aria-label={tabsLabel}>
            {cats.map((id) => (
              <button key={id} role="tab" aria-selected={id === cat} className={id === cat ? "on" : ""} data-cat={id} onClick={() => setCat(id)}>
                {CATS.find((x) => x.id === id)!.name}
              </button>
            ))}
          </div>
        ) : (
          <span></span>
        )}
        <label className="sw-l">
          <input type="checkbox" className="m-veg" checked={veg} onChange={(e) => setVeg(e.target.checked)} />
          <span className="sw"></span>Vegetarian only
        </label>
      </div>
      <p className="mintro m-intro">{CATS.find((x) => x.id === cat)!.intro}</p>
      <div className="mgrid m-list" key={`${cat}-${veg}`}>
        {items.length ? (
          items.map((m, i) => {
            const q = cart[m.id] || 0;
            const g = m.group && m.group !== last ? ((last = m.group), <h4 className="grp">{m.group}</h4>) : null;
            const key = slug(m.name);
            const ph = PHOTOS[key];
            return (
              <Fragment key={m.id}>
                {g}
                <article className="mc" style={{ animationDelay: `${i * 35}ms` }} data-id={m.id}>
                  {ph ? (
                    <Image className="mi" src={`/img/dishes/${key}.jpg`} alt={m.name} width={ph.w} height={ph.h} sizes="(max-width:600px) 100vw, (max-width:1000px) 50vw, 440px" loading="lazy" />
                  ) : null}
                  <h4>
                    <i className={`dot ${m.d}`} role="img" aria-label={DIET_LABEL[m.d]}></i>
                    <span>{m.name}</span>
                  </h4>
                  <p>{m.desc}</p>
                  <div className="ft">
                    <span className={`pr${m.price == null ? " tag" : ""}`}>{m.price != null ? rupee(m.price) : m.tag}</span>
                    {m.price == null ? null : q ? (
                      <div className="qty">
                        <button aria-label="Remove one" onClick={() => dec(m.id)}>−</button>
                        <span>{q}</span>
                        <button aria-label="Add one" onClick={() => inc(m.id)}>+</button>
                      </div>
                    ) : (
                      <button className="add" aria-label={`Add ${m.name} to order`} onClick={() => add(m.id)}>
                        <Icon name="plus" />
                      </button>
                    )}
                  </div>
                </article>
              </Fragment>
            );
          })
        ) : (
          <p style={{ gridColumn: "1/-1", padding: "30px 0", color: "var(--mute)" }}>
            No vegetarian items in this section — please see the other sections.
          </p>
        )}
      </div>
    </>
  );
}
