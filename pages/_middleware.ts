import { NextRequest, NextResponse } from "next/server";


export async function middleware (req: NextRequest) {

	const url = req.nextUrl.clone();
	const isInMaintenanceMode = process.env.NODE_ENV === 'production';

	if (isInMaintenanceMode) {
		if (!url.pathname.startsWith("/api")) {
			console.log(url.pathname)
			url.pathname = '/maintenance'
		}
	}

	return NextResponse.rewrite(url)

}
