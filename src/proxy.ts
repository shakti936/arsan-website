import createProxy from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createProxy(routing);

export const config = {
  // Skip API routes, Next internals, and files with extensions
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
