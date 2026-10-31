import { Mail, MapPin } from "lucide-react";

export const metadata = {
  title: "Contact Us | Ife Journal of Politics",
  description:
    "Contact the editorial office of Ife Journal of Politics, Obafemi Awolowo University, Ile-Ife, Nigeria.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#9C762D]">
            Ife Journal of Politics
          </p>

          <h1 className="text-3xl font-bold text-[#0B1F3A] md:text-4xl">
            Contact Us
          </h1>

          <div className="mt-5 h-1 w-16 bg-[#C2A15C]" />

          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
            For enquiries concerning manuscript submissions, peer review,
            editorial decisions, publication and other journal matters,
            please contact the editorial office.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-[#0B1F3A] px-7 py-6 md:px-9">
              <div className="mb-3 h-1 w-10 bg-[#D5B36A]" />
              <h2 className="text-xl font-bold text-white">
                Editorial Office
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Ife Journal of Politics
              </p>
            </div>

            <div className="space-y-8 p-7 md:p-9">
              <div className="flex gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#FAFAF8] text-[#9C762D]">
                  <MapPin size={22} />
                </div>

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-[#0B1F3A]">
                    Postal Address
                  </h3>
                  <p className="mt-3 text-sm leading-8 text-slate-600">
                    Department of Political Science
                    <br />
                    Obafemi Awolowo University
                    <br />
                    Ile-Ife, Osun State
                    <br />
                    Nigeria
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-100" />

              <div className="flex gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#FAFAF8] text-[#9C762D]">
                  <Mail size={22} />
                </div>

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-[#0B1F3A]">
                    Email Address
                  </h3>

                  <a
                    href="mailto:journalofpolitics@oauife.edu.ng"
                    className="mt-3 inline-block break-all text-sm font-medium text-[#9C762D] transition hover:text-[#0B1F3A] hover:underline"
                  >
                    journalofpolitics@oauife.edu.ng
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-l-4 border-[#C2A15C] bg-white px-6 py-5">
            <h3 className="text-sm font-bold text-[#0B1F3A]">
              Correspondence
            </h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Authors, reviewers, researchers and readers are welcome to
              contact the journal regarding scholarly submissions,
              editorial matters and general enquiries.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}