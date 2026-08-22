import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const alt = "ARSAN — Executive Search & Manufacturing Talent Advisory";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// Without this the card renders on demand — a serverless invocation every time
// a crawler looks at the link. Everything it needs is known at build time.
export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "es" }];
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return ogImage({
    locale,
    namespace: "subpage.executiveSearch",
    photo: "story-critical-search",
  });
}
