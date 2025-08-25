// components/dashboard/Sidebar.tsx
"use client";

import NavLink from "@/components/dashboard/NavLink";

type Props = {
  onNavigate?: () => void;
};

export default function Sidebar({ onNavigate }: Props) {
  const items = [
    { href: "/dashboard", label: "Dashboard", icon: "🏠" },
    { href: "/dashboard/profile", label: "Profil", icon: "👤" },
    { href: "/dashboard/settings", label: "Paramètres", icon: "⚙️" },
  ];

  return (
    <nav className="space-y-1">
      <div className="p-3">
        <div className="text-xl font-bold">Calorice</div>
        <div className="text-xs text-gray-500">Suivi nutrition & muscu</div>
      </div>
      <ul className="px-2">
        {items.map((it) => (
          <li key={it.href}>
            <NavLink href={it.href} onNavigate={onNavigate}>
              <span className="mr-2">{it.icon}</span>
              {it.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
