import { NextResponse } from "next/server";

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/login" || path === "/signup" || path === "/";
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  // Redirect if not authenticated
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // Redirect based on role for public paths (login/signup)
  if (isPublicPath && token && role) {
    if (role === "admin") {
      return NextResponse.redirect(
        new URL("/dashboard/admin-view", request.nextUrl)
      );
    } else if (role === "user") {
      return NextResponse.redirect(
        new URL("/dashboard/user-view", request.nextUrl)
      );
    }
    return NextResponse.next();
  }

  // Ensure admin can't access user-view
  if (role === "admin" && path === "/dashboard/user-view") {
    return NextResponse.redirect(
      new URL("/dashboard/admin-view", request.nextUrl)
    );
  }

  // Ensure user can't access admin-view
  if (role === "user" && path === "/dashboard/admin-view") {
    return NextResponse.redirect(
      new URL("/dashboard/user-view", request.nextUrl)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login", "/signup"],
};