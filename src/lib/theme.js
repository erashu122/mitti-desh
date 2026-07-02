// Colors are CSS variables so dark mode (toggled via a `.dark` class on <html>)
// just works everywhere without per-component logic.
export const C = {
  terracotta: "var(--terracotta)",
  clay: "var(--clay)",
  charcoal: "var(--charcoal)",
  bg: "var(--bg)",
  card: "var(--card)",
  gold: "var(--gold)",
  success: "var(--success)",
  danger: "var(--danger)",
  line: "var(--line)",
  cream: "var(--cream)",
};

export const fmt = (n) => "₹" + Number(n).toLocaleString("en-IN");

// products.js stores tint as a short key ("terracotta", "gold"...) — resolve to the CSS var
export const tint = (key) => `var(--${key})`;
