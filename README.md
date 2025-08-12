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
- **GitHub Actions** - CI/CDパイプライン（テスト・ビルド検証）

## 🛠 技術スタック

| カテゴリ       | 技術                         |
| -------------- | ---------------------------- |
| フレームワーク | Next.js 15 (App Router)      |
| データベース   | Supabase PostgreSQL          |
| ORM            | Prisma                       |
| 認証           | Supabase Auth                |
| UI             | Tailwind CSS                 |
| 状態管理       | Zustand                      |
| テスト         | Jest + React Testing Library |
| CI/CD          | GitHub Actions               |
| デプロイ       | Vercel                       |
| 言語           | TypeScript                   |

## 🚀 クイックスタート

### 最速セットアップ（3分で完了）

```bash
# 1. プロジェクトの取得
git clone <repository-url>
cd nextjs-app-skeleton

# 2. 依存関係のインストール
npm install

# 3. 環境変数ファイルのセットアップ
cp .env.example .env

# 4. Supabaseローカル環境の起動
npx supabase start

# 5. Prismaクライアントの生成
npm run db:generate

# 6. データベースの初期化（テーブル作成 + マイグレーション）
npm run db:migrate

# 7. サンプルデータの投入
npm run db:seed

# 8. 開発サーバーの起動
npm run dev
```

**🎉 完了！** [http://localhost:3000](http://localhost:3000) でアプリケーションが動作します。

---

## 🔧 詳細セットアップ

### 1. プロジェクトの取得

```bash
# 既存プロジェクトをクローン
git clone <repository-url>
cd nextjs-app-skeleton

# またはテンプレートとして使用
npx degit <repository-url> my-new-project
cd my-new-project
```

### 2. Node.js環境のセットアップ

プロジェクトでは `.tool-versions` ファイルでNode.jsバージョンを管理しています。

**asdf使用の場合（推奨）:**

```bash
asdf install nodejs
```

**その他のバージョン管理ツール:**

- nvm: `nvm use 20`
- 直接インストール: Node.js 20.x以上

### 3. 依存関係のインストール

```bash
npm install
```

### 4. Supabaseセットアップ

**A. ローカル開発環境（推奨・簡単）**

Docker が必要です：

```bash
# Supabaseローカル環境の起動
npx supabase start

# Prismaクライアント生成
npm run db:generate

# データベースの初期化（マイグレーション適用）
npm run db:migrate

# サンプルデータの投入
npm run db:seed
```

環境変数は`.env.example`をコピーして作成した`.env`ファイルに設定済みなので、そのまま開発を開始できます。

**B. Supabaseクラウド（本番用）**

1. [Supabase](https://supabase.com)でプロジェクトを作成
2. `.env`ファイルを編集：

```bash
# Supabaseクラウド設定に変更
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=your-postgres-connection-string
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認してください。

### 🔗 アクセス情報

開発環境で利用できるURL：

- **アプリケーション**: http://localhost:3000
- **Supabase Studio**: http://localhost:54323 （データベース管理画面）
- **Supabase API**: http://localhost:54321 （REST API）
- **PostgreSQL**: localhost:54322 （直接DB接続）

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
│   ├── supabase.ts       # Supabaseクライアント（Auth・リアルタイム用）
│   ├── prisma.ts         # Prismaクライアント（CRUD用）
│   ├── env.ts            # 環境変数の型定義
│   └── utils.ts          # 汎用ユーティリティ
├── store/                # Zustand状態管理
├── types/                # TypeScript型定義
└── utils/                # API関連ユーティリティ
prisma/
├── schema.prisma         # データベーススキーマ定義
├── migrations/           # マイグレーションファイル
└── seed.ts              # シードデータ
```

## 🔧 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド（データベースマイグレーション含む）
npm run build

# 開発用ビルド（マイグレーション無し）
npm run build:dev

# 本番サーバー起動
npm run start

# データベース関連
npm run db:generate    # Prismaクライアント生成
npm run db:push        # スキーマをデータベースに適用
npm run db:migrate     # マイグレーション作成・適用
npm run db:seed        # サンプルデータ投入
npm run db:studio      # Prisma Studio起動

# テスト実行
npm test
npm run test:watch
npm run test:coverage

# コード品質チェック
npm run lint
npm run format:check
npm run format
```

## 🗄️ データベース管理

### スキーマ管理（Prisma）

```bash
# スキーマ変更後の手順
1. prisma/schema.prisma を編集
2. npm run db:migrate     # 本番用マイグレーション作成
```

### クラウド環境（本番用）

1. [Supabase](https://supabase.com)でプロジェクトを作成
2. データベースのURLとAPIキーを取得
3. `.env`に設定を追加
4. `npm run db:migrate` でマイグレーションを適用

### ローカル環境（開発用）

```bash
# Supabaseローカル環境起動
npx supabase start

# Prismaセットアップ
npm run db:generate    # クライアント生成
npm run db:migrate     # マイグレーション適用
npm run db:seed        # データ投入
```

詳細は [docs/setup.md](./docs/setup.md) を参照してください。

## 🔄 CI/CD

### GitHub Actions

Pull Request作成時に以下が自動実行されます：

- 依存関係のインストール
- Prismaクライアント生成
- ESLintによるコードチェック
- Jestによるテスト実行
- Next.jsビルド検証

ワークフローファイル: `.github/workflows/deploy-preview.yml`

## 🚢 Vercelデプロイ

### 自動デプロイ（推奨）

1. GitHubリポジトリをVercelに接続
2. 環境変数を設定
3. Pull Requestごとにプレビュー環境が自動デプロイ
4. mainブランチへのマージで本番環境が自動デプロイ

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### 環境変数設定

Vercelダッシュボードで以下の環境変数を設定：

**必須環境変数:**

```
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# データベース
DATABASE_URL=your-postgres-connection-string
DIRECT_URL=your-postgres-direct-connection-string

# アプリケーション設定
NODE_ENV=production
```

**注意:**

- `DIRECT_URL`はPrismaマイグレーションで使用
- 本番環境では`DATABASE_URL`と`DIRECT_URL`を分けることを推奨

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
