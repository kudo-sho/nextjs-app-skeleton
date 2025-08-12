# セットアップガイド

NextJS App Skeletonプロジェクトのセットアップ手順を詳しく説明します。

## 前提条件

以下のソフトウェアがインストールされている必要があります：

- **Node.js** 20.x以上
- **npm** 9.x以上（またはyarn, pnpm）
- **Git** 2.x以上
- **Docker** （Supabaseローカル開発用）

### Node.jsバージョン管理（推奨）

プロジェクトでは `.tool-versions` ファイルを使用してNode.jsバージョンを管理しています。asdfを使用することを推奨します：

#### asdfのインストール

**macOS (Homebrew):**

```bash
brew install asdf
```

**Ubuntu/DebianもしくはWindows(WSL2):**

```bash
git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.13.1
echo '. "$HOME/.asdf/asdf.sh"' >> ~/.bashrc
echo '. "$HOME/.asdf/completions/asdf.bash"' >> ~/.bashrc
source ~/.bashrc
```

#### Node.js プラグインとバージョンのインストール

```bash
# Node.js プラグインを追加
asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git

# プロジェクト指定バージョンをインストール
asdf install nodejs

# バージョンを確認
node --version
```

プロジェクトディレクトリに入ると、`.tool-versions` ファイルにより自動的に正しいNode.jsバージョンが適用されます。

## クイックスタート（推奨）

### 1. プロジェクトのクローンまたは作成

```bash
# 既存プロジェクトをクローンする場合
git clone <repository-url>
cd nextjs-app-skeleton

# テンプレートとして使用する場合
npx degit <repository-url> my-new-project
cd my-new-project
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. Supabaseのセットアップ

```bash
# Supabase CLIのインストール（未インストールの場合）
npm install -g @supabase/supabase-js supabase

# Supabaseローカル環境の起動
npx supabase start

# Prismaクライアントを生成
npm run db:generate

# データベースの初期化（スキーマ適用）
npm run db:migrate

# サンプルデータの投入
npm run db:seed
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセス！

**🎉 これだけで開発環境の準備が完了です！**

---

## 詳細セットアップ

## 含まれる機能

このスケルトンには以下の機能が設定済みです：

**✅ フロントエンド：**

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- 響応式UI コンポーネント
- ダークモード対応

**✅ バックエンド：**

- Supabase (PostgreSQL + Auth + Realtime)
- API Routes
- 型安全なデータアクセス

**✅ 開発体験：**

- ESLint + Prettier
- Husky + lint-staged
- Jest + Testing Library
- Hot reload開発環境

**✅ デプロイ：**

- Vercel対応設定
- 環境変数管理
- 本番ビルド最適化

### インストールされる主要な依存関係

**本番依存関係：**

- `next` - Next.jsフレームワーク
- `react` & `react-dom` - Reactライブラリ
- `@supabase/supabase-js` - Supabaseクライアント
- `zustand` - 状態管理
- `clsx` & `tailwind-merge` - CSSクラス管理

**開発依存関係：**

- `typescript` - TypeScript
- `eslint` & `eslint-config-next` - リンティング
- `prettier` - コードフォーマッター
- `husky` & `lint-staged` - Gitフック
- `jest` & `@testing-library/react` - テスト

## Supabaseローカル開発環境

このプロジェクトはSupabaseローカル環境を使用するため、本番のSupabaseプロジェクトなしでも開発を開始できます。

### 環境変数について

**重要**: Prismaが動作するためには`.env`ファイルが必要です。`.env.local`ではPrismaが環境変数を読み込めません。

`.env`ファイルには既にローカル開発用の設定が含まれています：

```bash
# Supabase Local Development (事前設定済み)
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# その他の設定
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
NODE_ENV=development
ENABLE_ANALYTICS=false
ENABLE_LOGGING=true
```

**注意:** 本番環境では、必ず新しいSupabaseプロジェクトを作成し、適切なAPIキーに置き換えてください。

#### Supabaseプロジェクトの作成

1. [Supabase Console](https://supabase.com/dashboard) にアクセス
2. "New Project" をクリック
3. Organization、Project name、Database passwordを設定
4. Regionを選択（日本の場合は "Asia Pacific (Tokyo)"）
5. プロジェクトが作成されるまで待機（約2分）

#### SupabaseのAPIキー取得

1. 作成したプロジェクトの Dashboard を開く
2. 左サイドバーの "Settings" → "API" をクリック
3. 以下の値をコピーして `.env` に設定：
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

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

#### データベーススキーマ管理

このプロジェクトではPrismaを使用してデータベーススキーマを管理します。
テーブル作成やスキーマ変更は `prisma/schema.prisma` ファイルで行い、マイグレーションで適用します。

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

### 外部サービス連携

必要に応じて以下のAPIキーを設定：

```bash
# .envに追加
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

# asdfを使用している場合（推奨）
asdf install nodejs

# nvmを使用している場合
nvm use 20
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
- [デプロイメントガイド](./deployment.md) - CI/CDとVercelデプロイの詳細設定
- [コンポーネントガイド](./components.md) - UIコンポーネントの使用方法
- [API仕様](./api.md) - APIエンドポイントの詳細
- [状態管理ガイド](./state-management.md) - Zustandストアの使い方
