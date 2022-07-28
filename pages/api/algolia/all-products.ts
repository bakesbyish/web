import { NextApiRequest, NextApiResponse } from 'next';
import algoliasearch from 'algoliasearch';
import { sanity } from 'config/sanity';

// Initialize algolia index
const algolia = algoliasearch(
  process.env.ALGOLIA_APPLICATION_ID,
  process.env.ALGOLIA_ADMIN_API_KEY
);
const index = algolia.initIndex('allProducts');

export default async function addAllProducts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Handle invalid methods
  if (req.method !== 'GET') {
    return res.status(405).send('Method not allowed');
  }

  const products = await sanity.fetch(
    `*[_type == "products"] {
				"objectID": sku,
				title,
				"slug": slug.current,
				description,
				price,
				"image": image.asset -> url,
				"variants": productVariants[] -> title,
				"brand": (brand[] -> title)[0]
			}`
  );

  if (!products) {
    return res.status(500).send('Internal server error');
  }

  try {
    await index.saveObjects(products);
    return res
      .status(200)
      .send('Algolia all products index updated succsessfully');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error updating the algolia index');
  }
}
