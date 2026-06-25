/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_IMGBB_KEY: process.env.NEXT_PUBLIC_IMGBB_KEY,
  },
};

export default nextConfig;
