import { gql } from '@apollo/client';
import { IShopDataStream, IShopProducts } from '@interfaces/products';
import { client } from 'config/apollo';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).send('Method not allowed');
  }

  const cursor = req.query.cursor || null;

  const { data } = (await client.query({
    query: gql`
      query ($cursor: String) {
        productsConnection(orderBy: createdAt_DESC, after: $cursor, first: 10) {
          pageInfo {
            endCursor
            hasNextPage
          }
          edges {
            node {
              sku
              title
              slug
              price
              image {
                url
              }
              productVariants {
                id
              }
            }
          }
        }
      }
    `,
    variables: {
      cursor,
    },
  })) as IShopDataStream;

  const { endCursor, hasNextPage } = data.productsConnection.pageInfo;

  const products: IShopProducts[] = [];

  if (!data.productsConnection.edges.length) {
    return res.status(200).json({ products, cursor: endCursor, hasNextPage });
  }

  data.productsConnection.edges.map((productNode) => {
    const { node } = productNode;

    products.push({
      sku: node.sku,
      title: node.title,
      slug: node.slug,
      price: node.price,
      url: node.image.url,
      hasVariants: node.productVariants.length ? true : false,
    });
  });

  return res.status(200).json({ products, cursor: endCursor, hasNextPage });
}
