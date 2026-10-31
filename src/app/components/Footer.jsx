import Link from "next/link";
import Image from "next/image";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Latest Articles", href: "/articles" },
  // { label: "Journal Archives", href: "/" },
  // { label: "About the Journal", href: "/" },
];

const journalLinks = [
  { label: "Editorial Board", href: "/editorial-board" },
  { label: "Author Guidelines", href: "/author-guidelines" },
  { label: "Contact Us", href: "/contact" },
];

const policyLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
];

const linkClass =
  "inline-flex text-sm leading-6 text-slate-300 transition-colors duration-200 hover:text-[#D5B36A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5B36A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1F3A]";

function FooterLinkGroup({ title, links }) {
  return (
    <nav aria-label={title}>
      <h2 className="mb-5 text-xs font-bold uppercase tracking-[0.16em] text-white sm:text-sm">
        {title}
      </h2>

      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={linkClass}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#0B1F3A] text-slate-300">
      {/* Gold accent */}
      <div
        aria-hidden="true"
        className="h-1 w-full bg-gradient-to-r from-[#0B1F3A] via-[#D5B36A] to-[#0B1F3A]"
      />

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-12 sm:px-6 sm:pb-8 sm:pt-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_1fr_0.85fr] lg:gap-10">
          {/* Journal identity */}
          <div>
            <Link
              href="/"
              aria-label="Ife Journal of Politics homepage"
              className="group inline-flex items-center gap-3 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5B36A]"
            >
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white p-1.5">
                <Image
                  src="/ijp.jpg"
                  alt="Ife Journal of Politics logo"
                  width={48}
                  height={48}
                  className="h-full w-full object-contain"
                />
              </div>

              <span>
                <span className="block font-serif text-lg font-bold leading-tight text-white transition-colors group-hover:text-[#D5B36A] sm:text-xl">
                  Ife Journal
                </span>
                <span className="mt-0.5 block font-serif text-base leading-tight text-[#D5B36A]">
                  of Politics
                </span>
              </span>
            </Link>

            <div className="mt-5 h-px w-14 bg-[#D5B36A]" />

            <p className="mt-5 text-sm font-semibold leading-6 text-white">
              Department of Political Science
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-400">
              Obafemi Awolowo University,
              <br />
              Ile-Ife, Osun State, Nigeria.
            </p>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              A scholarly platform for research, critical inquiry, and
              academic discourse in politics and related fields.
            </p>
          </div>

          {/* Explore */}
          <FooterLinkGroup title="Explore" links={quickLinks} />

          {/* Authors and readers */}
          <FooterLinkGroup
            title="For Authors & Readers"
            links={journalLinks}
          />

          {/* Policies */}
          <div>
            <FooterLinkGroup
              title="Policies & Ethics"
              links={policyLinks}
            />

            <p className="mt-5 max-w-xs text-xs leading-6 text-slate-400">
              Authors should consult the journal&apos;s guidelines and
              applicable publication policies before submitting a manuscript.
            </p>
          </div>
        </div>

        {/* Copyright and affiliation */}
        <div className="mt-12 border-t border-white/15 pt-6 sm:mt-14 sm:pt-7">
          <div className="flex flex-col gap-4 text-center md:flex-row md:items-center md:justify-between md:text-left">
            <p className="text-xs leading-6 text-slate-400">
              © {new Date().getFullYear()} Ife Journal of Politics.
              All rights reserved.
            </p>

            <p className="text-xs leading-6 text-slate-400">
              Department of Political Science
              <span className="mx-2 text-[#D5B36A]">·</span>
              Obafemi Awolowo University
            </p>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 md:justify-start">
            <span className="h-px w-6 bg-[#D5B36A]" />
            <span className="text-[11px] font-medium tracking-wide text-slate-500">
              ifejournalofpolitics.com
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}