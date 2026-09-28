import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    agentFeedback: true,
    // Lets `@next/playwright`'s `instant()` run against `next start` when set (never in real deploys).
    exposeTestingApiInProductionBuild: process.env.NEXT_TESTING_API === '1',
    inlineCss: true,
    useOffline: true,
  },
  partialPrefetching: true,
  reactCompiler: true,
  redirects: async () => [{ destination: '/inbox', permanent: false, source: '/' }],
  typedRoutes: true,
};

export default nextConfig;
