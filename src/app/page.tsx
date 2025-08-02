/**
 * アプリケーションのホームページ
 * NextJSアプリケーションスケルトンの機能を紹介し、
 * 実装されている機能のデモンストレーションを提供します
 */

import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";
import UsersList from "@/components/UsersList";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

/**
 * ホームページコンポーネント
 * 
 * 構成:
 * - ヘッダー: ロゴとテーマ切り替えボタン
 * - 機能紹介セクション: 実装済み機能の概要カード
 * - ユーザー一覧: APIとの連携デモ
 * 
 * @returns ホームページのJSX要素
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* ===== ヘッダー部分 ===== */}
      <header className="border-b">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          {/* ロゴ */}
          <Image
            className="dark:invert" // ダークモードで色反転
            src="/next.svg"
            alt="Next.js logo"
            width={120}
            height={25}
            priority // LCP最適化のため優先読み込み
          />
          
          {/* テーマ切り替えボタン */}
          <ThemeToggle />
        </div>
      </header>

      {/* ===== メインコンテンツ ===== */}
      <main className="container mx-auto py-8 px-6">
        {/* アプリケーション紹介セクション */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">NextJS App Skeleton</h1>
          <p className="text-muted-foreground text-lg">
            A complete NextJS application skeleton with TypeScript, Tailwind CSS, Testing, and more.
          </p>
        </div>

        {/* 機能紹介カードグリッド */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* 開発ツール */}
          <Card>
            <CardHeader>
              <CardTitle>🛠️ Development Tools</CardTitle>
              <CardDescription>
                Prettier, ESLint, Husky, lint-staged configured
              </CardDescription>
            </CardHeader>
          </Card>

          {/* テスト環境 */}
          <Card>
            <CardHeader>
              <CardTitle>🧪 Testing Ready</CardTitle>
              <CardDescription>
                Jest, Testing Library with sample tests
              </CardDescription>
            </CardHeader>
          </Card>

          {/* スタイリング */}
          <Card>
            <CardHeader>
              <CardTitle>🎨 Styled Components</CardTitle>
              <CardDescription>
                Tailwind CSS with custom design system
              </CardDescription>
            </CardHeader>
          </Card>

          {/* 状態管理 */}
          <Card>
            <CardHeader>
              <CardTitle>🔄 State Management</CardTitle>
              <CardDescription>
                Zustand stores for app and user state
              </CardDescription>
            </CardHeader>
          </Card>

          {/* API */}
          <Card>
            <CardHeader>
              <CardTitle>🌐 API Routes</CardTitle>
              <CardDescription>
                Sample REST API endpoints with proper typing
              </CardDescription>
            </CardHeader>
          </Card>

          {/* 環境設定 */}
          <Card>
            <CardHeader>
              <CardTitle>⚙️ Environment Config</CardTitle>
              <CardDescription>
                Environment variables and configuration setup
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* ユーザー一覧デモ（API連携の実例） */}
        <UsersList />
      </main>
    </div>
  );
}
