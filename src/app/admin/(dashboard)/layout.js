
"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Tags,
  Users,
  LogOut,
  PanelLeft,
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Articles", href: "/admin/articles", icon: FileText },
    { name: "Subfields", href: "/admin/subfields", icon: Tags },
    // { name: "Authors", href: "/admin/authors", icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-[#FAFAF8] text-slate-900">
      {/* Sidebar */}
      <aside className="flex w-64 shrink-0 flex-col justify-between bg-[#0B1F3A] text-white shadow-xl sm:w-72">
        <div>
          {/* Branding */}
          <div className="border-b border-white/10 px-6 py-8">
            <Link href="/admin" className="group block">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center border border-[#D5B36A] font-serif text-lg font-semibold text-[#D5B36A] transition group-hover:bg-[#D5B36A] group-hover:text-[#0B1F3A]">
                  IJP
                </span>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D5B36A]">
                    Academic Journal
                  </p>
                  <p className="mt-1 text-xs text-slate-300">
                    OAU · Ile-Ife
                  </p>
                </div>
              </div>

              <h1 className="font-serif text-xl font-semibold leading-snug">
                Ife Journal of Politics
              </h1>

              <p className="mt-2 text-sm text-slate-300">
                Editorial Administration
              </p>
            </Link>
          </div>

          {/* Navigation */}
          <div className="px-4 pt-7">
            <p className="mb-3 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Workspace
            </p>

            <nav aria-label="Admin navigation" className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;

                const active =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`group relative flex items-center gap-3 border px-4 py-3 text-sm font-medium transition ${
                      active
                        ? "border-[#D5B36A]/40 bg-white text-[#0B1F3A] shadow-sm"
                        : "border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {active && (
                      <span className="absolute bottom-2 left-0 top-2 w-1 bg-[#D5B36A]" />
                    )}

                    <Icon
                      size={19}
                      strokeWidth={1.8}
                      className={
                        active
                          ? "text-[#8B6B2E]"
                          : "text-slate-400 transition group-hover:text-[#D5B36A]"
                      }
                    />

                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-white/10 p-4">
          <Link
            href="/"
            className="mb-2 flex items-center gap-3 border border-transparent px-4 py-3 text-sm text-slate-300 transition hover:border-white/10 hover:bg-white/5 hover:text-white"
          >
            <PanelLeft size={18} />
            View Journal Website
          </Link>

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-3 border border-transparent px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-red-300/20 hover:bg-red-400/10 hover:text-red-200"
          >
            <LogOut size={18} />
            Logout
          </button>

          <div className="mt-4 border-t border-white/10 px-4 pt-4">
            <div className="h-px w-10 bg-[#D5B36A]" />
            <p className="mt-3 text-[10px] leading-5 text-slate-400">
              Ife Journal of Politics
              <br />
              Department of Political Science
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
