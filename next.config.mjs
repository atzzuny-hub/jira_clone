/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // 경고: 프로덕션 환경에서 오류가 발생하더라도 빌드를 계속 진행합니다.
    // 이 설정은 *매우* 권장되지 않습니다.
    ignoreBuildErrors: true,
  },
  eslint: {
    // 경고: Next.js 빌드 시 ESLint 검사를 무시합니다.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fra.cloud.appwrite.io',
        port: '',
        pathname: '/v1/storage/buckets/**',
      },
    ],
  },
};

export default nextConfig; 