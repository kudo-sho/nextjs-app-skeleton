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
# データベース接続（実際の値に変更）
DATABASE_URL=postgresql://user:password@localhost:5432/your_database

# 認証設定
NEXTAUTH_SECRET=your-production-secret-key
NEXTAUTH_URL=http://localhost:3000

# 機能フラグ
ENABLE_ANALYTICS=false
ENABLE_LOGGING=true
```

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

### データベース設定

実際のデータベースを使用する場合：

1. **PostgreSQL**の場合：

```bash
# データベースの作成
createdb nextjs_app_skeleton

# 環境変数の更新
DATABASE_URL=postgresql://username:password@localhost:5432/nextjs_app_skeleton
```

2. **Prisma**（ORM）を追加する場合：

```bash
npm install prisma @prisma/client
npx prisma init
```

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
