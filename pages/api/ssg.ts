import { gql } from '@apollo/client';
import { client } from 'config/apollo';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Handle invalid methods
  if (req.method !== 'GET') {
    return res.status(405).send('');
  }

  const collections: string[] = [];
  const slugData = await client.query({
    query: gql`
      query {
        catergories {
          catergorySlug
        }
      }
    `,
  });
  slugData.data.catergories.map(
    (data: { __typename: string; catergorySlug: string }) =>
      collections.push(data.catergorySlug)
  );

  const paths: {
    params: { collection: string; cursor: string; page: number };
  }[] = [];

  await (async () => {
    for (let index = 0; collections[index]; index++) {
      const collection = collections[index] as string;

      let cursor: string | null = null;
      let hasNextPage = true;

      await (async () => {
        let page = 0;
        while (hasNextPage) {
          const { data } = await client.query({
            query: gql`
              query ($cursor: String, $catergorySlug: String) {
                productsConnection(
                  orderBy: createdAt_DESC
                  where: {
                    catergories_every: {
                      AND: { catergorySlug: $catergorySlug }
                    }
                  }
                  first: 1
                  after: $cursor
                ) {
                  pageInfo {
                    endCursor
                    hasNextPage
                  }
                }
              }
            `,
            variables: {
              cursor,
              catergorySlug: collection,
            },
          });

          page++;
          paths.push({
            params: {
              collection,
              cursor: cursor ? cursor : '',
              page,
            },
          });

          cursor = data.productsConnection.pageInfo.endCursor as string;
          hasNextPage = data.productsConnection.pageInfo.hasNextPage;
        }
      })();
    }
  })();

  return res.status(200).json({ paths });
}
