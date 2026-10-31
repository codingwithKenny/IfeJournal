"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Plus, Pencil, X, Save } from "lucide-react";

export default function IssueModal({
  mode,
  issue,
  volumeId,
  volumeLabel,
  action,
}) {
  const [open, setOpen] = useState(false);
  const isEdit = mode === "edit";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          isEdit
            ? "inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-[#0B1F3A] transition hover:border-[#D5B36A] hover:bg-[#FAF5E9]"
            : "inline-flex items-center justify-center gap-2 rounded-lg bg-[#0B1F3A] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#15345B]"
        }
      >
        {isEdit ? <Pencil size={15} /> : <Plus size={16} />}
        {isEdit ? "Edit" : "Add Issue"}
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
            aria-labelledby="issue-modal-title"
            className="my-auto w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#8B6B2E]">
                  {volumeLabel}
                </p>

                <h2
                  id="issue-modal-title"
                  className="mt-2 font-serif text-2xl font-bold text-[#0B1F3A]"
                >
                  {isEdit ? "Edit Issue" : "Add New Issue"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage the issue details and publication settings.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close modal"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <form action={action}>
              <input type="hidden" name="volumeId" value={volumeId} />

              {isEdit && (
                <input type="hidden" name="id" value={issue.id} />
              )}

              <div className="space-y-5 px-6 py-6">
                <div>
                  <label className={labelClass} htmlFor={`issue-number-${issue?.id || volumeId}`}>
                    Issue Number *
                  </label>

                  <input
                    id={`issue-number-${issue?.id || volumeId}`}
                    name="number"
                    type="number"
                    min="1"
                    step="1"
                    required
                    defaultValue={issue?.number ?? ""}
                    placeholder="e.g. 1"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor={`issue-title-${issue?.id || volumeId}`}>
                    Issue Title
                  </label>

                  <input
                    id={`issue-title-${issue?.id || volumeId}`}
                    name="title"
                    maxLength={200}
                    defaultValue={issue?.title || ""}
                    placeholder="Optional issue title"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor={`issue-date-${issue?.id || volumeId}`}>
                    Publication Date
                  </label>

                  <input
                    id={`issue-date-${issue?.id || volumeId}`}
                    type="date"
                    name="publicationDate"
                    defaultValue={issue?.publicationDate || ""}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor={`issue-description-${issue?.id || volumeId}`}>
                    Description
                  </label>

                  <textarea
                    id={`issue-description-${issue?.id || volumeId}`}
                    name="description"
                    rows={3}
                    maxLength={3000}
                    defaultValue={issue?.description || ""}
                    placeholder="Optional description of this issue..."
                    className={`${inputClass} resize-y`}
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4">
                    <input
                      type="checkbox"
                      name="isPublished"
                      defaultChecked={issue?.isPublished ?? false}
                      className="mt-1 h-4 w-4 accent-[#0B1F3A]"
                    />

                    <span>
                      <span className="block text-sm font-semibold text-[#0B1F3A]">
                        Publish this issue
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-slate-500">
                        Mark the issue as published and eligible to appear in
                        the public archive.
                      </span>
                    </span>
                  </label>

                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4">
                    <input
                      type="checkbox"
                      name="isCurrent"
                      defaultChecked={issue?.isCurrent ?? false}
                      className="mt-1 h-4 w-4 accent-[#0B1F3A]"
                    />

                    <span>
                      <span className="block text-sm font-semibold text-[#0B1F3A]">
                        Set as current issue
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-slate-500">
                        Setting this issue as current will remove the current
                        flag from any other issue.
                      </span>
                    </span>
                  </label>
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
      {pending ? "Saving..." : isEdit ? "Save Changes" : "Create Issue"}
    </button>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#C2A15C] focus:ring-2 focus:ring-[#D5B36A]/20";

const labelClass = "mb-2 block text-sm font-semibold text-[#0B1F3A]";