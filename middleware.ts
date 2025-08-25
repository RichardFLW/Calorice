// middleware.ts
import { auth } from "@/auth";

export default auth((req) => {
  // Si pas de session et que l’URL commence par /dashboard → redirige vers /
  if (!req.auth && req.nextUrl.pathname.startsWith("/dashboard")) {
    return Response.redirect(new URL("/", req.nextUrl));
  }
});

// Limite le middleware uniquement au dashboard
export const config = {
  matcher: ["/dashboard/:path*"],
};
