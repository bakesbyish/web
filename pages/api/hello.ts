import { NextApiRequest, NextApiResponse } from "next";
import { faker } from '@faker-js/faker'

// Generate mock ecommerce data

export default async function handler (req: NextApiRequest, res: NextApiResponse) {

	// Handle invalid mmethods
	if (req.method !== "GET") {
		return res.status(405).send("Method not allowed")
	}

	const count = parseInt(req.query.count as string)
	const start = req.query.start ? parseInt(req.query.start as string) : 1

	if (!count) {
		return res.status(400).send("Insufficent data")
	}

	const products = [];

	for (let i = 0; i < count; i++) {
		const product = {
			id: start + i,
			name: faker.commerce.productName(),
			href: '#',
			price: faker.commerce.price(),
			imageSrc: faker.image.nature(640, 480, true),
			imageAlt: faker.commerce.productName()
		}

		products.push(product)
	}

	return res.status(200).json(products)
}
