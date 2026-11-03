import type { MetadataRoute } from "next";

const SITE = "https://liliadubita.md";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE}/conflicte`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/confidentialitate`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE}/termeni`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
