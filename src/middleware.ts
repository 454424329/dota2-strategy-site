export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    "/community/new",
    "/community/:category/:slug/edit",
  ],
};
