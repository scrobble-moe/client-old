import withTM from "next-transpile-modules";

const transpile = withTM(["@simplewebauthn/browser"]);

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    domains: ["plex.tv", "devicons.railway.app", "s4.anilist.co"],
  },
  swcMinify: true,
  reactStrictMode: true,
  experimental: {
    concurrentFeatures: true,
    serverComponents: true,
    reactRoot: true,
    runtime: "nodejs"
  },
};

export default transpile(nextConfig);
