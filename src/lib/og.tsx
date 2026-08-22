import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

/**
 * One renderer behind every route's `opengraph-image.tsx`.
 *
 * A shared link card in the site's own world: the photograph the page already
 * uses on the right, navy raking over it exactly as the hero does, and the
 * ARSAN lockup with the page title on the left. Per-route files stay three
 * lines each — the title comes from the same `subpage.*` catalog that feeds
 * `generateMetadata`, so a copy change can never leave the card stale, in
 * either language.
 *
 * Assets are read from disk rather than fetched: these render at build time,
 * and a build that depends on a network round-trip is a build that can fail
 * for reasons unrelated to the code.
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const asset = (name: string) => join(process.cwd(), "assets", name);
const photoPath = (name: string) =>
  join(process.cwd(), "public", "images", `${name}.jpg`);

/**
 * The card's photograph, from disk or from Sanity.
 *
 * Articles carry their image in the CMS now and everything else still ships
 * one in `public/images`, so this takes either. Satori has no network of its
 * own — the bytes have to be inlined as a data URI either way, so the only
 * difference is where they are read from.
 */
async function loadPhoto(photo: string): Promise<Buffer> {
  if (!/^https?:\/\//.test(photo)) return readFile(photoPath(photo));
  const response = await fetch(photo);
  if (!response.ok) {
    throw new Error(`OG photo ${photo} responded ${response.status}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

async function loadFonts() {
  const [display, body, bodyBold] = await Promise.all([
    readFile(asset("CormorantGaramond-SemiBold.ttf")),
    readFile(asset("LibreFranklin-Medium.ttf")),
    readFile(asset("LibreFranklin-SemiBold.ttf")),
  ]);
  return [
    {
      name: "Cormorant",
      data: display,
      style: "normal" as const,
      weight: 600 as const,
    },
    {
      name: "Franklin",
      data: body,
      style: "normal" as const,
      weight: 500 as const,
    },
    {
      name: "Franklin",
      data: bodyBold,
      style: "normal" as const,
      weight: 600 as const,
    },
  ];
}

/**
 * Card height is the constraint, not width. With 72px padding there are 486px
 * to divide between the lockup, the title and the region line, and the longest
 * title on the site ("Su operación en México empieza mucho antes que la
 * producción.", 61 chars) wraps to four lines. Sized so that case still leaves
 * daylight around the brass rule rather than landing on the descriptor.
 */
function titleSize(title: string) {
  if (title.length > 50) return 60;
  if (title.length > 36) return 70;
  return 84;
}

export async function ogImage({
  locale,
  namespace,
  photo,
  title: explicitTitle,
}: {
  locale: string;
  /** `subpage.*` key, or omitted for the site-level card */
  namespace?: string;
  /** A basename in `public/images`, or an absolute image URL. */
  photo: string;
  /** Overrides the namespace lookup — articles keep their copy in a module. */
  title?: string;
}) {
  const [fonts, photoData, wordmarkData, tTitle] = await Promise.all([
    loadFonts(),
    loadPhoto(photo),
    readFile(join(process.cwd(), "public", "logo", "arsan-lockup-cream.png")),
    getTranslations({ locale, namespace: namespace ?? "home.hero" }),
  ]);

  // Subpages carry an editorial `title`. The site-level card takes the hero
  // headline instead of `meta.title`, which only restates the lockup already
  // printed above it.
  const title =
    explicitTitle ??
    (namespace
      ? tTitle("title")
      : `${tTitle("headlineLead")} ${tTitle("headlineEmphasis")} ${tTitle("headlineTail")}`);

  const src = `data:image/jpeg;base64,${photoData.toString("base64")}`;
  const wordmark = `data:image/png;base64,${wordmarkData.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: "#061e39",
        fontFamily: "Franklin",
      }}
    >
      {/* the photograph fills the card; navy rakes across it left to right,
          the same move the hero makes */}
      {/* biome-ignore lint/performance/noImgElement: ImageResponse has no next/image */}
      <img
        src={src}
        alt=""
        width={OG_SIZE.width}
        height={OG_SIZE.height}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          background:
            "linear-gradient(90deg, rgba(0,26,54,0.97) 0%, rgba(6,30,57,0.95) 46%, rgba(6,30,57,0.55) 58%, rgba(6,30,57,0) 76%)",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          width: 720,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* the supplied artwork, not type we set — see src/components/ui/logo.tsx */}
          {/* biome-ignore lint/performance/noImgElement: ImageResponse has no next/image */}
          <img src={wordmark} alt="ARSAN" width={264} height={71} />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "34px 0",
          }}
        >
          <div
            style={{
              width: 64,
              height: 3,
              backgroundColor: "#a2865a",
              marginBottom: 30,
            }}
          />
          <div
            style={{
              fontFamily: "Cormorant",
              fontSize: titleSize(title),
              lineHeight: 1.1,
              color: "#fefefa",
              maxWidth: 576,
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: 2.4,
            textTransform: "uppercase",
            color: "#cdb794",
          }}
        >
          {locale === "es"
            ? "EE. UU. · México · Transfronterizo"
            : "U.S. · Mexico · Cross-Border"}
        </div>
      </div>
    </div>,
    { ...OG_SIZE, fonts },
  );
}
