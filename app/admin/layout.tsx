import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: "GharChamak Admin",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className="admin-body">{children}</body></html>;
}
