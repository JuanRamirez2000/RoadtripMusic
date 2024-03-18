/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  experimental: {
    //typedRoutes: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "i.scdn.co",
      },
    ],
  },
};
export default config;
