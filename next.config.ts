import type { NextConfig } from "next";

// Cleanup any invalid global localStorage pollution from the environment
if (typeof globalThis !== 'undefined' && 'localStorage' in globalThis) {
  try {
    const ls = (globalThis as any).localStorage;
    if (!ls || typeof ls.getItem !== 'function') {
      delete (globalThis as any).localStorage;
    }
  } catch (e) {}
}
if (typeof global !== 'undefined' && 'localStorage' in global) {
  try {
    const ls = (global as any).localStorage;
    if (!ls || typeof ls.getItem !== 'function') {
      delete (global as any).localStorage;
    }
  } catch (e) {}
}

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;