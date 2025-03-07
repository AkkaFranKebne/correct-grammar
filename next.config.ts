/** @type {import('next').NextConfig} */
const nextConfig = {
  //@ts-expect-error temporary fix for the error
  webpack: (config, { isServer }) => {
    if (isServer) {
      require("./prisma");
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "a.storyblok.com",
        port: "",
        pathname: "/**",
        search: "",
      },
    ],
  },
};

module.exports = nextConfig;
