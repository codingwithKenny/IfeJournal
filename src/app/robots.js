export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
    ],
    sitemap: "https://ifejournalofpolitics.com/sitemap.xml",
    host: "https://ifejournalofpolitics.com",
  };
}