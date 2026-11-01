
"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Plus, Pencil, X, Save } from "lucide-react";

export default function VolumeModal({ mode, volume, action }) {
  const [open, setOpen] = useState(false);
  const isEdit = mode === "edit";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          isEdit
            ? "inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-[#0B1F3A] transition hover:border-[#D5B36A] hover:bg-[#FAF5E9]"
            : "inline-flex items-center justify-center gap-2 rounded-lg bg-[#0B1F3A] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#15345B]"
        }
      >
        {isEdit ? <Pencil size={15} /> : <Plus size={17} />}
        {isEdit ? "Edit Volume" : "Add Volume"}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#0B1F3A]/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="volume-modal-title"
            className="my-auto w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#8B6B2E]">
                  Ife Journal of Politics
                </p>

                <h2
                  id="volume-modal-title"
                  className="mt-2 font-serif text-2xl font-bold text-[#0B1F3A]"
                >
                  {isEdit ? "Edit Volume" : "Create Volume"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Set the volume number and its publication year.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close modal"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <form action={action}>
              {isEdit && (
                <input type="hidden" name="id" value={volume.id} />
              )}

              <div className="space-y-5 px-6 py-6">
                <div>
                  <label className={labelClass} htmlFor="volume-number">
                    Volume Number *
                  </label>

                  <input
                    id="volume-number"
                    name="number"
                    type="number"
                    min="1"
                    step="1"
                    required
                    defaultValue={volume?.number ?? ""}
                    placeholder="e.g. 3"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="volume-year">
                    Publication Year *
                  </label>

                  <input
                    id="volume-year"
                    name="year"
                    type="number"
                    min="1900"
                    max="2200"
                    step="1"
                    required
                    defaultValue={
                      volume?.year ?? new Date().getFullYear()
                    }
                    className={inputClass}
                  />
                </div>

                <div className="rounded-xl border border-[#D5B36A]/40 bg-[#FAF5E9] p-4">
                  <p className="text-sm font-semibold text-[#0B1F3A]">
                    How volumes work
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    Each publication year has one volume. Published articles
                    receive sequential issue numbers within that volume,
                    starting from 1 each year.
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-[#FAFAF8] px-6 py-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <SubmitButton isEdit={isEdit} />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function SubmitButton({ isEdit }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0B1F3A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#15345B] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isEdit ? <Save size={16} /> : <Plus size={16} />}
      {pending ? "Saving..." : isEdit ? "Save Changes" : "Create Volume"}
    </button>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#C2A15C] focus:ring-2 focus:ring-[#D5B36A]/20";

const labelClass =
  "mb-2 block text-sm font-semibold text-[#0B1F3A]";
