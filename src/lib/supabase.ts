import { createClient } from "@supabase/supabase-js";
import { AdminMenuItem, CafeOrder, OrderStatus, OrderType } from "@/data/admin";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseKey);
export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl as string, supabaseKey as string)
  : null;

export type MenuRow = {
  id: string;
  name: string;
  category: AdminMenuItem["category"];
  price: number;
  image: string | null;
  ingredients: string[];
  prep_time: string;
  description: string;
  special: boolean;
  spice_level: 1 | 2 | 3;
  active: boolean;
};

export type OrderRow = {
  id: string;
  customer: string;
  contact: string;
  email: string | null;
  items: CafeOrder["items"];
  total: number;
  status: OrderStatus;
  order_type: OrderType;
  payment: CafeOrder["payment"];
  order_date: string;
  order_time: string;
  table_ref: string | null;
};

export function menuToRow(item: AdminMenuItem): MenuRow {
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    price: item.price,
    image: item.image,
    ingredients: item.ingredients,
    prep_time: item.prepTime,
    description: item.description,
    special: Boolean(item.special),
    spice_level: item.spiceLevel ?? 1,
    active: item.active,
  };
}

export function menuFromRow(row: MenuRow): AdminMenuItem {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: Number(row.price),
    image: row.image,
    ingredients: row.ingredients ?? [],
    prepTime: row.prep_time,
    description: row.description,
    special: row.special,
    spiceLevel: row.spice_level ?? 1,
    active: row.active,
  };
}

export function orderToRow(order: CafeOrder): OrderRow {
  return {
    id: order.id,
    customer: order.customer,
    contact: order.contact,
    email: order.email ?? null,
    items: order.items,
    total: order.total,
    status: order.status,
    order_type: order.orderType,
    payment: order.payment,
    order_date: order.date,
    order_time: order.time,
    table_ref: order.table ?? null,
  };
}

export function orderFromRow(row: OrderRow): CafeOrder {
  return {
    id: row.id,
    customer: row.customer,
    contact: row.contact,
    email: row.email ?? undefined,
    items: row.items ?? [],
    total: Number(row.total),
    status: row.status,
    orderType: row.order_type ?? "Dine-in",
    payment: row.payment,
    date: row.order_date,
    time: row.order_time,
    table: row.table_ref ?? undefined,
  };
}
