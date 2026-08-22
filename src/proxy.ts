import createProxy from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createProxy(routing);

export const config = {
  // Skip API routes, Next internals, files with extensions — and /studio,
  // which is Sanity Studio. It is not a localised page: routing it through
  // next-intl would rewrite it to /en/studio and hand the Studio's own router
  // a basePath it does not have.
  matcher: "/((?!api|studio|_next|_vercel|.*\\..*).*)",
};
