
"use client";

import { useState } from "react";

const email = "journalofpolitics@oauife.edu.ng";

const subject = "Manuscript Submission – Ife Journal of Politics";

const body = `Dear Editorial Team,

I would like to submit my manuscript for consideration for publication in the Ife Journal of Politics.

Please find my manuscript attached for your review.

Thank you for your consideration.

Kind regards,`;

const mailto = `mailto:${email}?subject=${encodeURIComponent(
  subject
)}&body=${encodeURIComponent(body)}`;

export default function SubmitManuscriptModal() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex min-h-12 items-center justify-center gap-3 border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-[#D5B36A] hover:bg-white/5"
      >
        Submit a Manuscript
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#071629]/70 px-4 py-6 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="submission-modal-title"
            className="relative w-full max-w-md overflow-hidden bg-white shadow-2xl"
          >
            <div className="h-1 bg-[#D5B36A]" />

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close dialog"
              className="absolute right-5 top-5 text-2xl leading-none text-white/70 transition hover:text-white"
            >
              &times;
            </button>

            <div className="bg-[#0B1F3A] px-7 py-8 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D5B36A]">
                Ife Journal of Politics
              </p>

              <h2
                id="submission-modal-title"
                className="mt-4 font-serif text-3xl leading-tight"
              >
                Submit a Manuscript
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Share your research and contribute to scholarly discussions
                in political science and related fields.
              </p>
            </div>

            <div className="p-7">
              <p className="text-xs font-bold uppercase tracking-wider text-[#8B6B2E]">
                Submission Email
              </p>

              <p className="mt-2 break-all text-sm font-semibold text-[#0B1F3A]">
                {email}
              </p>

              <a
                href={mailto}
                className="mt-7 flex min-h-12 w-full items-center justify-center gap-3 bg-[#D5B36A] px-5 py-3.5 text-sm font-bold text-[#0B1F3A] transition hover:bg-[#E7CC91] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B1F3A] focus-visible:ring-offset-2"
              >
                Submit Your Manuscript
                <span aria-hidden="true">→</span>
              </a>

              <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                Your email application will open with a prefilled message.
                Remember to attach your manuscript.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
