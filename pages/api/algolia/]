import { NextApiRequest, NextApiResponse } from 'next';
import algoliasearch from 'algoliasearch';
import { client } from 'config/apollo';
import { gql } from '@apollo/client';

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

  const { data } = (await client.query({
    query: gql`
      query {
        products {
          sku
          title
          slug
          description
          price
          image {
            url
          }
        }
      }
    `,
  })) as {
    data: {
      products: {
        sku: number;
        title: string;
        slug: string;
        description: string;
        price: number;
        image: {
          url: string;
        };
      }[];
    };
  };

  if (!data) {
    return res.status(500).send('Internal server error');
  }

  try {
    const products = data.products.map((product) => {
      return {
        objectID: product.sku,
        title: product.title,
        slug: product.slug,
        description: product.description,
        price: product.price,
        image: product.image.url,
      };
    });

    try {
      await index.saveObjects(products);
      return res
        .status(200)
        .send('Algolia all products index updated succsessfully');
    } catch (error) {
      console.error(error);
      return res.status(500).send('Error updating the algolia index');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal server error');
  }
}
