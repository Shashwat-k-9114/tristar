// localStorage wrapper that never throws (private mode, blocked storage, SSR).
export const store = {
  get<T>(k: string, d: T): T {
    try {
      const v = JSON.parse(localStorage.getItem(k) as string);
      return v == null ? d : (v as T);
    } catch {
      return d;
    }
  },
  set(k: string, v: unknown) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {
      /* ignore */
    }
  },
};

export const CART_KEY = "ts3_cart";
