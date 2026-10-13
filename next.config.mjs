/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // Keep Turbopack rooted at this project (avoids picking up a parent package-lock.json)
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;