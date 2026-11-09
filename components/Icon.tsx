export type IconName = "plus" | "bag" | "x" | "check";

export function Icon({ name }: { name: IconName }) {
  return (
    <svg className="ic">
      <use href={`#i-${name}`} />
    </svg>
  );
}

/** Zero-size SVG sprite referenced by <Icon/> (rendered once in the layout). */
export function IconSprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></symbol>
        <symbol id="i-bag" viewBox="0 0 24 24"><path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 016 0v2" /></symbol>
        <symbol id="i-x" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" /></symbol>
        <symbol id="i-check" viewBox="0 0 24 24"><path d="M5 12.500l4.500 4.500L19 7.500" /></symbol>
      </defs>
    </svg>
  );
}
