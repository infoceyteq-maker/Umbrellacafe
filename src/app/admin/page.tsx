"use client";

/* Admin image uploads and pasted image URLs are intentionally rendered as-is. */
/* eslint-disable @next/next/no-img-element */

import {
  FormEvent,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { categories, menuItems } from "@/data/menu";
import {
  ADMIN_SESSION_KEY,
  AdminMenuItem,
  adminCategories,
  CafeOrder,
  createAdminMenu,
  dateKey,
  formatRupees,
  MENU_STORAGE_KEY,
  orderDateLabel,
  orderStatuses,
  ORDERS_STORAGE_KEY,
  OrderLine,
  OrderStatus,
  OrderType,
  orderTypes,
  statusStyles,
} from "@/data/admin";
import { Category } from "@/data/types";
import {
  hasSupabaseConfig,
  menuFromRow,
  menuToRow,
  orderFromRow,
  orderToRow,
  supabase,
} from "@/lib/supabase";

const inputClass =
  "mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#100b0d] px-3.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-400/60 focus:bg-[#160d0f] focus:ring-2 focus:ring-orange-400/10";
const textareaClass =
  "mt-2 min-h-24 w-full resize-y rounded-xl border border-white/10 bg-[#100b0d] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-400/60 focus:bg-[#160d0f] focus:ring-2 focus:ring-orange-400/10";

const navItems = [
  { id: "overview", label: "Overview", icon: "grid" },
  { id: "menu", label: "Menu items", icon: "plate" },
  { id: "orders", label: "Orders", icon: "receipt" },
  { id: "sales", label: "Sales & bills", icon: "chart" },
] as const;
type AdminTab = (typeof navItems)[number]["id"];

type MenuForm = {
  name: string;
  category: Category;
  price: string;
  image: string;
  description: string;
  ingredients: string;
  prepTime: string;
  special: boolean;
};

type NewOrderForm = {
  customer: string;
  contact: string;
  email: string;
  table: string;
  orderType: OrderType;
  payment: CafeOrder["payment"];
};

function todayAt(daysAgo: number, hour: number, minute: number): { date: string; time: string } {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const time = new Date(date);
  time.setHours(hour, minute, 0, 0);
  return {
    date: dateKey(date),
    time: time.toLocaleTimeString("en-LK", { hour: "2-digit", minute: "2-digit" }),
  };
}

function seedOrders(): CafeOrder[] {
  const dish = (id: string) => menuItems.find((item) => item.id === id) ?? menuItems[0];
  const line = (id: string, quantity: number): OrderLine => {
    const item = dish(id);
    return { name: item.name, quantity, price: item.price };
  };
  const total = (lines: OrderLine[]) =>
    lines.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const records = [
    { id: "1047", name: "Nimesha Perera", contact: "+94 77 428 1290", email: "nimesha.p@email.com", item: [line("legend-kottu", 1), line("coconut-sambol-roti", 1)], ago: 0, hour: 19, minute: 42, status: "Preparing" as OrderStatus, payment: "Cash" as const, table: "T-04" },
    { id: "1046", name: "Daniel Cooper", contact: "+94 71 882 4018", email: "daniel.cooper@email.com", item: [line("grilled-fish-platter", 1), line("mushroom-cream-soup", 1)], ago: 0, hour: 18, minute: 58, status: "Ready" as OrderStatus, payment: "Card" as const, table: "T-02" },
    { id: "1045", name: "Sahan Fernando", contact: "+94 76 221 9073", email: "", item: [line("pepper-chicken-mash", 2)], ago: 0, hour: 17, minute: 35, status: "Completed" as OrderStatus, payment: "Online" as const, table: "T-08" },
    { id: "1044", name: "Amelia Wright", contact: "+94 75 154 3320", email: "amelia.wright@gmail.com", item: [line("seafood-kottu", 1), line("chicken-corn-soup", 2)], ago: 1, hour: 20, minute: 14, status: "Completed" as OrderStatus, payment: "Card" as const, table: "T-05" },
    { id: "1043", name: "Kavindu Silva", contact: "+94 70 390 1122", email: "", item: [line("chicken-chopsey", 1), line("cheese-egg-roti", 2)], ago: 2, hour: 18, minute: 27, status: "Completed" as OrderStatus, payment: "Cash" as const, table: "T-01" },
    { id: "1042", name: "Maya Patel", contact: "+94 72 611 4890", email: "maya.patel@inbox.com", item: [line("beef-stew", 1)], ago: 3, hour: 19, minute: 6, status: "Completed" as OrderStatus, payment: "Online" as const, table: "T-06" },
    { id: "1041", name: "Tharushi Jayawardena", contact: "+94 78 044 8321", email: "", item: [line("spanish-omelette", 1), line("boiled-vegetables", 1)], ago: 5, hour: 17, minute: 42, status: "Completed" as OrderStatus, payment: "Cash" as const, table: "T-03" },
    { id: "1040", name: "Oliver Brown", contact: "+94 71 302 5591", email: "oliver.brown@hello.com", item: [line("chicken-corn-soup", 1), line("coconut-sambol-roti", 1)], ago: 6, hour: 20, minute: 3, status: "Completed" as OrderStatus, payment: "Card" as const, table: "T-07" },
  ];

  return records.map((record) => {
    const stamp = todayAt(record.ago, record.hour, record.minute);
    return {
      id: record.id,
      customer: record.name,
      contact: record.contact,
      email: record.email || undefined,
      items: record.item,
      total: total(record.item),
      status: record.status,
      orderType: record.id === "1044" ? "Delivery" : record.id === "1041" ? "Takeaway" : "Dine-in",
      payment: record.payment,
      date: stamp.date,
      time: stamp.time,
      table: record.table,
    };
  });
}

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (name === "grid") return <svg {...common}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>;
  if (name === "plate") return <svg {...common}><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="5" /><path d="M3.5 5.5h3M17.5 5.5h3M4 18.5h2M18 18.5h2" /></svg>;
  if (name === "receipt") return <svg {...common}><path d="M5 3.5h14v17l-2.5-1.7-2.3 1.7-2.2-1.7-2.3 1.7-2.2-1.7L5 20.5v-17Z" /><path d="M8.5 8h7M8.5 11.5h7M8.5 15h4" /></svg>;
  if (name === "chart") return <svg {...common}><path d="M4 19.5V4.5M4 19.5h17" /><path d="m7.5 15 3-3 2.5 1.5 5-6" /><path d="M18 7.5h.01" /></svg>;
  if (name === "plus") return <svg {...common}><path d="M12 5v14M5 12h14" /></svg>;
  if (name === "arrow") return <svg {...common}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
  if (name === "search") return <svg {...common}><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></svg>;
  if (name === "bell") return <svg {...common}><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" /></svg>;
  if (name === "chevron") return <svg {...common}><path d="m9 18 6-6-6-6" /></svg>;
  if (name === "down") return <svg {...common}><path d="m6 9 6 6 6-6" /></svg>;
  if (name === "dots") return <svg {...common}><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" /></svg>;
  if (name === "edit") return <svg {...common}><path d="m4 16.5-.7 3.7 3.7-.7L18.8 7.7a2.1 2.1 0 0 0-3-3L4 16.5Z" /><path d="m14.5 6.5 3 3" /></svg>;
  if (name === "trash") return <svg {...common}><path d="M4 7h16M10 11v5M14 11v5M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>;
  if (name === "eye") return <svg {...common}><path d="M2.5 12s3.2-5 9.5-5 9.5 5 9.5 5-3.2 5-9.5 5-9.5-5-9.5-5Z" /><circle cx="12" cy="12" r="2" /></svg>;
  if (name === "download") return <svg {...common}><path d="M12 3v12M7 10l5 5 5-5M5 21h14" /></svg>;
  if (name === "print") return <svg {...common}><path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path d="M6 14h12v7H6zM17 12h1" /></svg>;
  if (name === "close") return <svg {...common}><path d="m6 6 12 12M18 6 6 18" /></svg>;
  if (name === "logout") return <svg {...common}><path d="M10 4H5v16h5M14 8l4 4-4 4M18 12H9" /></svg>;
  if (name === "phone") return <svg {...common}><path d="M6.5 3.5 9 3l2 5-2 1.5a15 15 0 0 0 5.5 5.5L16 13l5 2-.5 2.5a3 3 0 0 1-3.5 2.3C10.2 18.7 5.3 13.8 4.2 7a3 3 0 0 1 2.3-3.5Z" /></svg>;
  if (name === "mail") return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>;
  if (name === "user") return <svg {...common}><circle cx="12" cy="8" r="3.3" /><path d="M5 20c.8-3.3 3-5 7-5s6.2 1.7 7 5" /></svg>;
  if (name === "check") return <svg {...common}><path d="m5 12 4.3 4.3L19 6.7" /></svg>;
  if (name === "spark") return <svg {...common}><path d="m12 3 1.4 5.6L19 10l-5.6 1.4L12 17l-1.4-5.6L5 10l5.6-1.4L12 3ZM19 16l.6 2.4L22 19l-2.4.6L19 22l-.6-2.4L16 19l2.4-.6L19 16Z" /></svg>;
  return <svg {...common}><circle cx="12" cy="12" r="8" /></svg>;
}

function PanelModal({
  title,
  eyebrow,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  eyebrow?: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="admin-modal fixed inset-0 z-[100] flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-5" onMouseDown={onClose}>
      <div className={`admin-modal-panel max-h-[94vh] w-full overflow-y-auto rounded-t-[28px] border border-white/10 bg-[#140c0e] shadow-[0_28px_90px_rgba(0,0,0,0.65)] sm:rounded-[26px] ${wide ? "max-w-3xl" : "max-w-xl"}`} onMouseDown={(event) => event.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-white/[0.07] bg-[#140c0e]/95 px-5 py-5 backdrop-blur-xl sm:px-7">
          <div>
            {eyebrow && <p className="admin-eyebrow">{eyebrow}</p>}
            <h2 className="mt-1 font-display text-xl font-semibold tracking-tight text-white">{title}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="admin-icon-btn"><Icon name="close" size={18} /></button>
        </div>
        <div className="p-5 sm:p-7">{children}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusStyles[status]}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{status}</span>;
}

function OrderTypeBadge({ type }: { type: OrderType }) {
  const details: Record<OrderType, { icon: string; className: string }> = {
    "Dine-in": { icon: "🍽", className: "border-violet-400/20 bg-violet-400/10 text-violet-200" },
    Takeaway: { icon: "🥡", className: "border-amber-400/20 bg-amber-400/10 text-amber-200" },
    Delivery: { icon: "🛵", className: "border-cyan-400/20 bg-cyan-400/10 text-cyan-200" },
  };
  const detail = details[type] ?? details["Dine-in"];
  return <span className={`inline-flex w-fit items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-medium ${detail.className}`}><span>{detail.icon}</span>{type}</span>;
}

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.015] px-6 py-16 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-400/10 text-orange-300"><Icon name="search" /></div><p className="mt-4 text-sm font-medium text-white">{title}</p><p className="mt-1 text-xs text-zinc-500">{detail}</p></div>;
}

export default function AdminPage() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [menu, setMenu] = useState<AdminMenuItem[]>(() => createAdminMenu(menuItems));
  const [orders, setOrders] = useState<CafeOrder[]>(() => seedOrders());
  const [menuSearch, setMenuSearch] = useState("");
  const [menuCategory, setMenuCategory] = useState<"All" | Category>("All");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderFilter, setOrderFilter] = useState<"All" | OrderStatus>("All");
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminMenuItem | null>(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<CafeOrder | null>(null);
  const [newOrderForm, setNewOrderForm] = useState<NewOrderForm>({ customer: "", contact: "", email: "", table: "", orderType: "Dine-in", payment: "Cash" });
  const [newOrderLines, setNewOrderLines] = useState<Record<string, number>>({});
  const [menuForm, setMenuForm] = useState<MenuForm>({ name: "", category: categories[0], price: "", image: "", description: "", ingredients: "", prepTime: "15 Mins", special: false });
  const [toast, setToast] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "offline">(hasSupabaseConfig ? "checking" : "offline");
  const toastTimer = useRef<number | null>(null);

  useEffect(() => {
    const session = window.localStorage.getItem(ADMIN_SESSION_KEY);
    const savedMenu = window.localStorage.getItem(MENU_STORAGE_KEY);
    const savedOrders = window.localStorage.getItem(ORDERS_STORAGE_KEY);
    // Browser storage is the session source for this client-only admin panel.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (session === "active") setAuthenticated(true);
    if (savedMenu) {
      try {
        const parsed = JSON.parse(savedMenu) as AdminMenuItem[];
        if (Array.isArray(parsed) && parsed.length) setMenu(parsed);
      } catch { /* use the starter menu */ }
    }
    if (savedOrders) {
      try {
        const parsed = JSON.parse(savedOrders) as CafeOrder[];
        if (Array.isArray(parsed)) setOrders(parsed.map((order) => ({ ...order, orderType: order.orderType ?? "Dine-in" })));
      } catch { /* use the starter orders */ }
    }

    if (!supabase) {
      setConnectionStatus("offline");
      setCheckingSession(false);
      return;
    }

    void (async () => {
      const [menuResult, orderResult] = await Promise.all([
        supabase.from("menu_items").select("*").order("created_at", { ascending: false }),
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
      ]);
      if (menuResult.error || orderResult.error) {
        setConnectionStatus("offline");
        return;
      }
      if (menuResult.data?.length) setMenu(menuResult.data.map((row) => menuFromRow(row)));
      if (orderResult.data?.length) setOrders(orderResult.data.map((row) => orderFromRow(row)));
      setConnectionStatus("connected");
    })();
    setCheckingSession(false);
  }, []);

  useEffect(() => {
    if (!checkingSession) window.localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(menu));
  }, [menu, checkingSession]);

  useEffect(() => {
    if (!checkingSession) window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders, checkingSession]);

  function showToast(message: string) {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2800);
  }

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (username.trim().toLowerCase() === "admin" && password === "umbrella123") {
      window.localStorage.setItem(ADMIN_SESSION_KEY, "active");
      setAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("That username or password is not recognised.");
    }
  }

  function logout() {
    window.localStorage.removeItem(ADMIN_SESSION_KEY);
    setAuthenticated(false);
    setPassword("");
  }

  function openNewMenuItem() {
    setEditingItem(null);
    setMenuForm({ name: "", category: categories[0], price: "", image: "", description: "", ingredients: "", prepTime: "15 Mins", special: false });
    setMenuModalOpen(true);
  }

  function openEditMenuItem(item: AdminMenuItem) {
    setEditingItem(item);
    setMenuForm({ name: item.name, category: item.category, price: String(item.price), image: item.image ?? "", description: item.description, ingredients: item.ingredients.join(", "), prepTime: item.prepTime, special: Boolean(item.special) });
    setMenuModalOpen(true);
  }

  function saveMenuItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const price = Number(menuForm.price);
    if (!menuForm.name.trim() || !price || price < 0) {
      showToast("Add a name and a valid price first");
      return;
    }
    const item: AdminMenuItem = {
      id: editingItem?.id ?? `${menuForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
      name: menuForm.name.trim(),
      category: menuForm.category,
      price,
      image: menuForm.image.trim() || null,
      ingredients: menuForm.ingredients.split(",").map((value) => value.trim()).filter(Boolean),
      prepTime: menuForm.prepTime.trim() || "15 Mins",
      description: menuForm.description.trim() || "A Cafe Umbrella favourite, prepared fresh to order.",
      special: menuForm.special,
      spiceLevel: editingItem?.spiceLevel ?? 1,
      active: editingItem?.active ?? true,
    };
    setMenu((current) => editingItem ? current.map((entry) => entry.id === editingItem.id ? item : entry) : [item, ...current]);
    if (supabase) {
      void supabase.from("menu_items").upsert(menuToRow(item)).then(({ error }) => {
        if (error) showToast("Saved locally, but Supabase needs its tables created");
      });
    }
    setMenuModalOpen(false);
    showToast(editingItem ? "Menu item updated" : "New dish added to the menu");
  }

  function removeMenuItem(id: string) {
    const item = menu.find((entry) => entry.id === id);
    if (!item || !window.confirm(`Remove ${item.name} from the menu?`)) return;
    setMenu((current) => current.filter((entry) => entry.id !== id));
    if (supabase) {
      void supabase.from("menu_items").delete().eq("id", id).then(({ error }) => {
        if (error) showToast("Removed locally, but Supabase needs its tables created");
      });
    }
    showToast("Menu item removed");
  }

  function toggleMenuItem(id: string) {
    const currentItem = menu.find((item) => item.id === id);
    if (!currentItem) return;
    const updatedItem = { ...currentItem, active: !currentItem.active };
    setMenu((current) => current.map((item) => item.id === id ? updatedItem : item));
    if (supabase) {
      void supabase.from("menu_items").upsert(menuToRow(updatedItem)).then(({ error }) => {
        if (error) showToast("Updated locally, but Supabase needs its tables created");
      });
    }
  }

  function handleImageFile(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setMenuForm((current) => ({ ...current, image: String(reader.result) }));
    reader.readAsDataURL(file);
  }

  function updateOrderStatus(id: string, status: OrderStatus) {
    setOrders((current) => current.map((order) => order.id === id ? { ...order, status } : order));
    setSelectedOrder((current) => current?.id === id ? { ...current, status } : current);
    if (supabase) {
      void supabase.from("orders").update({ status }).eq("id", id).then(({ error }) => {
        if (error) showToast("Updated locally, but Supabase needs its tables created");
      });
    }
    showToast(`Order #${id} marked ${status.toLowerCase()}`);
  }

  function updateOrderType(id: string, orderType: OrderType) {
    setOrders((current) => current.map((order) => order.id === id ? { ...order, orderType } : order));
    setSelectedOrder((current) => current?.id === id ? { ...current, orderType } : current);
    if (supabase) {
      void supabase.from("orders").update({ order_type: orderType }).eq("id", id).then(({ error }) => {
        if (error) showToast("Updated locally, but Supabase needs its tables created");
      });
    }
    showToast(`Order #${id} set to ${orderType}`);
  }

  function openOrderModal() {
    setNewOrderForm({ customer: "", contact: "", email: "", table: "", orderType: "Dine-in", payment: "Cash" });
    setNewOrderLines(activeMenu[0] ? { [activeMenu[0].id]: 1 } : {});
    setOrderModalOpen(true);
  }

  function saveNewOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const lines: OrderLine[] = menu.filter((item) => newOrderLines[item.id] > 0).map((item) => ({ name: item.name, quantity: newOrderLines[item.id], price: item.price }));
    if (!newOrderForm.customer.trim() || !newOrderForm.contact.trim()) {
      showToast("Customer name and phone number are required");
      return;
    }
    if (!lines.length) {
      showToast("Add at least one dish to the order");
      return;
    }
    const newId = String(Math.max(...orders.map((order) => Number(order.id)), 1047) + 1);
    const now = new Date();
    const newOrder: CafeOrder = {
      id: newId,
      customer: newOrderForm.customer.trim(),
      contact: newOrderForm.contact.trim(),
      email: newOrderForm.email.trim() || undefined,
      items: lines,
      total: lines.reduce((sum, line) => sum + line.price * line.quantity, 0),
      status: "Preparing",
      orderType: newOrderForm.orderType,
      payment: newOrderForm.payment,
      date: dateKey(now),
      time: now.toLocaleTimeString("en-LK", { hour: "2-digit", minute: "2-digit" }),
      table: newOrderForm.table.trim() || undefined,
    };
    setOrders((current) => [newOrder, ...current]);
    if (supabase) {
      void supabase.from("orders").upsert(orderToRow(newOrder)).then(({ error }) => {
        if (error) showToast("Saved locally, but Supabase needs its tables created");
      });
    }
    setOrderModalOpen(false);
    showToast(`Order #${newId} added successfully`);
  }

  const today = dateKey(new Date());
  const activeMenu = menu.filter((item) => item.active);
  const todayOrders = orders.filter((order) => order.date === today && order.status !== "Cancelled");
  const todaySales = todayOrders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter((order) => order.status === "Preparing" || order.status === "Ready");
  const averageOrder = todayOrders.length ? Math.round(todaySales / todayOrders.length) : 0;

  const sevenDayData = useMemo(() => Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    const key = dateKey(date);
    const total = orders.filter((order) => order.date === key && order.status !== "Cancelled").reduce((sum, order) => sum + order.total, 0);
    return { key, total, label: date.toLocaleDateString("en-LK", { weekday: "short" }), day: date.getDate() };
  }), [orders]);
  const maxSales = Math.max(...sevenDayData.map((day) => day.total), 1);

  const filteredMenu = menu.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase()) || item.category.toLowerCase().includes(menuSearch.toLowerCase());
    const matchesCategory = menuCategory === "All" || item.category === menuCategory;
    return matchesSearch && matchesCategory;
  });
  const filteredOrders = orders.filter((order) => {
    const search = orderSearch.toLowerCase();
    const matchesSearch = order.id.includes(search) || order.customer.toLowerCase().includes(search) || order.contact.toLowerCase().includes(search);
    return matchesSearch && (orderFilter === "All" || order.status === orderFilter);
  });
  const topDishes = useMemo(() => {
    const counts = new Map<string, number>();
    orders.forEach((order) => order.items.forEach((item) => counts.set(item.name, (counts.get(item.name) ?? 0) + item.quantity)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
  }, [orders]);

  if (checkingSession) return <div className="admin-login-bg flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-300/20 border-t-orange-400" /></div>;
  if (!authenticated) return <LoginScreen username={username} password={password} error={loginError} onUsername={setUsername} onPassword={setPassword} onSubmit={handleLogin} />;

  return (
    <div className="admin-shell min-h-screen">
      <aside className="admin-sidebar hidden lg:flex">
        <div className="flex items-center gap-3 px-7 py-7">
          <Image src="/logo/logo.png" alt="Umbrella Art Cafe" width={132} height={120} priority className="h-10 w-auto object-contain drop-shadow-[0_0_12px_rgba(45,214,198,0.18)]" />
          <div><p className="font-display text-[15px] font-bold text-white">Cafe <span className="text-gradient-fire">Umbrella</span></p><p className="mt-0.5 text-[9px] uppercase tracking-[0.3em] text-orange-300/55">Admin studio</p></div>
        </div>
        <div className="px-4"><p className="admin-nav-label">Workspace</p><nav className="mt-3 space-y-1">{navItems.map((item) => <NavButton key={item.id} item={item} active={activeTab === item.id} onClick={() => setActiveTab(item.id)} />)}</nav></div>
        <div className="mt-auto px-5 pb-7">
          <div className="admin-side-tip"><span className="mb-3 flex h-8 w-8 items-center justify-center rounded-xl bg-orange-400/15 text-orange-300"><Icon name="spark" size={16} /></span><p className="text-xs font-medium text-white">Keep the menu fresh</p><p className="mt-1 text-[11px] leading-relaxed text-zinc-500">Seasonal specials are a lovely way to bring guests back.</p><button type="button" onClick={openNewMenuItem} className="mt-3 text-[11px] font-semibold text-orange-300 hover:text-orange-200">Add a special <span className="ml-1">→</span></button></div>
          <button type="button" onClick={logout} className="mt-5 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs text-zinc-500 transition hover:bg-white/[0.04] hover:text-white"><Icon name="logout" size={16} /> Sign out</button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="admin-topbar">
          <div className="flex items-center gap-3 lg:hidden"><Image src="/logo/logo.png" alt="Umbrella Art Cafe" width={106} height={96} priority className="h-8 w-auto object-contain" /><span className="font-display text-sm font-bold text-white">Cafe <span className="text-gradient-fire">Umbrella</span></span></div>
          <div className="hidden lg:block"><p className="text-xs text-zinc-500">Cafe Umbrella / <span className="text-zinc-300">{navItems.find((item) => item.id === activeTab)?.label}</span></p></div>
          <div className="ml-auto flex items-center gap-2 sm:gap-4"><span className={`hidden items-center gap-2 rounded-full border px-2.5 py-1.5 text-[10px] font-medium sm:flex ${connectionStatus === "connected" ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300" : connectionStatus === "checking" ? "border-orange-400/20 bg-orange-400/10 text-orange-200" : "border-white/10 bg-white/[0.03] text-zinc-500"}`}><span className={`h-1.5 w-1.5 rounded-full ${connectionStatus === "connected" ? "bg-emerald-400" : connectionStatus === "checking" ? "animate-pulse bg-orange-400" : "bg-zinc-600"}`} />{connectionStatus === "connected" ? "Supabase connected" : connectionStatus === "checking" ? "Checking database" : hasSupabaseConfig ? "Run SQL setup" : "Local demo"}</span><a href="/" target="_blank" rel="noreferrer" className="hidden items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-medium text-zinc-400 transition hover:border-orange-400/30 hover:text-white sm:flex"><Icon name="eye" size={15} /> View site</a><button type="button" aria-label="Notifications" className="admin-icon-btn relative"><Icon name="bell" size={18} /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-orange-400" /></button><div className="hidden h-7 w-px bg-white/10 sm:block" /><div className="flex items-center gap-2.5"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-300 to-red-600 text-xs font-bold text-[#2e0904]">A</div><div className="hidden leading-tight sm:block"><p className="text-xs font-semibold text-white">Admin</p><p className="text-[10px] text-zinc-500">Manager</p></div><button type="button" onClick={logout} className="ml-1 text-zinc-500 hover:text-white lg:hidden" aria-label="Sign out"><Icon name="logout" size={16} /></button></div></div>
        </header>

        <main className="admin-main">
          <div className="mx-auto max-w-[1440px]">
            {activeTab === "overview" && <OverviewView todaySales={todaySales} todayOrders={todayOrders} pendingOrders={pendingOrders} averageOrder={averageOrder} sevenDayData={sevenDayData} maxSales={maxSales} topDishes={topDishes} orders={orders} onNavigate={setActiveTab} onSelectOrder={setSelectedOrder} onAddOrder={openOrderModal} />}
            {activeTab === "menu" && <MenuView menu={menu} filteredMenu={filteredMenu} search={menuSearch} category={menuCategory} onSearch={setMenuSearch} onCategory={setMenuCategory} onAdd={openNewMenuItem} onEdit={openEditMenuItem} onDelete={removeMenuItem} onToggle={toggleMenuItem} />}
            {activeTab === "orders" && <OrdersView orders={filteredOrders} allOrders={orders} search={orderSearch} filter={orderFilter} onSearch={setOrderSearch} onFilter={setOrderFilter} onStatus={updateOrderStatus} onSelect={setSelectedOrder} onAdd={openOrderModal} />}
            {activeTab === "sales" && <SalesView orders={orders} data={sevenDayData} maxSales={maxSales} onSelect={setSelectedOrder} />}
          </div>
        </main>
        <nav className="admin-mobile-nav lg:hidden">{navItems.map((item) => <NavButton key={item.id} item={item} active={activeTab === item.id} onClick={() => setActiveTab(item.id)} mobile />)}</nav>
      </div>

      {menuModalOpen && <MenuEditor form={menuForm} editing={Boolean(editingItem)} onChange={setMenuForm} onImage={handleImageFile} onSubmit={saveMenuItem} onClose={() => setMenuModalOpen(false)} />}
      {orderModalOpen && <NewOrderModal menu={activeMenu} values={newOrderForm} lines={newOrderLines} onValues={setNewOrderForm} onLines={setNewOrderLines} onSubmit={saveNewOrder} onClose={() => setOrderModalOpen(false)} />}
      {selectedOrder && <OrderDetail order={selectedOrder} onClose={() => setSelectedOrder(null)} onStatus={updateOrderStatus} onType={updateOrderType} />}
      {toast && <div className="admin-toast"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300"><Icon name="check" size={15} /></span>{toast}</div>}
    </div>
  );
}

function LoginScreen({ username, password, error, onUsername, onPassword, onSubmit }: { username: string; password: string; error: string; onUsername: (value: string) => void; onPassword: (value: string) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <div className="admin-login-bg flex min-h-screen items-center justify-center overflow-hidden px-4 py-8"><div className="admin-login-orb admin-login-orb-one" /><div className="admin-login-orb admin-login-orb-two" /><div className="relative z-10 w-full max-w-[430px]"><div className="mb-8 text-center"><div className="mx-auto flex h-16 w-28 items-center justify-center rounded-[22px] border border-orange-300/25 bg-[#170b0d] px-3 shadow-[0_0_55px_rgba(255,84,15,0.17)]"><Image src="/logo/logo.png" alt="Umbrella Art Cafe" width={150} height={135} priority className="h-12 w-auto object-contain" /></div><p className="mt-5 font-display text-lg font-bold text-white">Cafe <span className="text-gradient-fire">Umbrella</span></p><p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.32em] text-orange-300/55">Ella · admin studio</p></div><div className="rounded-[28px] border border-white/10 bg-[#130b0d]/90 p-6 shadow-[0_28px_90px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-8"><p className="admin-eyebrow">Good to see you</p><h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-white">Welcome back</h1><p className="mt-2 text-sm leading-relaxed text-zinc-500">Sign in to manage dishes, orders and daily sales.</p><form onSubmit={onSubmit} className="mt-7 space-y-4"><label className="block text-xs font-medium text-zinc-300">Username<input autoComplete="username" value={username} onChange={(event) => onUsername(event.target.value)} className={inputClass} placeholder="Enter username" /></label><label className="block text-xs font-medium text-zinc-300">Password<input autoComplete="current-password" type="password" value={password} onChange={(event) => onPassword(event.target.value)} className={inputClass} placeholder="Enter password" /></label>{error && <p className="rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2.5 text-xs text-red-300">{error}</p>}<button type="submit" className="admin-primary-btn mt-2 w-full justify-center">Sign in <Icon name="arrow" size={16} /></button></form><div className="mt-6 border-t border-white/[0.07] pt-5"><p className="text-center text-[11px] text-zinc-600">Demo access · <span className="text-zinc-400">admin</span> / <span className="text-zinc-400">umbrella123</span></p></div></div><p className="mt-6 text-center text-[11px] text-zinc-600">Private workspace · Cafe Umbrella, Ella</p></div></div>;
}

function NavButton({ item, active, onClick, mobile = false }: { item: (typeof navItems)[number]; active: boolean; onClick: () => void; mobile?: boolean }) {
  return <button type="button" onClick={onClick} className={`${mobile ? "admin-mobile-nav-item" : "admin-nav-item"} ${active ? "is-active" : ""}`}><Icon name={item.icon} size={mobile ? 17 : 18} /><span>{item.label}</span>{!mobile && item.id === "orders" && <span className="ml-auto rounded-full bg-orange-400/15 px-2 py-0.5 text-[10px] text-orange-300">3</span>}</button>;
}

function PageHeading({ eyebrow, title, detail, action }: { eyebrow: string; title: string; detail: string; action?: ReactNode }) {
  return <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="admin-eyebrow">{eyebrow}</p><h1 className="mt-2 font-display text-[28px] font-semibold tracking-[-0.03em] text-white sm:text-[34px]">{title}</h1><p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-500">{detail}</p></div>{action}</div>;
}

function StatCard({ label, value, change, icon, accent = "orange" }: { label: string; value: string; change: string; icon: string; accent?: "orange" | "green" | "blue" | "red" }) {
  return <div className="admin-card relative overflow-hidden p-5"><div className={`admin-stat-glow ${accent}`} /><div className="relative flex items-start justify-between"><div><p className="text-xs font-medium text-zinc-500">{label}</p><p className="mt-3 font-display text-[25px] font-semibold tracking-tight text-white">{value}</p><p className={`mt-2 text-[11px] ${change.startsWith("+") ? "text-emerald-300" : "text-zinc-500"}`}>{change}</p></div><div className={`admin-stat-icon ${accent}`}><Icon name={icon} size={17} /></div></div></div>;
}

function OverviewView({ todaySales, todayOrders, pendingOrders, averageOrder, sevenDayData, maxSales, topDishes, orders, onNavigate, onSelectOrder, onAddOrder }: { todaySales: number; todayOrders: CafeOrder[]; pendingOrders: CafeOrder[]; averageOrder: number; sevenDayData: { key: string; total: number; label: string; day: number }[]; maxSales: number; topDishes: [string, number][]; orders: CafeOrder[]; onNavigate: (tab: AdminTab) => void; onSelectOrder: (order: CafeOrder) => void; onAddOrder: () => void }) {
  const firstName = "Admin";
  const dayLabel = new Date().toLocaleDateString("en-LK", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
  return <div className="space-y-7"><PageHeading eyebrow={dayLabel} title={`Good morning, ${firstName}`} detail="Here is what is happening at Cafe Umbrella today." action={<div className="flex gap-2.5"><button type="button" onClick={() => onNavigate("sales")} className="admin-secondary-btn"><Icon name="chart" size={16} /> View report</button><button type="button" onClick={onAddOrder} className="admin-primary-btn"><Icon name="plus" size={16} /> New order</button></div>} /><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Today's sales" value={formatRupees(todaySales)} change="+12.8% from yesterday" icon="chart" /><StatCard label="Orders today" value={String(todayOrders.length).padStart(2, "0")} change="+4 orders this week" icon="receipt" accent="blue" /><StatCard label="Waiting to serve" value={String(pendingOrders.length).padStart(2, "0")} change="Needs attention" icon="bell" accent="red" /><StatCard label="Average order" value={formatRupees(averageOrder)} change="+6.4% from last week" icon="spark" accent="green" /></div><div className="grid gap-5 xl:grid-cols-[1.55fr_1fr]"><section className="admin-card p-5 sm:p-6"><div className="flex items-start justify-between"><div><p className="text-sm font-semibold text-white">Sales overview</p><p className="mt-1 text-xs text-zinc-500">Revenue performance over the last 7 days</p></div><span className="rounded-lg border border-white/10 bg-white/[0.025] px-2.5 py-1.5 text-[11px] text-zinc-400">Last 7 days <Icon name="down" size={12} /></span></div><div className="mt-8 flex h-[210px] items-end gap-2.5 sm:gap-4">{sevenDayData.map((day) => <div key={day.key} className="group flex h-full flex-1 flex-col items-center justify-end gap-2"><div className="relative flex h-full w-full items-end"><div className="admin-chart-tooltip">{formatRupees(day.total)}</div><div className={`admin-bar w-full rounded-t-lg transition-all duration-500 ${day.key === dateKey(new Date()) ? "is-today" : ""}`} style={{ height: `${Math.max(day.total ? (day.total / maxSales) * 100 : 4, 4)}%` }} /></div><div className="text-center"><p className="text-[10px] font-medium text-zinc-500">{day.label}</p><p className="mt-0.5 text-[10px] text-zinc-700">{day.day}</p></div></div>)}</div><div className="mt-5 flex items-center gap-2 text-[11px] text-zinc-600"><span className="h-2 w-2 rounded-full bg-orange-400" /> Revenue <span className="ml-3 h-2 w-2 rounded-full bg-white/10" /> No sales recorded</div></section><section className="admin-card p-5 sm:p-6"><div className="flex items-start justify-between"><div><p className="text-sm font-semibold text-white">Top dishes</p><p className="mt-1 text-xs text-zinc-500">Most ordered this week</p></div><button type="button" onClick={() => onNavigate("menu")} className="text-xs font-medium text-orange-300 hover:text-orange-200">View menu <span className="ml-1">→</span></button></div><div className="mt-6 space-y-4">{topDishes.length ? topDishes.map(([name, count], index) => <div key={name} className="flex items-center gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-xs font-semibold text-orange-300">0{index + 1}</span><div className="min-w-0 flex-1"><p className="truncate text-xs font-medium text-zinc-200">{name}</p><div className="mt-2 h-1 rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500" style={{ width: `${Math.max(25, (count / topDishes[0][1]) * 100)}%` }} /></div></div><span className="text-[11px] text-zinc-500">{count} sold</span></div>) : <p className="py-8 text-center text-xs text-zinc-600">No order data yet.</p>}</div></section></div><section className="admin-card overflow-hidden"><div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-5 sm:px-6"><div><p className="text-sm font-semibold text-white">Recent orders</p><p className="mt-1 text-xs text-zinc-500">Keep an eye on the latest tickets</p></div><button type="button" onClick={() => onNavigate("orders")} className="text-xs font-medium text-orange-300 hover:text-orange-200">All orders <span className="ml-1">→</span></button></div><div className="divide-y divide-white/[0.055]">{orders.slice(0, 5).map((order) => <OrderRow key={order.id} order={order} onClick={() => onSelectOrder(order)} />)}</div></section></div>;
}

function OrderRow({ order, onClick }: { order: CafeOrder; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="group flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-white/[0.025] sm:px-6"><span className="hidden h-9 w-9 items-center justify-center rounded-xl bg-orange-400/10 text-orange-300 sm:flex"><Icon name="receipt" size={16} /></span><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><span className="text-xs font-semibold text-white">#{order.id}</span><span className="text-[11px] text-zinc-600">{order.time}</span></div><div className="mt-1 flex min-w-0 items-center gap-2"><p className="truncate text-xs text-zinc-500">{order.customer} · {order.items.map((item) => `${item.quantity}× ${item.name}`).join(", ")}</p><OrderTypeBadge type={order.orderType} /></div></div><StatusBadge status={order.status} /><span className="hidden w-24 text-right text-sm font-semibold text-white sm:block">{formatRupees(order.total)}</span><Icon name="chevron" size={15} /></button>;
}

function MenuView({ menu, filteredMenu, search, category, onSearch, onCategory, onAdd, onEdit, onDelete, onToggle }: { menu: AdminMenuItem[]; filteredMenu: AdminMenuItem[]; search: string; category: "All" | Category; onSearch: (value: string) => void; onCategory: (value: "All" | Category) => void; onAdd: () => void; onEdit: (item: AdminMenuItem) => void; onDelete: (id: string) => void; onToggle: (id: string) => void }) {
  return <div className="space-y-7"><PageHeading eyebrow="Menu management" title="Your menu, your way" detail={`${menu.length} dishes in the catalogue · ${menu.filter((item) => item.active).length} visible to guests`} action={<button type="button" onClick={onAdd} className="admin-primary-btn"><Icon name="plus" size={16} /> Add food item</button>} /><div className="admin-card overflow-hidden"><div className="flex flex-col gap-3 border-b border-white/[0.07] p-4 sm:flex-row sm:items-center sm:p-5"><div className="relative min-w-0 flex-1"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"><Icon name="search" size={16} /></span><input value={search} onChange={(event) => onSearch(event.target.value)} className="h-10 w-full rounded-xl border border-white/10 bg-[#0f090b] pl-9 pr-3 text-xs text-white outline-none placeholder:text-zinc-600 focus:border-orange-400/50" placeholder="Search dishes..." /></div><select value={category} onChange={(event) => onCategory(event.target.value as "All" | Category)} className="h-10 rounded-xl border border-white/10 bg-[#0f090b] px-3 text-xs text-zinc-300 outline-none focus:border-orange-400/50"><option value="All">All categories</option>{adminCategories.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>{filteredMenu.length ? <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">{filteredMenu.map((item) => <MenuItemCard key={item.id} item={item} onEdit={() => onEdit(item)} onDelete={() => onDelete(item.id)} onToggle={() => onToggle(item.id)} />)}</div> : <div className="p-4"><EmptyState title="No dishes found" detail="Try a different search or add a new food item." /></div>}</div></div>;
}

function MenuItemCard({ item, onEdit, onDelete, onToggle }: { item: AdminMenuItem; onEdit: () => void; onDelete: () => void; onToggle: () => void }) {
  return <div className={`group overflow-hidden rounded-2xl border bg-[#110a0c] transition hover:border-orange-400/25 ${item.active ? "border-white/[0.08]" : "border-white/[0.05] opacity-65"}`}><div className="relative h-36 overflow-hidden bg-[#1b0d0b]"><MenuPhoto src={item.image} alt={item.name} /><div className="absolute inset-0 bg-gradient-to-t from-[#110a0c] via-transparent to-transparent" />{item.special && <span className="absolute left-3 top-3 rounded-full bg-orange-400/90 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[#2d0b03]">Special</span>}<span className={`absolute right-3 top-3 rounded-full border px-2 py-1 text-[9px] font-semibold ${item.active ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-300" : "border-white/10 bg-black/30 text-zinc-500"}`}>{item.active ? "Live" : "Hidden"}</span></div><div className="p-4"><p className="text-[10px] uppercase tracking-[0.15em] text-orange-300/55">{item.category}</p><div className="mt-1 flex items-start justify-between gap-3"><h3 className="line-clamp-2 min-h-[2.5em] text-sm font-semibold leading-tight text-white">{item.name}</h3><span className="shrink-0 text-sm font-bold text-orange-300">{formatRupees(item.price)}</span></div><p className="mt-2 line-clamp-2 min-h-[2.5em] text-[11px] leading-relaxed text-zinc-600">{item.description}</p><div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3"><button type="button" onClick={onToggle} className="text-[11px] font-medium text-zinc-500 hover:text-white">{item.active ? "Hide item" : "Show item"}</button><div className="flex items-center gap-1"><button type="button" onClick={onEdit} className="admin-small-icon" aria-label={`Edit ${item.name}`}><Icon name="edit" size={14} /></button><button type="button" onClick={onDelete} className="admin-small-icon hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-300" aria-label={`Remove ${item.name}`}><Icon name="trash" size={14} /></button></div></div></div></div>;
}

function MenuPhoto({ src, alt }: { src: string | null; alt: string }) {
  if (!src) return <div className="flex h-full items-center justify-center text-4xl opacity-50">🍽️</div>;
  return <img src={src} alt={alt} className="h-full w-full object-cover" />;
}

function OrdersView({ orders, allOrders, search, filter, onSearch, onFilter, onStatus, onSelect, onAdd }: { orders: CafeOrder[]; allOrders: CafeOrder[]; search: string; filter: "All" | OrderStatus; onSearch: (value: string) => void; onFilter: (value: "All" | OrderStatus) => void; onStatus: (id: string, status: OrderStatus) => void; onSelect: (order: CafeOrder) => void; onAdd: () => void }) {
  return <div className="space-y-7"><PageHeading eyebrow="Order desk" title="Orders & customers" detail={`${allOrders.filter((order) => order.status === "Preparing").length} orders are being prepared · add a phone number or email to send an e-bill`} action={<button type="button" onClick={onAdd} className="admin-primary-btn"><Icon name="plus" size={16} /> Add customer order</button>} /><div className="admin-card overflow-hidden"><div className="flex flex-col gap-3 border-b border-white/[0.07] p-4 sm:flex-row sm:items-center sm:p-5"><div className="relative min-w-0 flex-1"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"><Icon name="search" size={16} /></span><input value={search} onChange={(event) => onSearch(event.target.value)} className="h-10 w-full rounded-xl border border-white/10 bg-[#0f090b] pl-9 pr-3 text-xs text-white outline-none placeholder:text-zinc-600 focus:border-orange-400/50" placeholder="Search order, customer or phone..." /></div><div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">{["All", ...orderStatuses].map((status) => <button type="button" key={status} onClick={() => onFilter(status as "All" | OrderStatus)} className={`whitespace-nowrap rounded-lg px-3 py-2 text-[11px] font-medium transition ${filter === status ? "bg-orange-400/15 text-orange-200" : "text-zinc-500 hover:bg-white/[0.04] hover:text-white"}`}>{status}</button>)}</div></div>{orders.length ? <div className="divide-y divide-white/[0.055]"><div className="hidden grid-cols-[1.05fr_1.5fr_1fr_0.9fr_1fr_24px] items-center gap-4 bg-white/[0.015] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-600 md:grid"><span>Order</span><span>Customer</span><span>Items</span><span>Status</span><span className="text-right">Total</span><span /></div>{orders.map((order) => <OrderTableRow key={order.id} order={order} onStatus={onStatus} onSelect={() => onSelect(order)} />)}</div> : <div className="p-4"><EmptyState title="No matching orders" detail="Try changing the search or status filter." /></div>}</div></div>;
}

function OrderTableRow({ order, onStatus, onSelect }: { order: CafeOrder; onStatus: (id: string, status: OrderStatus) => void; onSelect: () => void }) {
  return <div className="grid gap-3 px-5 py-4 transition hover:bg-white/[0.025] md:grid-cols-[1.05fr_1.5fr_1fr_0.9fr_1fr_24px] md:items-center md:gap-4"><button type="button" onClick={onSelect} className="flex items-center gap-3 text-left"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-400/10 text-[10px] font-bold text-orange-300">#{order.id.slice(-2)}</span><span><span className="block text-xs font-semibold text-white">#{order.id}</span><span className="mt-0.5 block text-[10px] text-zinc-600">{order.date === dateKey(new Date()) ? "Today" : orderDateLabel(order.date)} · {order.time}</span></span></button><button type="button" onClick={onSelect} className="flex min-w-0 items-center gap-2 text-left"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-zinc-400"><Icon name="user" size={14} /></span><span className="min-w-0"><span className="block truncate text-xs font-medium text-zinc-200">{order.customer}</span><span className="mt-0.5 block truncate text-[10px] text-zinc-600">{order.contact}{order.email ? ` · ${order.email}` : ""}</span></span></button><div className="flex items-center gap-2"><p className="truncate text-xs text-zinc-500">{order.items.reduce((sum, item) => sum + item.quantity, 0)} items <span className="text-zinc-700">·</span> {order.items[0]?.name}</p><OrderTypeBadge type={order.orderType} /></div><select value={order.status} onChange={(event) => onStatus(order.id, event.target.value as OrderStatus)} className={`h-8 w-fit min-w-[108px] rounded-full border bg-transparent px-2.5 text-[10px] font-medium outline-none ${statusStyles[order.status]}`}><option className="bg-[#140c0e]" value="Preparing">Preparing</option><option className="bg-[#140c0e]" value="Ready">Ready</option><option className="bg-[#140c0e]" value="Completed">Completed</option><option className="bg-[#140c0e]" value="Cancelled">Cancelled</option></select><p className="text-right text-sm font-semibold text-white">{formatRupees(order.total)}</p><button type="button" onClick={onSelect} className="hidden text-zinc-600 hover:text-white md:block"><Icon name="chevron" size={15} /></button><div className="flex items-center justify-between border-t border-white/[0.06] pt-2 md:hidden"><span className="flex items-center gap-2 text-[10px] text-zinc-600">{order.payment}{order.table ? ` · ${order.table}` : ""}<OrderTypeBadge type={order.orderType} /></span><button type="button" onClick={onSelect} className="text-[11px] font-medium text-orange-300">View order →</button></div></div>;
}

function SalesView({ orders, data, maxSales, onSelect }: { orders: CafeOrder[]; data: { key: string; total: number; label: string; day: number }[]; maxSales: number; onSelect: (order: CafeOrder) => void }) {
  const completed = orders.filter((order) => order.status === "Completed" && data.some((day) => day.key === order.date));
  const total = completed.reduce((sum, order) => sum + order.total, 0);
  const cash = completed.filter((order) => order.payment === "Cash").reduce((sum, order) => sum + order.total, 0);
  const digital = completed.filter((order) => order.payment !== "Cash").reduce((sum, order) => sum + order.total, 0);
  return <div className="space-y-7"><PageHeading eyebrow="Finance snapshot" title="Sales & e-bills" detail="A simple seven-day view of revenue, payment mix and every bill generated." action={<button type="button" onClick={() => window.print()} className="admin-secondary-btn"><Icon name="download" size={16} /> Export report</button>} /><div className="grid gap-3 sm:grid-cols-3"><StatCard label="7-day revenue" value={formatRupees(total)} change="Completed orders only" icon="chart" /><StatCard label="Cash payments" value={formatRupees(cash)} change={`${total ? Math.round((cash / total) * 100) : 0}% of revenue`} icon="receipt" accent="green" /><StatCard label="Card + online" value={formatRupees(digital)} change={`${total ? Math.round((digital / total) * 100) : 0}% of revenue`} icon="spark" accent="blue" /></div><section className="admin-card p-5 sm:p-6"><div className="flex items-start justify-between"><div><p className="text-sm font-semibold text-white">Seven-day sales summary</p><p className="mt-1 text-xs text-zinc-500">Tap a bar to read the daily total</p></div><span className="rounded-lg border border-orange-400/20 bg-orange-400/10 px-2.5 py-1.5 text-[11px] text-orange-200">Live summary</span></div><div className="mt-8 flex h-[240px] items-end gap-3 sm:gap-7">{data.map((day) => <div key={day.key} className="group flex h-full flex-1 flex-col items-center justify-end gap-2"><div className="relative flex h-full w-full max-w-14 items-end"><div className="admin-chart-tooltip">{formatRupees(day.total)}</div><div className="admin-bar is-sales w-full rounded-t-xl" style={{ height: `${Math.max(day.total ? (day.total / maxSales) * 100 : 3, 3)}%` }} /></div><p className="text-[10px] font-medium text-zinc-500">{day.label}</p><p className="-mt-1 text-[10px] text-zinc-700">{day.day}</p></div>)}</div></section><section className="admin-card overflow-hidden"><div className="border-b border-white/[0.07] px-5 py-5 sm:px-6"><p className="text-sm font-semibold text-white">Recent e-bills</p><p className="mt-1 text-xs text-zinc-500">Open an order to view or print a customer bill.</p></div>{completed.length ? <div className="divide-y divide-white/[0.055]">{completed.slice(0, 8).map((order) => <button type="button" key={order.id} onClick={() => onSelect(order)} className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-white/[0.025] sm:px-6"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300"><Icon name="receipt" size={15} /></span><div className="min-w-0 flex-1"><p className="text-xs font-semibold text-white">Bill #{order.id} <span className="ml-2 font-normal text-zinc-600">{orderDateLabel(order.date)}</span></p><p className="mt-1 truncate text-[11px] text-zinc-500">{order.customer} · {order.payment}</p></div><span className="text-sm font-semibold text-white">{formatRupees(order.total)}</span><Icon name="chevron" size={15} /></button>)}</div> : <div className="p-5"><EmptyState title="No completed bills yet" detail="Completed orders will appear here." /></div>}</section></div>;
}

function MenuEditor({ form, editing, onChange, onImage, onSubmit, onClose }: { form: MenuForm; editing: boolean; onChange: (value: MenuForm) => void; onImage: (file: File | undefined) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onClose: () => void }) {
  return <PanelModal title={editing ? "Edit food item" : "Add food item"} eyebrow="Menu management" onClose={onClose}><form onSubmit={onSubmit} className="space-y-5"><div className="grid gap-4 sm:grid-cols-2"><label className="block text-xs font-medium text-zinc-300 sm:col-span-2">Food name<input required value={form.name} onChange={(event) => onChange({ ...form, name: event.target.value })} className={inputClass} placeholder="e.g. Ella Valley Cheese Kottu" /></label><label className="block text-xs font-medium text-zinc-300">Category<select value={form.category} onChange={(event) => onChange({ ...form, category: event.target.value as Category })} className={inputClass}>{adminCategories.map((category) => <option key={category} value={category}>{category}</option>)}</select></label><label className="block text-xs font-medium text-zinc-300">Price <span className="text-zinc-600">(LKR)</span><input required min="0" type="number" value={form.price} onChange={(event) => onChange({ ...form, price: event.target.value })} className={inputClass} placeholder="1450" /></label></div><div className="grid gap-4 sm:grid-cols-2"><label className="block text-xs font-medium text-zinc-300">Prep time<input value={form.prepTime} onChange={(event) => onChange({ ...form, prepTime: event.target.value })} className={inputClass} placeholder="15 Mins" /></label><label className="block text-xs font-medium text-zinc-300">Ingredients <span className="text-zinc-600">(comma separated)</span><input value={form.ingredients} onChange={(event) => onChange({ ...form, ingredients: event.target.value })} className={inputClass} placeholder="Chicken, cheese, leeks" /></label></div><label className="block text-xs font-medium text-zinc-300">Details<textarea value={form.description} onChange={(event) => onChange({ ...form, description: event.target.value })} className={textareaClass} placeholder="Tell guests what makes this dish special..." /></label><div><p className="text-xs font-medium text-zinc-300">Dish image</p><div className="mt-2 flex flex-col gap-3 sm:flex-row"><div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#0d0809]">{form.image ? <img src={form.image} alt="Dish preview" className="h-full w-full object-cover" /> : <span className="flex h-full items-center justify-center text-2xl opacity-40">🍽️</span>}</div><div className="flex min-w-0 flex-1 flex-col justify-center gap-2"><input type="file" accept="image/*" onChange={(event) => onImage(event.target.files?.[0])} className="block w-full text-xs text-zinc-500 file:mr-3 file:rounded-lg file:border-0 file:bg-orange-400/10 file:px-3 file:py-2 file:text-[11px] file:font-medium file:text-orange-200 hover:file:bg-orange-400/20" /><input value={form.image.startsWith("data:") ? "" : form.image} onChange={(event) => onChange({ ...form, image: event.target.value })} className="h-9 w-full rounded-lg border border-white/10 bg-[#100b0d] px-3 text-[11px] text-white outline-none placeholder:text-zinc-600 focus:border-orange-400/50" placeholder="Or paste an image URL" /></div></div></div><label className="flex cursor-pointer items-center gap-3 rounded-xl border border-orange-400/15 bg-orange-400/[0.05] px-3.5 py-3"><input type="checkbox" checked={form.special} onChange={(event) => onChange({ ...form, special: event.target.checked })} className="h-4 w-4 accent-orange-500" /><span><span className="block text-xs font-medium text-white">Mark as a special</span><span className="mt-0.5 block text-[11px] text-zinc-500">Show a special badge on the customer menu.</span></span></label><div className="flex justify-end gap-2.5 border-t border-white/[0.07] pt-5"><button type="button" onClick={onClose} className="admin-secondary-btn">Cancel</button><button type="submit" className="admin-primary-btn">{editing ? "Save changes" : "Add to menu"} <Icon name="arrow" size={15} /></button></div></form></PanelModal>;
}

function NewOrderModal({ menu, values, lines, onValues, onLines, onSubmit, onClose }: { menu: AdminMenuItem[]; values: NewOrderForm; lines: Record<string, number>; onValues: (value: NewOrderForm) => void; onLines: (value: Record<string, number>) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onClose: () => void }) {
  const total = menu.reduce((sum, item) => sum + item.price * (lines[item.id] ?? 0), 0);
  return <PanelModal title="Add customer order" eyebrow="New order" onClose={onClose} wide><form onSubmit={onSubmit} className="space-y-5"><div className="grid gap-4 sm:grid-cols-2"><label className="block text-xs font-medium text-zinc-300">Customer name<input required value={values.customer} onChange={(event) => onValues({ ...values, customer: event.target.value })} className={inputClass} placeholder="e.g. Nimesha Perera" /></label><label className="block text-xs font-medium text-zinc-300">Phone number<input required value={values.contact} onChange={(event) => onValues({ ...values, contact: event.target.value })} className={inputClass} placeholder="+94 77 123 4567" /></label><label className="block text-xs font-medium text-zinc-300">Email <span className="text-zinc-600">(optional)</span><input type="email" value={values.email} onChange={(event) => onValues({ ...values, email: event.target.value })} className={inputClass} placeholder="customer@email.com" /></label><label className="block text-xs font-medium text-zinc-300">Table / reference <span className="text-zinc-600">(optional)</span><input value={values.table} onChange={(event) => onValues({ ...values, table: event.target.value })} className={inputClass} placeholder="T-04" /></label><label className="block text-xs font-medium text-zinc-300">Order type<select value={values.orderType} onChange={(event) => onValues({ ...values, orderType: event.target.value as OrderType })} className={inputClass}>{orderTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select></label></div><div><div className="mb-2 flex items-center justify-between"><p className="text-xs font-medium text-zinc-300">Select dishes</p><p className="text-xs font-semibold text-orange-300">{formatRupees(total)}</p></div><div className="max-h-56 divide-y divide-white/[0.06] overflow-y-auto rounded-xl border border-white/10 bg-[#10090b]">{menu.map((item) => <div key={item.id} className="flex items-center gap-3 px-3.5 py-3"><div className="min-w-0 flex-1"><p className="truncate text-xs font-medium text-zinc-200">{item.name}</p><p className="mt-0.5 text-[10px] text-zinc-600">{formatRupees(item.price)}</p></div><div className="flex items-center gap-2"><button type="button" onClick={() => onLines({ ...lines, [item.id]: Math.max(0, (lines[item.id] ?? 0) - 1) })} className="admin-qty-btn">−</button><span className="w-5 text-center text-xs text-white">{lines[item.id] ?? 0}</span><button type="button" onClick={() => onLines({ ...lines, [item.id]: (lines[item.id] ?? 0) + 1 })} className="admin-qty-btn">+</button></div></div>)}</div></div><div className="grid gap-4 sm:grid-cols-2"><label className="block text-xs font-medium text-zinc-300">Payment method<select value={values.payment} onChange={(event) => onValues({ ...values, payment: event.target.value as NewOrderForm["payment"] })} className={inputClass}><option>Cash</option><option>Card</option><option>Online</option></select></label><div className="flex items-end"><p className="rounded-xl border border-orange-400/15 bg-orange-400/[0.05] px-3.5 py-3 text-[11px] leading-relaxed text-orange-200/70">An e-bill will be ready as soon as this order is saved.</p></div></div><div className="flex justify-end gap-2.5 border-t border-white/[0.07] pt-5"><button type="button" onClick={onClose} className="admin-secondary-btn">Cancel</button><button type="submit" className="admin-primary-btn">Save order <Icon name="arrow" size={15} /></button></div></form></PanelModal>;
}

function escapeBillText(value: string): string {
  const entities: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
  return value.replace(/[&<>\"']/g, (character) => entities[character] ?? character);
}

function OrderDetail({ order, onClose, onStatus, onType }: { order: CafeOrder; onClose: () => void; onStatus: (id: string, status: OrderStatus) => void; onType: (id: string, orderType: OrderType) => void }) {
  function printBill() {
    const billWindow = window.open("", "_blank", "width=720,height=820");
    if (!billWindow) {
      window.print();
      return;
    }
    const lineMarkup = order.items.map((item) => `<tr><td>${item.quantity} × ${escapeBillText(item.name)}</td><td>${formatRupees(item.price * item.quantity)}</td></tr>`).join("");
    billWindow.document.write(`<!doctype html><html><head><title>Cafe Umbrella · E-bill #${escapeBillText(order.id)}</title><style>body{margin:0;padding:42px;font-family:Arial,sans-serif;color:#28120e;background:#fff}main{max-width:590px;margin:auto;border:1px solid #ecd8ca;padding:34px}header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #f18a45;padding-bottom:22px}h1{font-size:24px;margin:0;color:#9f291d}h2{font-size:16px;margin:0 0 5px}p{font-size:12px;color:#806d66;margin:6px 0}table{width:100%;border-collapse:collapse;margin-top:30px;font-size:13px}td{padding:12px 0;border-bottom:1px solid #f1e5df}td:last-child{text-align:right;font-weight:bold}.total{display:flex;justify-content:space-between;margin-top:22px;font-size:18px;font-weight:bold;color:#9f291d}.customer{margin-top:25px;padding:14px;background:#fff8f3}.footer{text-align:center;margin-top:30px;font-size:11px;color:#a18c84}@media print{body{padding:0}main{border:0}}</style></head><body><main><header><div><h1>Cafe Umbrella</h1><p>Ella · Roti &amp; Kottu Hub</p></div><div style="text-align:right"><h2>E-BILL #${escapeBillText(order.id)}</h2><p>${escapeBillText(orderDateLabel(order.date))} · ${escapeBillText(order.time)}</p></div></header><div class="customer"><strong>${escapeBillText(order.customer)}</strong><p>${escapeBillText(order.contact)}${order.email ? ` · ${escapeBillText(order.email)}` : ""}${order.table ? ` · ${escapeBillText(order.table)}` : ""}</p></div><table>${lineMarkup}</table><div class="total"><span>Total</span><span>${formatRupees(order.total)}</span></div><p style="margin-top:14px">Payment: ${escapeBillText(order.payment)} · Status: ${escapeBillText(order.status)}</p><div class="footer">Thank you for dining with us · Passara Road, Ella<br/>Made with fire in the hills</div></main></body></html>`);
    billWindow.document.close();
    billWindow.focus();
    billWindow.print();
    billWindow.close();
  }

  return <PanelModal title={`Order #${order.id}`} eyebrow={`${orderDateLabel(order.date)} · ${order.time}`} onClose={onClose} wide><div className="space-y-5"><div className="flex flex-col justify-between gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 sm:flex-row sm:items-center"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-400/10 text-orange-300"><Icon name="user" /></span><div><p className="text-sm font-semibold text-white">{order.customer}</p><p className="mt-1 text-xs text-zinc-500">{order.table ? `${order.table} · ` : ""}{order.payment} payment</p></div></div><div className="flex flex-wrap items-center justify-end gap-2"><select value={order.orderType} onChange={(event) => onType(order.id, event.target.value as OrderType)} className="h-9 rounded-full border border-white/10 bg-[#130b0d] px-3 text-[11px] font-medium text-zinc-300 outline-none"><option value="Dine-in">Dine-in</option><option value="Takeaway">Takeaway</option><option value="Delivery">Delivery</option></select><select value={order.status} onChange={(event) => onStatus(order.id, event.target.value as OrderStatus)} className={`h-9 rounded-full border bg-[#130b0d] px-3 text-[11px] font-medium outline-none ${statusStyles[order.status]}`}><option value="Preparing">Preparing</option><option value="Ready">Ready</option><option value="Completed">Completed</option><option value="Cancelled">Cancelled</option></select></div></div><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-3"><div className="flex items-center gap-2 text-zinc-500"><Icon name="phone" size={14} /><span className="text-[10px] uppercase tracking-wider">Phone</span></div><p className="mt-2 text-xs text-white">{order.contact}</p></div><div className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-3"><div className="flex items-center gap-2 text-zinc-500"><Icon name="mail" size={14} /><span className="text-[10px] uppercase tracking-wider">Email</span></div><p className="mt-2 truncate text-xs text-white">{order.email || "Not provided"}</p></div></div><div><p className="mb-2 text-xs font-medium text-zinc-300">Order items</p><div className="divide-y divide-white/[0.06] rounded-xl border border-white/[0.07] bg-[#10090b] px-3.5">{order.items.map((item) => <div key={item.name} className="flex items-center justify-between py-3"><div><p className="text-xs text-zinc-200">{item.name}</p><p className="mt-1 text-[10px] text-zinc-600">{item.quantity} × {formatRupees(item.price)}</p></div><p className="text-xs font-semibold text-white">{formatRupees(item.price * item.quantity)}</p></div>)}<div className="flex items-center justify-between py-4"><span className="text-xs font-medium text-zinc-500">Total</span><span className="font-display text-lg font-semibold text-orange-300">{formatRupees(order.total)}</span></div></div></div><div className="flex flex-col gap-2.5 sm:flex-row"><button type="button" onClick={printBill} className="admin-secondary-btn flex-1 justify-center"><Icon name="print" size={15} /> Print / save e-bill</button><button type="button" onClick={printBill} className="admin-primary-btn flex-1 justify-center"><Icon name="download" size={15} /> Generate e-bill</button></div><p className="text-center text-[10px] text-zinc-600">A clean invoice opens in a new window. Choose “Save as PDF” in the print dialog.</p></div></PanelModal>;
}
