# セットアップガイド

NextJS App Skeletonプロジェクトのセットアップ手順を詳しく説明します。

## 前提条件

以下のソフトウェアがインストールされている必要があります：

- **Node.js** 18.x以上
- **npm** 9.x以上（またはyarn, pnpm）
- **Git** 2.x以上

## 初期セットアップ

### 1. プロジェクトのクローンまたは作成

```bash
# 新規プロジェクトの場合
npx create-next-app@latest nextjs-app-skeleton --typescript --tailwind --eslint --app

# 既存プロジェクトをクローンする場合
git clone <repository-url>
cd nextjs-app-skeleton
```

### 2. 依存関係のインストール

```bash
npm install
```

インストールされる主要な依存関係：

**本番依存関係：**

- `next` - Next.jsフレームワーク
- `react` & `react-dom` - Reactライブラリ
- `zustand` - 状態管理
- `clsx` & `tailwind-merge` - CSSクラス管理

**開発依存関係：**

- `typescript` - TypeScript
- `eslint` & `eslint-config-next` - リンティング
- `prettier` - コードフォーマッター
- `husky` & `lint-staged` - Gitフック
- `jest` & `@testing-library/react` - テスト

### 3. 環境変数の設定

```bash
# .env.localファイルを作成（既に存在する場合はスキップ）
cp .env.example .env.local
```

`.env.local`ファイルを編集して、必要な環境変数を設定：

```bash
# Supabase設定（必須）
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 認証設定
NEXTAUTH_SECRET=your-production-secret-key
NEXTAUTH_URL=http://localhost:3000

# 機能フラグ
ENABLE_ANALYTICS=false
ENABLE_LOGGING=true
```

#### Supabaseプロジェクトの作成

1. [Supabase Console](https://supabase.com/dashboard) にアクセス
2. "New Project" をクリック
3. Organization、Project name、Database passwordを設定
4. Regionを選択（日本の場合は "Asia Pacific (Tokyo)"）
5. プロジェクトが作成されるまで待機（約2分）

#### SupabaseのAPIキー取得

1. 作成したプロジェクトの Dashboard を開く
2. 左サイドバーの "Settings" → "API" をクリック
3. 以下の値をコピーして `.env.local` に設定：
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

### 4. Gitフックの初期化

```bash
# Huskyを初期化（package.jsonのprepareスクリプトで自動実行される）
npm run prepare
```

これにより以下が設定されます：

- **pre-commit**: コミット前にlint-stagedを実行
- **lint-staged**: ステージングされたファイルに対してESLintとPrettierを実行

## 開発環境の確認

### 1. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスして、アプリケーションが正常に表示されることを確認します。

### 2. テストの実行

```bash
# すべてのテストを実行
npm test

# ウォッチモードでテストを実行
npm run test:watch

# カバレッジレポートを生成
npm run test:coverage
```

### 3. リンティングとフォーマットの確認

```bash
# ESLintチェック
npm run lint

# Prettierフォーマットチェック
npm run format:check

# Prettierフォーマット実行
npm run format
```

### 4. ビルドの確認

```bash
# 本番ビルド
npm run build

# 本番サーバーの起動
npm run start
```

## IDE設定

### VS Code

推奨拡張機能：

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "ms-vscode.vscode-json"
  ]
}
```

設定ファイル（`.vscode/settings.json`）：

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## 追加設定

### Supabase データベース設定

#### 基本的なテーブル作成（例）

Supabase Dashboard の SQL Editor で以下のような基本テーブルを作成できます：

```sql
-- ユーザープロフィールテーブル
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) を有効化
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- プロフィールのポリシー設定
CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile."
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

#### Supabase Auth設定

1. Dashboard の "Authentication" → "Settings" を開く
2. "Site URL" に開発環境のURL (`http://localhost:3000`) を設定
3. "Redirect URLs" に本番環境のURL を追加
4. 必要に応じてOAuth providersを設定（Google、GitHub等）

#### 追加のデータベース機能

- **Realtime**: テーブルの変更をリアルタイムで監視
- **Storage**: ファイルアップロード機能
- **Edge Functions**: サーバーレス関数
- **Database Functions**: PostgreSQL関数

### 認証設定

NextAuth.jsを使用する場合：

```bash
npm install next-auth
```

### 外部サービス連携

必要に応じて以下のAPIキーを設定：

```bash
# .env.localに追加
OPENAI_API_KEY=your-openai-api-key
STRIPE_SECRET_KEY=your-stripe-secret-key
REDIS_URL=redis://localhost:6379
```

## トラブルシューティング

### よくある問題

1. **Node.jsバージョンエラー**

```bash
# Node.jsのバージョンを確認
node --version

# nvmを使用している場合
nvm use 18
```

2. **依存関係の競合**

```bash
# node_modulesを削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

3. **ESLintエラー**

```bash
# ESLintキャッシュをクリア
npx eslint --cache --cache-location ./node_modules/.cache/.eslintcache --fix .
```

4. **Tailwind CSSが効かない**

```bash
# Tailwindの設定を確認
npm run build

# 開発サーバーを再起動
npm run dev
```

### ログの確認

開発時のデバッグには以下を活用：

1. **ブラウザの開発者ツール**
2. **Next.jsの詳細ログ**

```bash
DEBUG=* npm run dev
```

3. **テストのデバッグ**

```bash
npm test -- --verbose
```

## 次のステップ

セットアップが完了したら、以下のドキュメントを参照してください：

- [開発ガイド](./development.md) - 開発の進め方
- [コンポーネントガイド](./components.md) - UIコンポーネントの使用方法
- [API仕様](./api.md) - APIエンドポイントの詳細
- [状態管理ガイド](./state-management.md) - Zustandストアの使い方
