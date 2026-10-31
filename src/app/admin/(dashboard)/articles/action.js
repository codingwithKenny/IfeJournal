
"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

/*
|--------------------------------------------------------------------------
| AUTHENTICATION
|--------------------------------------------------------------------------
*/

async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("You must be logged in as an administrator.");
  }

  const admin = await prisma.admin.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!admin) {
    throw new Error("You are not authorized to perform this action.");
  }

  return admin;
}

/*
|--------------------------------------------------------------------------
| SHARED HELPERS
|--------------------------------------------------------------------------
*/

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180);
}

function parseDate(value) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error("One of the dates provided is invalid.");
  }

  return date;
}

function cleanOptional(value) {
  if (value === undefined || value === null) return null;

  const cleaned = String(value).trim();

  return cleaned || null;
}

function friendlyError(error) {
  if (error?.code === "P2002") {
    return "This record conflicts with an existing unique value, such as its name, DOI or slug.";
  }

  if (error?.code === "P2003") {
    return "One of the selected records is no longer available. Refresh and try again.";
  }

  if (error?.code === "P2025") {
    return "The requested record could not be found. It may have already been deleted.";
  }

  if (error?.code === "P2034") {
    return "Another publication update happened at the same time. Please try again.";
  }

  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
}

async function generateUniqueSlug(model, value, excludeId = null) {
  const baseSlug = slugify(value) || "record";
  let slug = baseSlug;
  let count = 1;

  while (true) {
    const existing = await model.findFirst({
      where: {
        slug,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: { id: true },
    });

    if (!existing) return slug;

    count += 1;
    slug = `${baseSlug}-${count}`;
  }
}

function revalidateArticlePages() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/articles");
  revalidatePath("/admin/subfields");
  revalidatePath("/articles");
  revalidatePath("/journal");
  revalidatePath("/archive");
}

async function finishManagementAction(path, callback) {
  await requireAdmin();

  try {
    await callback();
  } catch (error) {
    console.error(`Management action failed (${path}):`, error);
    throw new Error(friendlyError(error));
  }

  revalidatePath(path);
  revalidateArticlePages();

  redirect(path);
}

/*
|--------------------------------------------------------------------------
| ARTICLE INPUT
|--------------------------------------------------------------------------
*/

function normalizeInput(input) {
  if (!input || typeof input !== "object") {
    throw new Error("Invalid article information.");
  }

  const title = String(input.title || "").trim();
  const abstract = String(input.abstract || "").trim();

  if (!title) {
    throw new Error("Please enter the article title.");
  }

  if (!abstract) {
    throw new Error("Please enter the article abstract.");
  }

  const status =
    input.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT";

  const authors = Array.isArray(input.authors)
    ? input.authors
        .map((author) => ({
          fullName: String(author.fullName || "").trim(),
          email: cleanOptional(author.email),
          affiliation: cleanOptional(author.affiliation),
          orcid: cleanOptional(author.orcid),
        }))
        .filter((author) => author.fullName)
    : [];

  if (authors.length === 0) {
    throw new Error("Please add at least one author.");
  }

  for (const author of authors) {
    if (
      author.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(author.email)
    ) {
      throw new Error(`Invalid email address for ${author.fullName}.`);
    }

    if (
      author.orcid &&
      !/^(\d{4}-){3}\d{3}[\dX]$/i.test(author.orcid)
    ) {
      throw new Error(`Invalid ORCID format for ${author.fullName}.`);
    }
  }

  const keywords = Array.isArray(input.keywords)
    ? input.keywords
    : typeof input.keywords === "string"
      ? input.keywords.split(",")
      : [];

  const subfieldIds = [
    ...new Set(
      (Array.isArray(input.subfieldIds)
        ? input.subfieldIds
        : Array.isArray(input.subfields)
          ? input.subfields
          : []
      )
        .map((id) => String(id).trim())
        .filter(Boolean)
    ),
  ];

  const pageStart =
    input.pageStart === "" || input.pageStart == null
      ? null
      : Number(input.pageStart);

  const pageEnd =
    input.pageEnd === "" || input.pageEnd == null
      ? null
      : Number(input.pageEnd);

  for (const [label, value] of [
    ["First page", pageStart],
    ["Last page", pageEnd],
  ]) {
    if (
      value !== null &&
      (!Number.isSafeInteger(value) || value < 1)
    ) {
      throw new Error(`${label} must be a positive whole number.`);
    }
  }

  if (
    pageStart !== null &&
    pageEnd !== null &&
    pageEnd < pageStart
  ) {
    throw new Error("The last page cannot be less than the first page.");
  }

  const doi = cleanOptional(input.doi);
  const pdfUrl = cleanOptional(input.pdfUrl);

  if (pdfUrl) {
    try {
      const url = new URL(pdfUrl);

      if (url.protocol !== "https:" && url.protocol !== "http:") {
        throw new Error();
      }
    } catch {
      throw new Error("Please enter a valid PDF URL.");
    }
  }

  return {
    title,
    abstract,
    status,
    keywords: [
      ...new Set(
        keywords
          .map((keyword) => String(keyword).trim())
          .filter(Boolean)
      ),
    ],
    subfieldIds,
    doi,
    pdfUrl,
    pageStart,
    pageEnd,
    submittedDate: parseDate(input.submittedDate),
    acceptedDate: parseDate(input.acceptedDate),
    publicationDate: parseDate(input.publicationDate),
    authors,
  };
}

/*
|--------------------------------------------------------------------------
| ARTICLE RELATION VALIDATION
|--------------------------------------------------------------------------
*/

async function validateRelations(data, articleId = null) {
  if (data.doi) {
    const existingDoi = await prisma.article.findFirst({
      where: {
        doi: data.doi,
        ...(articleId ? { id: { not: articleId } } : {}),
      },
      select: { id: true },
    });

    if (existingDoi) {
      throw new Error("An article with this DOI already exists.");
    }
  }

  if (data.subfieldIds.length > 0) {
    const allowedSubfields = await prisma.subfield.count({
      where: {
        id: { in: data.subfieldIds },
        OR: [
          { isActive: true },
          ...(articleId
            ? [
                {
                  articles: {
                    some: { articleId },
                  },
                },
              ]
            : []),
        ],
      },
    });

    if (allowedSubfields !== data.subfieldIds.length) {
      throw new Error("One or more selected subfields are unavailable.");
    }
  }
}

/*
|--------------------------------------------------------------------------
| ARTICLE AUTHORS
|--------------------------------------------------------------------------
*/

async function saveAuthors(tx, articleId, authors) {
  await tx.articleAuthor.deleteMany({
    where: { articleId },
  });

  for (let index = 0; index < authors.length; index++) {
    const authorData = authors[index];
    let author = null;

    if (authorData.orcid) {
      author = await tx.author.findUnique({
        where: { orcid: authorData.orcid },
      });
    }

    if (!author && authorData.email) {
      author = await tx.author.findFirst({
        where: { email: authorData.email },
      });
    }

    if (author) {
      author = await tx.author.update({
        where: { id: author.id },
        data: {
          fullName: authorData.fullName,
          email: authorData.email,
          affiliation: authorData.affiliation,
          orcid: authorData.orcid,
        },
      });
    } else {
      author = await tx.author.create({
        data: authorData,
      });
    }

    await tx.articleAuthor.create({
      data: {
        articleId,
        authorId: author.id,
        authorOrder: index + 1,
      },
    });
  }
}

/*
|--------------------------------------------------------------------------
| ARTICLE SUBFIELDS
|--------------------------------------------------------------------------
*/

async function saveSubfields(tx, articleId, subfieldIds) {
  await tx.articleSubfield.deleteMany({
    where: { articleId },
  });

  if (subfieldIds.length === 0) return;

  await tx.articleSubfield.createMany({
    data: subfieldIds.map((subfieldId) => ({
      articleId,
      subfieldId,
    })),
    skipDuplicates: true,
  });
}

/*
|--------------------------------------------------------------------------
| AUTOMATIC VOLUME AND ISSUE NUMBERING
|--------------------------------------------------------------------------
|
| 2026 = Volume 1
| 2027 = Volume 2
| 2028 = Volume 3
|
| Only published articles receive a volume and issue number.
| Each published article gets its own sequential issue number.
|--------------------------------------------------------------------------
*/

const FIRST_VOLUME_YEAR = 2026;

async function getOrCreateVolume(tx, year) {
  if (
    !Number.isInteger(year) ||
    year < FIRST_VOLUME_YEAR ||
    year > 2200
  ) {
    throw new Error(
      `Publication year must be ${FIRST_VOLUME_YEAR} or later.`
    );
  }

  const number = year - FIRST_VOLUME_YEAR + 1;

  return tx.volume.upsert({
    where: { year },
    create: {
      year,
      number,
    },
    update: {},
  });
}

/*
|--------------------------------------------------------------------------
| FAST ISSUE RENUMBERING
|--------------------------------------------------------------------------
|
| PostgreSQL ROW_NUMBER() assigns all issue numbers in one operation.
| This avoids sequential article updates and reduces transaction time.
|--------------------------------------------------------------------------
*/

async function renumberVolume(tx, volumeId) {
  if (!volumeId) return;

  // Clear existing numbers first to avoid unique constraint conflicts.
  await tx.article.updateMany({
    where: {
      volumeId,
      status: "PUBLISHED",
    },
    data: {
      issueNumber: null,
    },
  });

  // Reassign issue numbers in publication-date order.
  await tx.$executeRaw`
    WITH ranked_articles AS (
      SELECT
        "id",
        ROW_NUMBER() OVER (
          ORDER BY
            "publicationDate" ASC,
            "createdAt" ASC,
            "id" ASC
        )::INTEGER AS new_issue_number
      FROM "Article"
      WHERE
        "volumeId" = ${volumeId}
        AND "status" = 'PUBLISHED'
    )
    UPDATE "Article" AS article
    SET "issueNumber" = ranked_articles.new_issue_number
    FROM ranked_articles
    WHERE article."id" = ranked_articles."id";
  `;
}

/*
|--------------------------------------------------------------------------
| SYNCHRONIZE PUBLICATION
|--------------------------------------------------------------------------
*/

async function synchronizePublication(
  tx,
  articleId,
  previousVolumeId,
  status,
  publicationDate
) {
  if (status !== "PUBLISHED") {
    await tx.article.update({
      where: { id: articleId },
      data: {
        status: "DRAFT",
        volumeId: null,
        issueNumber: null,
        publicationDate,
      },
    });

    if (previousVolumeId) {
      await renumberVolume(tx, previousVolumeId);
    }

    return;
  }

  const effectivePublicationDate = publicationDate || new Date();
  const year = effectivePublicationDate.getUTCFullYear();

  const volume = await getOrCreateVolume(tx, year);

  await tx.article.update({
    where: { id: articleId },
    data: {
      status: "PUBLISHED",
      publicationDate: effectivePublicationDate,
      volumeId: volume.id,
      issueNumber: null,
    },
  });

  if (previousVolumeId && previousVolumeId !== volume.id) {
    await renumberVolume(tx, previousVolumeId);
  }

  await renumberVolume(tx, volume.id);
}

/*
|--------------------------------------------------------------------------
| TRANSACTION OPTIONS
|--------------------------------------------------------------------------
*/

const transactionOptions = {
  isolationLevel: "Serializable",
  maxWait: 10000,
  timeout: 15000,
};

/*
|--------------------------------------------------------------------------
| CREATE ARTICLE
|--------------------------------------------------------------------------
*/

export async function createArticle(input) {
  try {
    await requireAdmin();

    const data = normalizeInput(input);

    await validateRelations(data);

    const slug = await generateUniqueSlug(
      prisma.article,
      data.title
    );

    const article = await prisma.$transaction(
      async (tx) => {
        const created = await tx.article.create({
          data: {
            title: data.title,
            slug,
            abstract: data.abstract,
            status: "DRAFT",
            keywords: data.keywords,
            doi: data.doi,
            pdfUrl: data.pdfUrl,
            pageStart: data.pageStart,
            pageEnd: data.pageEnd,
            submittedDate: data.submittedDate,
            acceptedDate: data.acceptedDate,
            publicationDate: data.publicationDate,
          },
        });

        await saveAuthors(tx, created.id, data.authors);

        await saveSubfields(
          tx,
          created.id,
          data.subfieldIds
        );

        if (data.status === "PUBLISHED") {
          await synchronizePublication(
            tx,
            created.id,
            null,
            "PUBLISHED",
            data.publicationDate || new Date()
          );
        }

        return created;
      },
      transactionOptions
    );

    revalidateArticlePages();

    return {
      success: true,
      message:
        data.status === "PUBLISHED"
          ? "Article published successfully."
          : "Article saved as a draft.",
      articleId: article.id,
    };
  } catch (error) {
    console.error("Create article error:", error);

    return {
      success: false,
      error: friendlyError(error),
    };
  }
}

/*
|--------------------------------------------------------------------------
| UPDATE ARTICLE
|--------------------------------------------------------------------------
*/

export async function updateArticle(articleId, input) {
  try {
    await requireAdmin();

    if (!articleId) {
      throw new Error("Article ID is required.");
    }

    const existing = await prisma.article.findUnique({
      where: { id: articleId },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        volumeId: true,
        publicationDate: true,
      },
    });

    if (!existing) {
      throw new Error("Article not found.");
    }

    const data = normalizeInput(input);

    await validateRelations(data, articleId);

    const slug =
      data.title === existing.title
        ? existing.slug
        : await generateUniqueSlug(
            prisma.article,
            data.title,
            articleId
          );

    const effectivePublicationDate =
      data.status === "PUBLISHED"
        ? data.publicationDate || existing.publicationDate || new Date()
        : data.publicationDate;

    await prisma.$transaction(
      async (tx) => {
        await tx.article.update({
          where: { id: articleId },
          data: {
            title: data.title,
            slug,
            abstract: data.abstract,
            keywords: data.keywords,
            doi: data.doi,
            pdfUrl: data.pdfUrl,
            pageStart: data.pageStart,
            pageEnd: data.pageEnd,
            submittedDate: data.submittedDate,
            acceptedDate: data.acceptedDate,
            publicationDate: effectivePublicationDate,
          },
        });

        await saveAuthors(tx, articleId, data.authors);

        await saveSubfields(
          tx,
          articleId,
          data.subfieldIds
        );

        await synchronizePublication(
          tx,
          articleId,
          existing.volumeId,
          data.status,
          effectivePublicationDate
        );
      },
      transactionOptions
    );

    revalidateArticlePages();

    return {
      success: true,
      message: "Article updated successfully.",
      articleId,
    };
  } catch (error) {
    console.error("Update article error:", error);

    return {
      success: false,
      error: friendlyError(error),
    };
  }
}

/*
|--------------------------------------------------------------------------
| DELETE ARTICLE
|--------------------------------------------------------------------------
*/

export async function deleteArticle(articleId) {
  try {
    await requireAdmin();

    if (!articleId) {
      throw new Error("Article ID is required.");
    }

    await prisma.$transaction(
      async (tx) => {
        const article = await tx.article.findUnique({
          where: { id: articleId },
          select: {
            id: true,
            volumeId: true,
          },
        });

        if (!article) {
          throw new Error("Article not found.");
        }

        const previousVolumeId = article.volumeId;

        await tx.article.delete({
          where: { id: articleId },
        });

        if (previousVolumeId) {
          await renumberVolume(tx, previousVolumeId);
        }
      },
      transactionOptions
    );

    revalidateArticlePages();

    return {
      success: true,
      message: "Article deleted successfully and issue numbers updated.",
    };
  } catch (error) {
    console.error("Delete article error:", error);

    return {
      success: false,
      error: friendlyError(error),
    };
  }
}

/*
|--------------------------------------------------------------------------
| PUBLISH ARTICLE
|--------------------------------------------------------------------------
*/

export async function publishArticle(articleId) {
  try {
    await requireAdmin();

    if (!articleId) {
      throw new Error("Article ID is required.");
    }

    await prisma.$transaction(
      async (tx) => {
        const article = await tx.article.findUnique({
          where: { id: articleId },
          select: {
            id: true,
            status: true,
            volumeId: true,
            publicationDate: true,
          },
        });

        if (!article) {
          throw new Error("Article not found.");
        }

        await synchronizePublication(
          tx,
          article.id,
          article.volumeId,
          "PUBLISHED",
          article.publicationDate || new Date()
        );
      },
      transactionOptions
    );

    revalidateArticlePages();

    return {
      success: true,
      message: "Article published successfully.",
    };
  } catch (error) {
    console.error("Publish article error:", error);

    return {
      success: false,
      error: friendlyError(error),
    };
  }
}

/*
|--------------------------------------------------------------------------
| UNPUBLISH ARTICLE
|--------------------------------------------------------------------------
*/

export async function unpublishArticle(articleId) {
  try {
    await requireAdmin();

    if (!articleId) {
      throw new Error("Article ID is required.");
    }

    await prisma.$transaction(
      async (tx) => {
        const article = await tx.article.findUnique({
          where: { id: articleId },
          select: {
            id: true,
            volumeId: true,
            publicationDate: true,
          },
        });

        if (!article) {
          throw new Error("Article not found.");
        }

        await synchronizePublication(
          tx,
          article.id,
          article.volumeId,
          "DRAFT",
          article.publicationDate
        );
      },
      transactionOptions
    );

    revalidateArticlePages();

    return {
      success: true,
      message: "Article moved back to draft and issue numbers updated.",
    };
  } catch (error) {
    console.error("Unpublish article error:", error);

    return {
      success: false,
      error: friendlyError(error),
    };
  }
}

/*
|--------------------------------------------------------------------------
| ARTICLE PDF UPLOAD
|--------------------------------------------------------------------------
*/

export async function uploadArticlePdf(formData) {
  try {
    await requireAdmin();

    const file = formData.get("file");

    if (!file || typeof file.arrayBuffer !== "function") {
      throw new Error("Please select a PDF file.");
    }

    if (
      file.type !== "application/pdf" ||
      !file.name?.toLowerCase().endsWith(".pdf")
    ) {
      throw new Error("Please select a PDF file.");
    }

    const maxSize = 15 * 1024 * 1024;

    if (file.size === 0 || file.size > maxSize) {
      throw new Error("The PDF must be smaller than 15 MB.");
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (buffer.subarray(0, 5).toString() !== "%PDF-") {
      throw new Error("The selected file is not a valid PDF.");
    }

    const {
      CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET,
    } = process.env;

    if (
      !CLOUDINARY_CLOUD_NAME ||
      !CLOUDINARY_API_KEY ||
      !CLOUDINARY_API_SECRET
    ) {
      throw new Error("Cloudinary is not configured.");
    }

    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    });

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "ife-journal/articles",
          format: "pdf",
          allowed_formats: ["pdf"],
          public_id: `article-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 10)}`,
          overwrite: false,
        },
        (error, uploadedFile) => {
          if (error) reject(error);
          else resolve(uploadedFile);
        }
      );

      stream.end(buffer);
    });

    return {
      success: true,
      url: result.secure_url,
      message: "PDF uploaded successfully.",
    };
  } catch (error) {
    console.error("Upload article PDF error:", error);

    return {
      success: false,
      error: friendlyError(error),
    };
  }
}

/*
|--------------------------------------------------------------------------
| SUBFIELD MANAGEMENT
|--------------------------------------------------------------------------
*/

export async function createSubfield(formData) {
  return finishManagementAction("/admin/subfields", async () => {
    const name = String(formData.get("name") || "").trim();

    if (!name) {
      throw new Error("Subfield name is required.");
    }

    const slug = await generateUniqueSlug(
      prisma.subfield,
      name
    );

    await prisma.subfield.create({
      data: {
        name,
        slug,
        isActive: true,
      },
    });
  });
}

export async function updateSubfield(formData) {
  return finishManagementAction("/admin/subfields", async () => {
    const id = String(formData.get("id") || "");
    const name = String(formData.get("name") || "").trim();

    if (!id || !name) {
      throw new Error("Subfield ID and name are required.");
    }

    const existing = await prisma.subfield.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      throw new Error("Subfield not found.");
    }

    const slug = await generateUniqueSlug(
      prisma.subfield,
      name,
      id
    );

    await prisma.subfield.update({
      where: { id },
      data: {
        name,
        slug,
        isActive: formData.get("isActive") === "on",
      },
    });
  });
}

export async function deleteSubfield(formData) {
  return finishManagementAction("/admin/subfields", async () => {
    const id = String(formData.get("id") || "");

    if (!id) {
      throw new Error("Subfield ID is required.");
    }

    const subfield = await prisma.subfield.findUnique({
      where: { id },
      select: {
        id: true,
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });

    if (!subfield) {
      throw new Error("Subfield not found.");
    }

    if (subfield._count.articles > 0) {
      throw new Error(
        "This subfield is assigned to articles. Deactivate it instead of deleting it."
      );
    }

    await prisma.subfield.delete({
      where: { id },
    });
  });
}
