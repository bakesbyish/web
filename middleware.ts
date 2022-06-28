import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {

	// Get the current URL
	const url = req.nextUrl.clone()

	// Handle collections with no page number
	if (url.pathname.startsWith("/collections/")) {
		if (url.pathname.split("/").length === 3) {
			const collection = url.pathname.split("/")[2];
			url.pathname = `/collections/${collection}/1`
		}
	}

	return NextResponse.rewrite(url)
}

export const config = {
	matcher: ['/collections/:path/:path*']
}
