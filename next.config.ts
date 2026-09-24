import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@andresaya/edge-tts", "ws"],
};

export default nextConfig;
