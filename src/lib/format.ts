const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export const formatPrice = (n: number) => money.format(n);

export const formatDate = (iso: string | null) =>
  iso
    ? new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      })
    : "";

export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

/** Rough swatch colours for the colour names used in the catalogue. */
const SWATCH: Record<string, string> = {
  black: "#242322",
  gray: "#cecac7",
  "stone taupe": "#e0d3b8",
  "charcoal gray": "#808080",
  orange: "#ff8a00",
  "sage green": "#89c89e",
  "steel blue": "#465277",
  lavender: "#e4baed",
  "dark green": "#1c3328",
  pink: "#ffc0cb",
  yellow: "#ffe500",
  white: "#f7f7f7",
  red: "#f61f1f",
  green: "#05aa3d",
  brown: "#9a5630",
  beige: "#ead8ab",
  navy: "#282099",
  blue: "#465277",
};
export const swatch = (name: string) => SWATCH[name.toLowerCase()] ?? "#cccccc";
