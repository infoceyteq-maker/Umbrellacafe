/**
 * Cafe-level configuration.
 *
 * ── WhatsApp ordering ────────────────────────────────────────────────
 * Put the cafe's WhatsApp number in international format WITHOUT the
 * "+" or any spaces, e.g. "94771234567" for a Sri Lankan number.
 * While it is empty, the cart shows a "show this screen to your
 * waiter" flow instead of a WhatsApp button.
 */
export const CAFE = {
  name: "Cafe Umbrella",
  tagline: "Ella · Digital Menu",
  location: "Ella, Sri Lanka",
  whatsappNumber: "",
} as const;

export function buildWhatsAppOrderLink(
  lines: string[],
  total: number
): string | null {
  if (!CAFE.whatsappNumber) return null;
  const message = [
    `Hello ${CAFE.name}! I'd like to order:`,
    "",
    ...lines,
    "",
    `Total: Rs. ${total.toLocaleString("en-LK")}`,
  ].join("\n");
  return `https://wa.me/${CAFE.whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;
}
