# Next.js + Supabase + Vercel App Skeleton

フォークしてすぐに開発開始できる、フルスタックWebアプリケーションのスケルトンプロジェクトです。

## 🚀 特徴

- **Next.js 15** - App Router、Server Components、TypeScript
- **Supabase** - データベース、認証、リアルタイム機能
- **Vercel** - 本番環境へのワンクリックデプロイ
- **Tailwind CSS** - レスポンシブなUIデザイン
- **Zustand** - 軽量な状態管理
- **Jest** - テスト環境
- **ESLint + Prettier + Husky** - コード品質管理

## 🛠 技術スタック

| カテゴリ       | 技術                         |
| -------------- | ---------------------------- |
| フレームワーク | Next.js 15 (App Router)      |
| データベース   | Supabase PostgreSQL          |
| 認証           | Supabase Auth                |
| UI             | Tailwind CSS                 |
| 状態管理       | Zustand                      |
| テスト         | Jest + React Testing Library |
| デプロイ       | Vercel                       |
| 言語           | TypeScript                   |

## 🚀 クイックスタート

### 1. プロジェクトをフォーク

このリポジトリをフォークするか、テンプレートとして使用してください。

### 2. Node.js環境のセットアップ

プロジェクトでは `.tool-versions` ファイルでNode.jsバージョンを管理しています。

**asdf使用の場合（推奨）:**

```bash
asdf install nodejs
```

**その他のバージョン管理ツール:**

- nvm: `nvm use 18`
- 直接インストール: Node.js 18.x以上

### 3. 依存関係のインストール

```bash
npm install
```

### 4. データベース環境の選択

#### A. Supabaseクラウド（本番推奨）

1. [Supabase](https://supabase.com)でプロジェクトを作成
2. 環境変数を設定：

```bash
cp .env.example .env.local
```

`.env.local` ファイルを編集：

```bash
# Supabaseクラウド設定
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### B. ローカル開発環境（開発推奨）

```bash
# Supabase CLIをインストール
npm install -g supabase

# Dockerが必要
docker --version

# ローカル環境を起動
supabase init
supabase start
```

ローカル環境の場合の`.env.local`：

```bash
# Supabaseローカル設定
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 基本設定
NEXTAUTH_SECRET=development-secret-key-32-chars-minimum
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
```

> 💡 **推奨**: 開発時はローカル環境、本番はクラウドを使用

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認してください。

#### ローカルSupabase管理画面

ローカル環境を選択した場合、以下のURLで管理画面にアクセスできます：

- **Supabase Studio**: http://localhost:54323
- **Database**: http://localhost:54322
- **API Docs**: http://localhost:54321

## 📁 プロジェクト構成

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── globals.css        # グローバルスタイル
│   ├── layout.tsx         # ルートレイアウト
│   └── page.tsx           # ホームページ
├── components/            # Reactコンポーネント
│   ├── ui/               # 再利用可能なUIコンポーネント
│   └── *.tsx             # ページ固有のコンポーネント
├── hooks/                # カスタムReactフック
├── lib/                  # ユーティリティ・設定
│   ├── supabase.ts       # Supabaseクライアント
│   ├── env.ts            # 環境変数の型定義
│   └── utils.ts          # 汎用ユーティリティ
├── store/                # Zustand状態管理
├── types/                # TypeScript型定義
└── utils/                # API関連ユーティリティ
```

## 🔧 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm run start

# テスト実行
npm test
npm run test:watch
npm run test:coverage

# コード品質チェック
npm run lint
npm run format:check
npm run format
```

## 🗄️ データベースセットアップ

### クラウド環境（本番用）

1. [Supabase](https://supabase.com)でプロジェクトを作成
2. データベースのURLとAPIキーを取得
3. `.env.local`に設定を追加

### ローカル環境（開発用）

```bash
# 依存関係のインストール
npm install -g supabase

# 初期化と起動
supabase init
supabase start

# テーブル作成（オプション）
supabase db reset
```

詳細は [docs/setup.md](./docs/setup.md) を参照してください。

## 🚢 Vercelデプロイ

### 自動デプロイ（推奨）

1. GitHubリポジトリをVercelに接続
2. 環境変数を設定
3. 自動的にデプロイが開始されます

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### 環境変数設定

Vercelダッシュボードで以下の環境変数を設定：

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXTAUTH_SECRET
```

## 📚 ドキュメント

- [セットアップガイド](./docs/setup.md) - 詳細なセットアップ手順
- [開発ガイド](./docs/development.md) - 開発の進め方
- [コンポーネントガイド](./docs/components.md) - UIコンポーネントの使用方法
- [API仕様](./docs/api.md) - APIエンドポイントの詳細
- [状態管理ガイド](./docs/state-management.md) - Zustandストアの使い方
- [デプロイガイド](./docs/deployment.md) - 本番環境へのデプロイ方法

## 🤝 貢献

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチをプッシュ (`git push origin feature/amazing-feature`)
5. Pull Requestを作成

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 🆘 サポート

問題や質問がある場合は、[Issues](https://github.com/kudo-sho/nextjs-app-skeleton/issues)を作成してください。
