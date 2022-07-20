import { IShopProducts } from '@interfaces/products';
import { sanity } from 'config/sanity';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).send('Method not allowed');
  }

  const page = parseInt(req.query.page as string) || null;
  const limit = parseInt(req.query.limit as string) || null;

  if (!(page && limit)) {
    return res.status(400).send('Insufficent data');
  }

  const products = (await sanity.fetch(
    `*[_type == "products"][${(page - 1) * limit}...${page * limit}]{
				sku,
				title,
				"slug": slug.current,
				price,
				"url": image.asset -> url,
				"hasVariants": defined(count(productVariants[] -> title))
			}`
  )) as IShopProducts[];

  return res.status(200).json({ products });
}
