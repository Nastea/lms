import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Caietul intensivului se citește din private/ de funcțiile care trimit emailul de plată.
  outputFileTracingIncludes: {
    '/api/paynet/**': ['./private/caiet-intensiv.pdf'],
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
