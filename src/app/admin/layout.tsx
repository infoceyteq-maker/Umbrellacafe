import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Admin Studio · Cafe Umbrella",
  manifest: "/admin.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Umbrella Admin",
    statusBarStyle: "black-translucent",
  },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}
