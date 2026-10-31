
"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Plus, Pencil, X } from "lucide-react";

export default function SubfieldModal({
  mode,
  subfield,
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
            ? "text-sm font-medium text-[#8B6B2E] transition hover:text-[#0B1F3A]"
            : "inline-flex items-center gap-2 rounded-lg bg-[#0B1F3A] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#17375f]"
        }
      >
        {isEdit ? (
          <>
            <Pencil size={14} />
            Edit
          </>
        ) : (
          <>
            <Plus size={16} />
            Add Subfield
          </>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#0B1F3A]">
                  {isEdit ? "Edit Subfield" : "Add New Subfield"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {isEdit
                    ? "Update this research subfield."
                    : "Create a research subfield for journal articles."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form
              action={action}
              onSubmit={() => setOpen(false)}
              className="space-y-6 px-6 py-6"
            >
              {isEdit && (
                <input
                  type="hidden"
                  name="id"
                  value={subfield.id}
                />
              )}

              <div>
                <label
                  htmlFor={`subfield-name-${mode}`}
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Subfield Name
                </label>

                <input
                  id={`subfield-name-${mode}`}
                  type="text"
                  name="name"
                  required
                  maxLength={150}
                  defaultValue={subfield?.name || ""}
                  placeholder="e.g. International Relations"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#8B6B2E] focus:ring-2 focus:ring-[#8B6B2E]/10"
                />
              </div>

              {isEdit && (
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-4">
                  <input
                    type="checkbox"
                    name="isActive"
                    defaultChecked={subfield.isActive}
                    className="h-4 w-4 accent-[#0B1F3A]"
                  />

                  <span>
                    <span className="block text-sm font-medium text-slate-700">
                      Active subfield
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                      Active subfields can be assigned to articles.
                    </span>
                  </span>
                </label>
              )}

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
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
      className="rounded-lg bg-[#0B1F3A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#17375f] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending
        ? "Saving..."
        : isEdit
          ? "Save Changes"
          : "Create Subfield"}
    </button>
  );
}
