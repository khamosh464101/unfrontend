import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    console.log("trrrrrrrrrrrrrrrrigered", req.nextUrl?.pathname);
    if (req.nextauth.token.twofa && req.nextUrl?.pathname !== "/") {
      return NextResponse.rewrite(new URL("/authentication/verify", req.url));
    }

    if (
      !req.nextauth.token.twofa &&
      (req.nextUrl?.pathname == "/authentication/verify/" ||
        req.nextUrl?.pathname == "/")
    ) {
      console.log("working here");
      return NextResponse.redirect(new URL("/dashboards/projects", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboards/:path*", "/authentication/verify/:path*"],
};
