# デプロイメントガイド - Vercel + Supabase

このガイドでは、NextJS App SkeletonをVercel（フロントエンド）とSupabase（バックエンド）にデプロイする手順を説明します。

## 概要

### アーキテクチャ

```
Frontend (Vercel)    Backend (Supabase)
├── Next.js App      ├── PostgreSQL Database
├── Static Assets    ├── Authentication
├── API Routes       ├── Real-time Subscriptions
├── Edge Functions   ├── Storage
└── Analytics        └── Edge Functions
```

### 料金プラン

**Vercel:**

- Hobby: 無料（個人プロジェクト向け）
- Pro: $20/月（商用利用推奨）

**Supabase:**

- Free: 無料（500MB Database + 1GB Storage）
- Pro: $25/月（8GB Database + 100GB Storage）

## Supabaseセットアップ

### 1. Supabaseプロジェクト作成

```bash
# 1. https://supabase.com にアクセス
# 2. "New Project" をクリック
# 3. Organization を選択
# 4. プロジェクト名とパスワードを設定
# 5. リージョンを選択（Asia Northeast (Tokyo)推奨）
```

### 2. 環境変数の取得

Supabaseダッシュボードの「Settings > API」から以下を取得：

```bash
# Project URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Public anon key
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Service role key (サーバーサイド専用)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. データベーススキーマ設定

```sql
-- Users テーブル作成
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) を有効化
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ポリシー設定（ユーザーは自分のデータのみアクセス可能）
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- 更新日時の自動更新
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 4. 認証設定

Supabaseダッシュボードの「Authentication > Settings」で：

```bash
# Site URL (本番環境)
https://your-app.vercel.app

# Redirect URLs
https://your-app.vercel.app/auth/callback
http://localhost:3000/auth/callback

# Email Templates のカスタマイズ
# Social Auth Providers の設定（Google, GitHub等）
```

## Vercelセットアップ

### 1. GitHubリポジトリ連携

```bash
# 1. コードをGitHubにプッシュ
git add .
git commit -m "Add Vercel + Supabase configuration"
git push origin main

# 2. https://vercel.com にアクセス
# 3. "Import Project" をクリック
# 4. GitHubリポジトリを選択
```

### 2. 環境変数設定

Vercelダッシュボードの「Settings > Environment Variables」で設定：

```bash
# Production環境
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
NEXTAUTH_SECRET=your-production-secret-32-chars-min
NEXTAUTH_URL=https://your-app.vercel.app
ENABLE_ANALYTICS=true
ENABLE_LOGGING=true

# Preview環境（オプション）
NEXT_PUBLIC_SUPABASE_URL=https://staging-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=staging-anon-key...
```

### 3. ドメイン設定

```bash
# 1. Vercelダッシュボードの "Domains" タブ
# 2. カスタムドメインを追加
# 3. DNS設定でCNAMEレコードを追加
# 4. SSL証明書の自動発行を確認
```

## CI/CD設定

### 1. GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
```

### 2. Vercel自動デプロイ

```json
// vercel.json に追加設定
{
  "env": {
    "CUSTOM_BUILD_ENV": "production"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key"
    }
  }
}
```

## 監視とログ

### 1. Vercel Analytics

```typescript
// src/app/layout.tsx に追加
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 2. Supabase監視

```typescript
// src/lib/monitoring.ts
import { supabase } from './supabase';

export const logEvent = async (
  event: string,
  properties?: Record<string, any>
) => {
  if (process.env.NODE_ENV === 'production') {
    try {
      await supabase.from('analytics_events').insert({
        event,
        properties,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to log event:', error);
    }
  }
};
```

### 3. エラートラッキング

```bash
# Sentryの設定（オプション）
npm install @sentry/nextjs

# next.config.js に追加
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(nextConfig, {
  silent: true,
  org: "your-org",
  project: "your-project",
});
```

## パフォーマンス最適化

### 1. Edge Functions活用

```typescript
// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Geo-location based redirects
  const country = request.geo?.country || 'US';

  if (request.nextUrl.pathname === '/api/health') {
    return NextResponse.json({
      status: 'ok',
      region: process.env.VERCEL_REGION,
      country,
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
```

### 2. ISR（Incremental Static Regeneration）

```typescript
// src/app/blog/[slug]/page.tsx
export const revalidate = 3600; // 1時間ごとに再生成

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  return <Article post={post} />;
}
```

### 3. CDN最適化

```typescript
// next.config.js
module.exports = {
  images: {
    domains: ['your-project-id.supabase.co'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizeCss: true,
  },
};
```

## セキュリティ設定

### 1. CSP（Content Security Policy）

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel.app;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: *.supabase.co;
      connect-src 'self' *.supabase.co wss://*.supabase.co;
    `
      .replace(/\s{2,}/g, ' ')
      .trim(),
  },
];

module.exports = {
  headers: async () => [
    {
      source: '/(.*)',
      headers: securityHeaders,
    },
  ],
};
```

### 2. 環境変数の保護

```bash
# 本番環境でのみ設定
SUPABASE_SERVICE_ROLE_KEY=secret-key  # Server-side only
NEXTAUTH_SECRET=production-secret     # Server-side only

# クライアント側で利用可能（NEXT_PUBLIC_プレフィックス）
NEXT_PUBLIC_SUPABASE_URL=https://...  # Client-side OK
NEXT_PUBLIC_SUPABASE_ANON_KEY=...     # Client-side OK
```

## トラブルシューティング

### よくある問題

**1. ビルドエラー**

```bash
# 型エラーの確認
npm run type-check

# 依存関係の確認
npm audit
npm audit fix
```

**2. Supabase接続エラー**

```bash
# 環境変数の確認
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# ネットワーク接続の確認
curl -I https://your-project-id.supabase.co
```

**3. Vercel デプロイエラー**

```bash
# ローカルでビルド確認
npm run build
npm run start

# Vercel CLI でデバッグ
npx vercel --debug
```

### パフォーマンス監視

```typescript
// src/lib/performance.ts
export const measurePerformance = (name: string, fn: () => Promise<any>) => {
  return async (...args: any[]) => {
    const start = performance.now();
    try {
      const result = await fn(...args);
      const duration = performance.now() - start;

      if (process.env.ENABLE_LOGGING) {
        console.log(`${name} completed in ${duration.toFixed(2)}ms`);
      }

      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`${name} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  };
};
```

## 関連ドキュメント

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [セットアップガイド](./setup.md)
- [開発ガイド](./development.md)
