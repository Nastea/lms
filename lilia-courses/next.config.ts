import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Caietul intensivului se citește din private/ de funcțiile care trimit emailul de plată.
  outputFileTracingIncludes: {
    '/api/paynet/**': ['./private/caiet-intensiv.pdf'],
    '/api/admin/intensiv-reminder': ['./private/caiet-intensiv.pdf'],
    '/api/intensiv/**': ['./private/caiet-bonus.pdf'],
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
