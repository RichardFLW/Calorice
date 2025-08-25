// components/dashboard/NavLink.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  onNavigate?: () => void;
};

export default function NavLink({ href, children, onNavigate }: Props) {
  const pathname = usePathname();
  const isRoot = href === "/dashboard";
  const active = isRoot ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={[
        "flex items-center rounded-md px-3 py-2 text-sm",
        active ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100",
      ].join(" ")}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </Link>
  );
}
