import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    agentFeedback: true,
    exposeTestingApiInProductionBuild: process.env.NEXT_TESTING_API === '1',
    inlineCss: true,
    useOffline: true,
  },
  partialPrefetching: true,
  reactCompiler: true,
  redirects: async () => [{ destination: '/inbox', permanent: false, source: '/' }],
  serverExternalPackages: ['better-sqlite3'],
  typedRoutes: true,
};

export default nextConfig;
