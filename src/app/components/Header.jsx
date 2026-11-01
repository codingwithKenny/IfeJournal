"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRef } from "react";

const navigation = [
  { label: "Home", href: "/" },
  // { label: "Journal", href: "/journal" },
  { label: "Articles", href: "/articles" },
  { label: "Editorial Board", href: "/editorial-board" },
  { label: "For Authors", href: "/author-guidelines" },
  { label: "Contact", href: "/contact" },
];

function ArrowIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function isActiveRoute(pathname, href) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const pathname = usePathname() || "/";
  const mobileMenuRef = useRef(null);

  function closeMobileMenu() {
    if (mobileMenuRef.current) {
      mobileMenuRef.current.open = false;
    }
  }

  return (
    <>
      {/* Compact university identity bar */}
      <div className="bg-[#0B1F3A] text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-5 py-2 sm:px-6">
          <a
            href="https://oauife.edu.ng/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Obafemi Awolowo University official website"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D5B36A] bg-white p-1 sm:h-9 sm:w-9"
          >
            <Image
              src="/oauLogo.png"
              alt="Obafemi Awolowo University logo"
              width={36}
              height={36}
              priority
              className="h-full w-full object-contain"
            />
          </a>

          <div className="min-w-0">
            <p className="text-xs font-semibold leading-4 sm:text-sm">
              Obafemi Awolowo University
            </p>
            <p className="text-[10px] leading-4 text-slate-300 sm:text-xs">
              Department of Political Science · Ile-Ife, Nigeria
            </p>
          </div>

          <a
            href="https://oauife.edu.ng/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto hidden shrink-0 text-[11px] text-slate-300 transition-colors hover:text-[#D5B36A] sm:block"
          >
            University Website ↗
          </a>
        </div>
      </div>

      {/* Main journal header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-[0_2px_12px_rgba(11,31,58,0.04)] backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-4 sm:gap-6 sm:px-6 lg:py-5">
          {/* Journal identity */}
          <Link
            href="/"
            onClick={closeMobileMenu}
            aria-label="Ife Journal of Politics homepage"
            className="group flex min-w-0 shrink items-center gap-2 sm:gap-3"
          >
            <div className="relative h-10 w-10 shrink-0 sm:h-12 sm:w-12">
              <Image
                src="/ijp.jpg"
                alt="Ife Journal of Politics logo"
                fill
                sizes="48px"
                priority
                className="object-contain"
              />
            </div>

            <span className="min-w-0">
              <span className="block whitespace-nowrap font-serif text-[14px] font-bold leading-tight tracking-tight text-[#0B1F3A] transition-colors group-hover:text-[#8B6B2E] sm:text-xl lg:text-[21px]">
                Ife Journal <span className="font-normal">of Politics</span>
              </span>

              <span className="mt-1 hidden text-[10px] font-medium uppercase tracking-[0.13em] text-slate-500 sm:block">
                Department of Political Science · OAU
              </span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-3 lg:flex xl:gap-5"
          >
            {navigation.map((item) => {
              const active = isActiveRoute(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`whitespace-nowrap border-b-2 py-2 text-[12px] transition-colors xl:text-sm ${
                    active
                      ? "border-[#D5B36A] font-semibold text-[#0B1F3A]"
                      : "border-transparent font-medium text-slate-600 hover:border-[#D5B36A]/60 hover:text-[#0B1F3A]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Articles button and mobile menu */}
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/articles"
              onClick={closeMobileMenu}
              className="group inline-flex h-10 items-center justify-center gap-2 bg-[#0B1F3A] px-3 text-xs font-semibold text-white transition-colors hover:bg-[#16375D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5B36A] focus-visible:ring-offset-2 sm:h-11 sm:px-4 sm:text-sm"
            >
              <span className="sm:hidden">Articles</span>
              <span className="hidden sm:inline">Explore Articles</span>

              <ArrowIcon className="hidden h-4 w-4 text-[#D5B36A] transition-transform group-hover:translate-x-0.5 sm:block" />
            </Link>

            {/* Mobile hamburger menu */}
            <details
              ref={mobileMenuRef}
              className="group relative shrink-0 lg:hidden"
            >
              <summary
                aria-label="Open navigation menu"
                className="flex h-10 w-10 cursor-pointer list-none items-center justify-center border border-slate-200 bg-white text-[#0B1F3A] transition-colors hover:border-[#D5B36A] hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5B36A] [&::-webkit-details-marker]:hidden"
              >
                <svg
                  className="h-5 w-5 transition-transform duration-200 group-open:rotate-90"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M4 6h16" />
                  <path d="M4 12h16" />
                  <path d="M4 18h16" />
                </svg>
              </summary>

              {/* Mobile dropdown */}
              <nav
                aria-label="Mobile navigation"
                className="absolute right-0 top-full z-50 mt-3 w-64 max-w-[calc(100vw-2rem)] overflow-hidden border border-slate-200 bg-white shadow-xl shadow-[#0B1F3A]/10"
              >
                <div className="border-b border-slate-100 px-5 py-4">
                  <p className="font-serif text-base font-bold text-[#0B1F3A]">
                    Ife Journal of Politics
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Navigate the journal
                  </p>
                </div>

                <div className="p-2">
                  {navigation.map((item) => {
                    const active = isActiveRoute(pathname, item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMobileMenu}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                          active
                            ? "bg-[#F7F5F0] font-semibold text-[#0B1F3A]"
                            : "text-slate-600 hover:bg-slate-50 hover:text-[#0B1F3A]"
                        }`}
                      >
                        <span>{item.label}</span>

                        {active && (
                          <span className="h-5 w-1 bg-[#D5B36A]" />
                        )}
                      </Link>
                    );
                  })}
                </div>

                <div className="border-t border-slate-100 px-5 py-3">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                    Department of Political Science · OAU
                  </p>
                </div>
              </nav>
            </details>
          </div>
        </div>
      </header>
    </>
  );
}