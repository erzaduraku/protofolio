/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // Keep Turbopack rooted at this project (avoids picking up a parent package-lock.json)
  turbopack: {
    root: process.cwd(),
  },
  // Next 16: next/image only accepts quality values listed here (default [75]); 90 is used by the project screenshots
  images: {
    qualities: [75, 90],
  },
  experimental: {
    // app/global-not-found.js: the root layout lives in app/[locale], so unmatched URLs need their own 404 document.
    globalNotFound: true,
  },
};

export default nextConfig;