"use client";

import Link from "next/link";

interface SettingsNavItemProps {
  icon: string;
  label: string;
  href: string;
  active?: boolean;
  badge?: string;
}

export default function SettingsNavItem({
  icon,
  label,
  href,
  active = false,
  badge,
}: SettingsNavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
        active
          ? "bg-primary/10 text-primary border-l-2 border-primary rounded-l-none"
          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="material-symbols-outlined text-[20px] shrink-0">
          {icon}
        </span>
        <span className="truncate">{label}</span>
      </div>
      {badge && (
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 border border-slate-700/50 uppercase font-bold tracking-wider shrink-0 ml-2">
          {badge}
        </span>
      )}
    </Link>
  );
}
