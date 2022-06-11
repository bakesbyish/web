import { gql } from "@apollo/client";
import { client } from "config/apollo";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler (req: NextApiRequest, res: NextApiResponse) {

	const cursors: string[] = [];
	let cursor = null;
	let hasNextPage = true;

	do {

		const { data } = await client.query({
			query: gql`
				query ($cursor: String, $limit: Int) {
					productsConnection (orderBy: createdAt_DESC, first: $limit, after: $cursor) {
						pageInfo {
							hasNextPage
							endCursor
						}
					}
				}
			`,
			variables: {
				cursor,
				limit: 1
			}
		})

		cursor = data.productsConnection.pageInfo.endCursor
		hasNextPage = data.productsConnection.pageInfo.hasNextPage
		cursors.push(cursor)

	}
	while (hasNextPage);

	console.log(cursors)

	return res.status(200).send("ok")

}
