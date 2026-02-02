// Next.js Configuration - NO React Compiler
// This file explicitly does NOT enable reactCompiler

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only enable strict mode, no experimental features
  reactStrictMode: true,
};

export default nextConfig;
