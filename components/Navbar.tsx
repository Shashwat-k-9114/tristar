"use client";

import { Icon } from "./Icon";
import { useShop } from "./Shop";

export function Navbar() {
  const { cartCount, openCart, navOpen, setNavOpen } = useShop();
  const close = () => setNavOpen(false);
  return (
    <nav className="gnav" id="hdr" aria-label="Primary">
      <div className="in">
        <a href="#home" className="brand" aria-label="TriStar 1947">TriStar <span>1947</span></a>
        <div className={`links${navOpen ? " on" : ""}`} id="links">
          <a className="l" href="#kalinga" onClick={close}>The Kalinga Kitchen</a>
          <a className="l" href="#utkal" onClick={close}>Utkal Biryani House</a>
          <a className="l" href="#chilika" onClick={close}>Chilika Banquet<small>Coming soon</small></a>
          <a className="l alt" href="#story" onClick={close}>Our story</a>
          <a className="l alt" href="#menu-kalinga" onClick={close}>Menu</a>
          <a className="l alt" href="#takeaway" onClick={close}>Takeaway</a>
          <a className="l alt" href="#visit" onClick={close}>Visit</a>
        </div>
        <div className="right">
          <a className="pill sm" href="#reserve">Reserve</a>
          <button className="cart-btn" id="cartBtn" aria-label="Open your order" onClick={() => openCart()}>
            <Icon name="bag" />
            <span className={`cart-count${cartCount > 0 ? " on" : ""}`} id="cartCount">{cartCount}</span>
          </button>
          <button className="burger" id="burger" aria-label="Menu" aria-expanded={navOpen} onClick={() => setNavOpen(!navOpen)}>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
}
