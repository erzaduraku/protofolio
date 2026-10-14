/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // Keep Turbopack rooted at this project (avoids picking up a parent package-lock.json)
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    // app/global-not-found.js: the root layout lives in app/[locale], so unmatched URLs need their own 404 document.
    globalNotFound: true,
  },
};

export default nextConfig;