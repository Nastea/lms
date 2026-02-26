import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const pathname = request.nextUrl.pathname;

  // Landing, legal, payment and API routes — no auth required
  const publicPaths = [
    "/login",
    "/signup",
    "/acces-curs",
    "/",
    "/conflicte",
    "/inscriere",
    "/plata",
    "/multumim",
    "/termeni",
    "/confidentialitate",
    "/plan",
    "/mock",
  ];
  const isPublic =
    pathname.startsWith("/api") ||
    pathname === "/inscriere" ||
    pathname.startsWith("/inscriere/") ||
    publicPaths.some((p) => (p === "/" ? pathname === "/" : pathname.startsWith(p)));

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // No Supabase config (e.g. env vars missing on Vercel) — allow all requests through
    return response;
  }

  let isAuthed = false;
  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });
    const { data } = await supabase.auth.getUser();
    isAuthed = !!data?.user;
  } catch {
    // Supabase error (e.g. network, invalid config) — allow request through
    return response;
  }

  if (!isAuthed && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthed && (pathname === "/login" || pathname === "/signup" || pathname === "/acces-curs")) {
    const url = request.nextUrl.clone();
    url.pathname = "/app";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

