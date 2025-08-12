import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // React 18の厳格モードを有効化
  // 開発時のみ動作し、副作用や非推奨APIの使用を検出
  reactStrictMode: true,

  // 画像最適化の設定
  images: {
    // 外部画像を使用する場合のドメイン許可設定
    // セキュリティ対策として明示的に許可したドメインのみ使用可能
    remotePatterns: [
      // 例: 外部APIからの画像を使用する場合
      // {
      //   protocol: 'https',
      //   hostname: 'example.com',
      //   pathname: '/images/**',
      // }
    ],
  },

  // セキュリティヘッダーの設定
  async headers() {
    return [
      {
        // すべてのページに適用
        source: '/(.*)',
        headers: [
          {
            // iframe埋め込み防止（クリックジャッキング対策）
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            // MIMEタイプスニッフィング防止
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
