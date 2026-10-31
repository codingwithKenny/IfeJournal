
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  Save,
  Send,
  ArrowLeft,
  Upload,
  FileText,
  X,
} from "lucide-react";
import {
  createArticle,
  updateArticle,
  uploadArticlePdf,
} from "../action";

const emptyAuthor = () => ({
  fullName: "",
  email: "",
  affiliation: "",
  orcid: "",
});

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#C2A15C] focus:ring-2 focus:ring-[#D5B36A]/20";

const labelClass = "mb-2 block text-sm font-semibold text-[#0B1F3A]";

const MAX_PDF_SIZE = 15 * 1024 * 1024;

function formatDateForInput(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().slice(0, 10);
}

export default function ArticleForm({
  subfields = [],
  initialData = null,
  articleId = null,
}) {
  const router = useRouter();

  const [form, setForm] = useState(() => ({
    title: initialData?.title || "",
    abstract: initialData?.abstract || "",
    keywords: initialData?.keywords?.join(", ") || "",
    doi: initialData?.doi || "",
    pdfUrl: initialData?.pdfUrl || "",
    pageStart: initialData?.pageStart ?? "",
    pageEnd: initialData?.pageEnd ?? "",
    submittedDate: formatDateForInput(initialData?.submittedDate),
    acceptedDate: formatDateForInput(initialData?.acceptedDate),
    publicationDate: formatDateForInput(initialData?.publicationDate),
    status: initialData?.status || "DRAFT",
    authors:
      initialData?.authors?.length > 0
        ? initialData.authors
        : [emptyAuthor()],
    subfieldIds: initialData?.subfieldIds || [],
  }));

  const [loading, setLoading] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [error, setError] = useState("");
  const [pdfError, setPdfError] = useState("");
  const [pdfSuccess, setPdfSuccess] = useState("");

  function updateField(name, value) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function toggleSubfield(subfieldId) {
    setForm((current) => ({
      ...current,
      subfieldIds: current.subfieldIds.includes(subfieldId)
        ? current.subfieldIds.filter((id) => id !== subfieldId)
        : [...current.subfieldIds, subfieldId],
    }));
  }

  function updateAuthor(index, name, value) {
    setForm((current) => ({
      ...current,
      authors: current.authors.map((author, i) =>
        i === index ? { ...author, [name]: value } : author
      ),
    }));
  }

  function addAuthor() {
    setForm((current) => ({
      ...current,
      authors: [...current.authors, emptyAuthor()],
    }));
  }

  function removeAuthor(index) {
    setForm((current) => ({
      ...current,
      authors: current.authors.filter((_, i) => i !== index),
    }));
  }

  async function handlePdfUpload(event) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    setPdfError("");
    setPdfSuccess("");

    if (
      file.type !== "application/pdf" ||
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setPdfError("Please select a valid PDF file.");
      return;
    }

    if (file.size === 0 || file.size > MAX_PDF_SIZE) {
      setPdfError("The PDF must be smaller than 15 MB.");
      return;
    }

    setUploadingPdf(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadArticlePdf(formData);

      if (!result?.success || !result.url) {
        setPdfError(result?.error || "Unable to upload the PDF.");
        return;
      }

      updateField("pdfUrl", result.url);
      setPdfSuccess("PDF uploaded successfully.");
    } catch (err) {
      console.error("PDF upload error:", err);
      setPdfError("PDF upload failed. Please try again.");
    } finally {
      setUploadingPdf(false);
    }
  }

  function removePdf() {
    updateField("pdfUrl", "");
    setPdfError("");
    setPdfSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setError("");

    if (uploadingPdf) {
      setError("Please wait for the PDF upload to finish.");
      return;
    }

    if (!form.title.trim()) {
      setError("Please enter the article title.");
      return;
    }

    if (!form.abstract.trim()) {
      setError("Please enter the article abstract.");
      return;
    }

    const validAuthors = form.authors
      .map((author) => ({
        fullName: author.fullName.trim(),
        email: author.email.trim(),
        affiliation: author.affiliation.trim(),
        orcid: author.orcid.trim(),
      }))
      .filter((author) => author.fullName);

    if (validAuthors.length === 0) {
      setError("Please enter at least one author's full name.");
      return;
    }

    if (
      form.pageStart &&
      (!Number.isInteger(Number(form.pageStart)) ||
        Number(form.pageStart) < 1)
    ) {
      setError("The first page must be a positive whole number.");
      return;
    }

    if (
      form.pageEnd &&
      (!Number.isInteger(Number(form.pageEnd)) ||
        Number(form.pageEnd) < 1)
    ) {
      setError("The last page must be a positive whole number.");
      return;
    }

    if (
      form.pageStart &&
      form.pageEnd &&
      Number(form.pageEnd) < Number(form.pageStart)
    ) {
      setError("The last page cannot be less than the first page.");
      return;
    }

    setLoading(true);

    try {
      const articleData = {
        title: form.title.trim(),
        abstract: form.abstract.trim(),
        keywords: form.keywords
          .split(",")
          .map((keyword) => keyword.trim())
          .filter(Boolean),
        doi: form.doi.trim(),
        pdfUrl: form.pdfUrl,
        pageStart: form.pageStart ? Number(form.pageStart) : null,
        pageEnd: form.pageEnd ? Number(form.pageEnd) : null,
        submittedDate: form.submittedDate,
        acceptedDate: form.acceptedDate,
        publicationDate: form.publicationDate,
        status: form.status,
        authors: validAuthors,
        subfieldIds: form.subfieldIds,
      };

      const result = articleId
        ? await updateArticle(articleId, articleData)
        : await createArticle(articleData);

      if (!result?.success) {
        setError(result?.error || "Unable to save the article.");
        return;
      }

      router.push("/admin/articles");
      router.refresh();
    } catch (err) {
      console.error("Save article error:", err);

      setError(
        err.message ||
          "Something went wrong while saving the article. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* 01 — Article information */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <SectionHeading number="01" title="Article Information" />

        <div className="mt-6 space-y-5">
          <div>
            <label htmlFor="article-title" className={labelClass}>
              Article Title *
            </label>
            <input
              id="article-title"
              required
              maxLength={500}
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Enter the full title of the article"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="article-abstract" className={labelClass}>
              Abstract *
            </label>
            <textarea
              id="article-abstract"
              required
              rows={7}
              value={form.abstract}
              onChange={(e) => updateField("abstract", e.target.value)}
              placeholder="Enter the article abstract..."
              className={`${inputClass} resize-y`}
            />
            <p className="mt-2 text-xs text-slate-400">
              Provide a concise summary of the research, findings, and
              contribution.
            </p>
          </div>

          <div>
            <label htmlFor="article-keywords" className={labelClass}>
              Keywords
            </label>
            <input
              id="article-keywords"
              value={form.keywords}
              onChange={(e) => updateField("keywords", e.target.value)}
              placeholder="e.g. democracy, governance, elections"
              className={inputClass}
            />
            <p className="mt-2 text-xs text-slate-400">
              Separate each keyword with a comma.
            </p>
          </div>
        </div>
      </section>

      {/* 02 — Subfields */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <SectionHeading number="02" title="Research Subfields" />

        <p className="mt-3 text-sm text-slate-500">
          Select the subfields that relate to this article. You may select more
          than one.
        </p>

        {subfields.length === 0 ? (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            No active subfields are available yet. You can add subfields from
            the Subfields section of the dashboard.
          </div>
        ) : (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {subfields.map((subfield) => {
              const selected = form.subfieldIds.includes(subfield.id);

              return (
                <label
                  key={subfield.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                    selected
                      ? "border-[#D5B36A] bg-[#FAF5E9]"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggleSubfield(subfield.id)}
                    className="mt-1 h-4 w-4 accent-[#0B1F3A]"
                  />

                  <span className="text-sm font-semibold text-[#0B1F3A]">
                    {subfield.name}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </section>

      {/* 03 — Authors */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <SectionHeading number="03" title="Authors" />

          <button
            type="button"
            onClick={addAuthor}
            className="inline-flex items-center gap-2 rounded-lg border border-[#D5B36A] px-3 py-2 text-sm font-semibold text-[#0B1F3A] hover:bg-[#FAF5E9]"
          >
            <Plus size={16} />
            Add Author
          </button>
        </div>

        <p className="mt-3 text-sm text-slate-500">
          Add authors in the order they should appear in the publication. Only
          the author's full name is required.
        </p>

        <div className="mt-5 space-y-5">
          {form.authors.map((author, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-200 bg-[#FAFAF8] p-4 sm:p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0B1F3A]">
                  Author {index + 1}
                </h3>

                {form.authors.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAuthor(index)}
                    aria-label={`Remove author ${index + 1}`}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={17} />
                  </button>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor={`author-name-${index}`}
                    className={labelClass}
                  >
                    Full Name *
                  </label>
                  <input
                    id={`author-name-${index}`}
                    value={author.fullName}
                    onChange={(e) =>
                      updateAuthor(index, "fullName", e.target.value)
                    }
                    placeholder="Author's full name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor={`author-email-${index}`}
                    className={labelClass}
                  >
                    Email
                  </label>
                  <input
                    id={`author-email-${index}`}
                    type="email"
                    value={author.email}
                    onChange={(e) =>
                      updateAuthor(index, "email", e.target.value)
                    }
                    placeholder="author@example.com"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor={`author-affiliation-${index}`}
                    className={labelClass}
                  >
                    Affiliation
                  </label>
                  <input
                    id={`author-affiliation-${index}`}
                    value={author.affiliation}
                    onChange={(e) =>
                      updateAuthor(index, "affiliation", e.target.value)
                    }
                    placeholder="University or institution"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor={`author-orcid-${index}`}
                    className={labelClass}
                  >
                    ORCID
                  </label>
                  <input
                    id={`author-orcid-${index}`}
                    value={author.orcid}
                    onChange={(e) =>
                      updateAuthor(index, "orcid", e.target.value)
                    }
                    placeholder="0000-0000-0000-0000"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 04 — Publication details */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <SectionHeading number="04" title="Publication Details" />

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="article-doi" className={labelClass}>
              DOI <span className="font-normal text-slate-400">(Optional)</span>
            </label>
            <input
              id="article-doi"
              value={form.doi}
              onChange={(e) => updateField("doi", e.target.value)}
              placeholder="10.xxxx/example"
              className={inputClass}
            />
          </div>

          {/* PDF upload */}
          <div className="sm:col-span-2">
            <label htmlFor="article-pdf" className={labelClass}>
              Full Article PDF
            </label>

            <div className="rounded-xl border border-dashed border-slate-300 bg-[#FAFAF8] p-5">
              {form.pdfUrl ? (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                      <FileText size={23} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#0B1F3A]">
                        PDF uploaded
                      </p>
                      <a
                        href={form.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 block break-all text-xs text-[#8B6B2E] hover:underline"
                      >
                        View uploaded PDF
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-[#0B1F3A] hover:bg-slate-50">
                      <Upload size={15} />
                      Replace PDF
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handlePdfUpload}
                        disabled={uploadingPdf || loading}
                        className="sr-only"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={removePdf}
                      disabled={uploadingPdf || loading}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <X size={16} />
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto text-[#8B6B2E]" size={28} />

                  <p className="mt-3 text-sm font-semibold text-[#0B1F3A]">
                    Upload the full article PDF
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    PDF only · Maximum file size 15 MB
                  </p>

                  <label className="mt-4 inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#0B1F3A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#15345B]">
                    <Upload size={16} />
                    Choose PDF
                    <input
                      id="article-pdf"
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handlePdfUpload}
                      disabled={uploadingPdf || loading}
                      className="sr-only"
                    />
                  </label>
                </div>
              )}

              {uploadingPdf && (
                <p
                  role="status"
                  className="mt-4 text-center text-sm text-slate-500"
                >
                  Uploading your PDF. Please wait...
                </p>
              )}

              {pdfError && (
                <p role="alert" className="mt-3 text-sm text-red-600">
                  {pdfError}
                </p>
              )}

              {pdfSuccess && form.pdfUrl && (
                <p className="mt-3 text-sm text-emerald-700">
                  {pdfSuccess}
                </p>
              )}
            </div>

            <p className="mt-2 text-xs text-slate-400">
              The PDF is uploaded online and its URL is saved with the article.
            </p>
          </div>

          <div>
            <label htmlFor="article-page-start" className={labelClass}>
              First Page
            </label>
            <input
              id="article-page-start"
              type="number"
              min="1"
              step="1"
              value={form.pageStart}
              onChange={(e) => updateField("pageStart", e.target.value)}
              placeholder="e.g. 1"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="article-page-end" className={labelClass}>
              Last Page
            </label>
            <input
              id="article-page-end"
              type="number"
              min="1"
              step="1"
              value={form.pageEnd}
              onChange={(e) => updateField("pageEnd", e.target.value)}
              placeholder="e.g. 24"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="article-submitted" className={labelClass}>
              Submission Date
            </label>
            <input
              id="article-submitted"
              type="date"
              value={form.submittedDate}
              onChange={(e) => updateField("submittedDate", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="article-accepted" className={labelClass}>
              Acceptance Date
            </label>
            <input
              id="article-accepted"
              type="date"
              value={form.acceptedDate}
              onChange={(e) => updateField("acceptedDate", e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="article-publication-date" className={labelClass}>
              Publication Date
            </label>
            <input
              id="article-publication-date"
              type="date"
              value={form.publicationDate}
              onChange={(e) =>
                updateField("publicationDate", e.target.value)
              }
              className={inputClass}
            />
            <p className="mt-2 text-xs text-slate-400">
              The publication year determines the volume. The issue number is
              assigned automatically when the article is published.
            </p>
          </div>
        </div>
      </section>

      {/* 05 — Publishing status */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <SectionHeading number="05" title="Publishing Status" />

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label
            className={`flex cursor-pointer gap-3 rounded-xl border p-4 ${
              form.status === "DRAFT"
                ? "border-[#D5B36A] bg-[#FAF5E9]"
                : "border-slate-200"
            }`}
          >
            <input
              type="radio"
              name="status"
              value="DRAFT"
              checked={form.status === "DRAFT"}
              onChange={(e) => updateField("status", e.target.value)}
              className="mt-1 accent-[#0B1F3A]"
            />
            <span>
              <span className="block text-sm font-semibold text-[#0B1F3A]">
                Save as Draft
              </span>
              <span className="mt-1 block text-xs text-slate-500">
                Keep the article unpublished while you prepare it.
              </span>
            </span>
          </label>

          <label
            className={`flex cursor-pointer gap-3 rounded-xl border p-4 ${
              form.status === "PUBLISHED"
                ? "border-[#D5B36A] bg-[#FAF5E9]"
                : "border-slate-200"
            }`}
          >
            <input
              type="radio"
              name="status"
              value="PUBLISHED"
              checked={form.status === "PUBLISHED"}
              onChange={(e) => updateField("status", e.target.value)}
              className="mt-1 accent-[#0B1F3A]"
            />
            <span>
              <span className="block text-sm font-semibold text-[#0B1F3A]">
                Publish Article
              </span>
              <span className="mt-1 block text-xs text-slate-500">
                Publish the article and automatically assign its volume and
                issue number.
              </span>
            </span>
          </label>
        </div>
      </section>

      {/* Form actions */}
      <div className="flex flex-col-reverse justify-between gap-3 pb-8 sm:flex-row">
        <Link
          href="/admin/articles"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          <ArrowLeft size={16} />
          Cancel
        </Link>

        <button
          type="submit"
          disabled={loading || uploadingPdf}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0B1F3A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#15345B] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Saving...
            </>
          ) : articleId ? (
            <>
              <Save size={17} />
              Save Changes
            </>
          ) : form.status === "PUBLISHED" ? (
            <>
              <Send size={17} />
              Publish Article
            </>
          ) : (
            <>
              <Save size={17} />
              Save Draft
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function SectionHeading({ number, title }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FAF5E9] text-xs font-bold text-[#8B6B2E]">
        {number}
      </span>
      <h2 className="font-serif text-xl font-bold text-[#0B1F3A]">
        {title}
      </h2>
    </div>
  );
}
