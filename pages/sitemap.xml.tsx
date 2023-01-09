import { getBaseUrl } from "@lib/utils";
import { sanity } from "config/sanity";
import * as fs from "fs";
import { GetServerSideProps } from "next";

export default function Sitemap() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const BASE_URL = getBaseUrl();

  // Fetch static paths
  const staticPaths = fs
    .readdirSync("pages")
    .filter((staticPage) => {
      return ![
        "api",
        "_app.tsx",
        "_document.tsx",
        "404.tsx",
        "sitemap.xml.tsx",
        "checkout.tsx",
        "profile.tsx",
        "maintenance.tsx",
        "orders.tsx",
      ].includes(staticPage);
    })
    .map((staticPagePath) => {
      return `${BASE_URL}/${staticPagePath}`;
    });

  // Fetch products
  const products = (await sanity.fetch(
    `*[_type == "products"]{
				"slug": slug.current
			}`,
  )).map((item: { slug: string }) => {
    return `${BASE_URL}/shop/${item.slug}`;
  });

  // Fetch collections
  const LIMIT = 20;
  const collections = await Promise.all((await sanity.fetch(
    `*[_type == "categories"] | order(_createdAt asc){
				"slug": slug.current
			}`,
  )).map(async (item: { slug: string }) => {
    const data = (await sanity.fetch(
      `*[_type == "categories" && slug.current == "${item.slug}"]{
					"count": count(*[_type == "products" && references(^._id)]{title})
				}`,
    )) as {
      count: number;
    }[];

    const { count } = data[0];
    const pages = count % LIMIT ? Math.floor(count / LIMIT) + 1 : Math.floor(count / LIMIT);

    for (let page = 1; page <= pages; page++) {
      return `${BASE_URL}/collections/${item.slug}/${page.toString()}`;
    }
  }));

  const allPaths = [...staticPaths, ...products, ...collections];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${
    allPaths
      .map((url) => {
        return `
            <url>
              <loc>${url}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>monthly</changefreq>
              <priority>1.0</priority>
            </url>
          `;
      })
      .join("")
  }
    </urlset>
`;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};
