import { Category, MenuItem } from "./types";

export const MENU_STORAGE_KEY = "umbrellacafe-menu";
export const ORDERS_STORAGE_KEY = "umbrellacafe-orders";
export const ADMIN_SESSION_KEY = "umbrellacafe-admin-session";
export const FLYERS_STORAGE_KEY = "umbrellacafe-flyers";

export type AdminMenuItem = MenuItem & {
  active: boolean;
};

/** A combo / package flyer uploaded by the cafe team. */
export interface ComboFlyer {
  id: string;
  title: string;
  detail: string;
  image: string;
  price: number | null;
  active: boolean;
  createdAt: string;
}

/** A dish counts as an offer when it has a valid, cheaper offer price. */
export function isOnOffer(item: { price: number; offerPrice?: number | null }): boolean {
  return typeof item.offerPrice === "number" && item.offerPrice > 0 && item.offerPrice < item.price;
}

/** Whole-rupee discount percentage, e.g. 20 for "20% off". */
export function discountPercent(item: { price: number; offerPrice?: number | null }): number {
  if (!isOnOffer(item) || !item.price) return 0;
  return Math.round(((item.price - (item.offerPrice as number)) / item.price) * 100);
}

export type OrderStatus = "Preparing" | "Ready" | "Completed" | "Cancelled";
export type OrderType = "Dine-in" | "Takeaway" | "Delivery";

export const orderTypes: OrderType[] = ["Dine-in", "Takeaway", "Delivery"];

export interface OrderLine {
  name: string;
  quantity: number;
  price: number;
}

export interface CafeOrder {
  id: string;
  customer: string;
  contact: string;
  items: OrderLine[];
  total: number;
  status: OrderStatus;
  orderType: OrderType;
  payment: "Cash" | "Card" | "Online";
  date: string;
  time: string;
  table?: string;
}

export const orderStatuses: OrderStatus[] = [
  "Preparing",
  "Ready",
  "Completed",
  "Cancelled",
];

export const statusStyles: Record<OrderStatus, string> = {
  Preparing: "border-lime-400/25 bg-lime-400/10 text-lime-200",
  Ready: "border-[#39ff88]/30 bg-[#39ff88]/10 text-[#7cf7b0]",
  Completed: "border-teal-400/25 bg-teal-400/10 text-teal-200",
  Cancelled: "border-red-400/25 bg-red-400/10 text-red-300",
};

export function createAdminMenu(items: MenuItem[]): AdminMenuItem[] {
  return items.map((item) => ({ ...item, active: true }));
}

export function formatRupees(value: number): string {
  return `Rs. ${value.toLocaleString("en-LK")}`;
}

export function dateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function orderDateLabel(value: string): string {
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-LK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export const adminCategories: Category[] = [
  "Soup",
  "Stews",
  "Omelette",
  "Main Dish",
  "Chopsey",
  "Boiled Vegetables",
  "Signature Roti",
  "Kottu Junction",
];
