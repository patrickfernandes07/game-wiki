import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const token = req.auth;
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = req.nextUrl.pathname === "/login";

  // Se não está autenticado e está tentando acessar admin
  if (isAdminRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Se está autenticado mas não é admin tentando acessar admin
  if (isAdminRoute && token?.user && token.user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Se está autenticado e tenta acessar login, redireciona para admin
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/login"],
};

// IMPORTANTE: Forçar Node.js runtime
export const runtime = "nodejs";
