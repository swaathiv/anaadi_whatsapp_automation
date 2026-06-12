import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // Let Meta's webhook through WITHOUT authentication so messages keep flowing.
  if (req.nextUrl.pathname.startsWith("/api/webhook")) {
    return NextResponse.next();
  }

  const basicAuth = req.headers.get("authorization");

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1] ?? "";
    const [user, pwd] = atob(authValue).split(":");

    if (
      user === process.env.DASHBOARD_USER &&
      pwd === process.env.DASHBOARD_PASSWORD
    ) {
      return NextResponse.next();
    }
  }

  // No/invalid credentials -> prompt the browser for username + password.
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Anaadi Dashboard"',
    },
  });
}

// Run on every route except Next.js internal/static assets.
// The webhook is allowed through inside the function above.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
