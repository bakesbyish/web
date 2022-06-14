import { NextRequest, NextResponse } from "next/server";


export async function middleware (req: NextRequest) {
	const url = req.nextUrl.clone();

	if (url.pathname.split("/").length === 3) {
		const collection = url.pathname.split("/")[2];
		url.pathname = `/collections/${collection}/1`
	}

	return NextResponse.rewrite(url)

}
