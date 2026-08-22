import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    /**
     * Article images are served from Sanity's CDN. Scoped to this project's
     * bucket rather than the whole host: `cdn.sanity.io` serves every Sanity
     * project on the internet, and an open pattern would let any URL a
     * content bug produced be proxied through this site's image optimiser.
     */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/shop59xi/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
