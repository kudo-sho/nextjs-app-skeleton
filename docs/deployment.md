# デプロイメントガイド - 完全自動化CI/CD

このガイドでは、Next.js + Supabase + VercelによるCI/CDパイプラインの構築手順を説明します。

## 🚀 CI/CDフロー概要

### **完全自動化されたワークフロー**

```mermaid
graph TD
    A[PR作成] --> B[GitHub Actions: テスト]
    A --> C[Vercel: 自動デプロイ]

    B --> B1[✓ ESLint]
    B1 --> B2[✓ Jest テスト]
    B2 --> B3[✓ ビルド確認]

    C --> C1[✓ Prismaクライアント生成]
    C1 --> C2[✓ データベースマイグレーション]
    C2 --> C3[✓ Next.jsビルド]
    C3 --> C4[🚀 プレビューURL生成]

    B3 --> D[✅ 品質チェック完了]
    C4 --> E[✅ プレビュー環境完成]
```

### **実行時間**

- **テスト・品質チェック**: 1-2分
- **プレビューデプロイ**: 30秒-1分（初回は2-3分）
- **本番デプロイ**: 30秒-1分

## 📋 必要な準備

### **1. Supabaseプロジェクト作成**

#### **プレビュー環境用**

```bash
# 1. https://supabase.com でプロジェクト作成
# 2. プロジェクト名: your-app-preview
# 3. パスワード: 強力なものを設定
# 4. リージョン: Asia Northeast (Tokyo) 推奨
```

#### **本番環境用**

```bash
# 1. 同様にもう1つプロジェクト作成
# 2. プロジェクト名: your-app-production
# 3. 同じパスワードを推奨（管理簡単）
# 4. 同じリージョンを選択
```

### **2. 接続情報の取得**

各プロジェクトで以下を取得：

```bash
# Supabase Dashboard > Settings > Database > Connection string

# Session pooling (必須)
postgresql://postgres.PROJECT_ID:PASSWORD@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true

# Direct connection (必須)
postgresql://postgres.PROJECT_ID:PASSWORD@aws-0-region.pooler.supabase.com:5432/postgres
```

**重要**: 必ず **Session** を選択して **pooler.supabase.com** を使用

### **3. API キーの取得**

```bash
# Supabase Dashboard > Settings > API

NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## ⚙️ Vercel設定

### **1. GitHubリポジトリ連携**

```bash
# 1. https://vercel.com/dashboard
# 2. "Add New..." → "Project"
# 3. GitHubリポジトリをImport
# 4. Framework Preset: Next.js
# 5. "Deploy" をクリック
```

### **2. 環境変数設定**

**Vercel Dashboard > Settings > Environment Variables**

#### **Preview環境**

```bash
# Supabase（プレビューproject用）
NEXT_PUBLIC_SUPABASE_URL=https://preview-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=preview-anon-key
SUPABASE_SERVICE_ROLE_KEY=preview-service-role-key

# データベース（Prisma用）
DATABASE_URL=postgresql://postgres.preview-id:password@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.preview-id:password@aws-0-region.pooler.supabase.com:5432/postgres

# 認証
NEXTAUTH_SECRET=preview-secret-32-chars-minimum
NEXTAUTH_URL=https://your-app-git-branch.vercel.app

# Environment: Preview を選択
```

#### **Production環境**

```bash
# Supabase（本番project用）
NEXT_PUBLIC_SUPABASE_URL=https://production-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=production-anon-key
SUPABASE_SERVICE_ROLE_KEY=production-service-role-key

# データベース（Prisma用）
DATABASE_URL=postgresql://postgres.production-id:password@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.production-id:password@aws-0-region.pooler.supabase.com:5432/postgres

# 認証
NEXTAUTH_SECRET=production-secret-32-chars-minimum
NEXTAUTH_URL=https://your-app.vercel.app

# Environment: Production を選択
```

## 🔄 開発ワークフロー

### **日常的な開発フロー**

```bash
# 1. 新機能開発
git checkout -b feature/new-feature
# コード変更
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature

# 2. PR作成 → 自動実行
# ✅ GitHub Actions: テスト・品質チェック
# ✅ Vercel: プレビュー環境デプロイ + マイグレーション

# 3. プレビュー環境で動作確認
# 生成されたプレビューURLで確認

# 4. レビュー → マージ
# ✅ 本番環境に自動デプロイ
```

### **初回セットアップ（ローカル）**

```bash
# 1. 環境変数設定
cp .env.example .env.local
# .env.localに実際の値を設定

# 2. ローカルSupabase起動
npx supabase start

# 3. データベースセットアップ
npm run db:generate
npm run db:migrate

# 4. 開発開始
npm run dev
```

## 🛠️ 自動化されている処理

### **GitHub Actions（品質チェック）**

- ✅ ESLint（コード品質）
- ✅ Jest テスト実行
- ✅ TypeScript型チェック
- ✅ ビルド成功確認

### **Vercel（デプロイ + DB更新）**

- ✅ 依存関係インストール
- ✅ Prismaクライアント生成
- ✅ **データベースマイグレーション自動実行**
- ✅ Next.jsアプリケーションビルド
- ✅ プレビューURL生成

### **データベースマイグレーション**

```bash
# 自動実行される処理
prisma generate          # クライアント生成
prisma migrate deploy    # マイグレーション適用（DIRECT_URL使用）
next build               # アプリケーションビルド（DATABASE_URL使用）
```

## 🔧 トラブルシューティング

### **マイグレーション失敗**

```bash
# 原因: 接続文字列の形式間違い
❌ db.xxx.supabase.co:5432
✅ aws-0-region.pooler.supabase.com:5432

# 確認方法
# Vercel Dashboard > Functions > Build Logs でエラー確認
```

### **環境変数が反映されない**

```bash
# 原因: 設定後に再デプロイが必要
# 解決: Vercel Dashboard > Deployments > Redeploy
```

### **プレビューが遅い**

```bash
# 原因: 初回デプロイ時の初期化処理
# 解決: 2回目以降は高速化される
```

## 📊 パフォーマンス

### **デプロイ時間の改善**

- **Before**: 環境変数複雑化で5分+
- **After**: 適切な設定で30秒-1分

### **環境変数管理**

- **Before**: 12個の複雑な変数
- **After**: 8個のシンプルな変数

### **マイグレーション**

- **Connection Pooling**: 適切な接続方式
- **Direct URL**: マイグレーション専用接続
- **自動化**: 手動作業不要

## 🔐 セキュリティ

### **環境変数管理**

- ✅ Vercel Environment Variables使用
- ✅ 環境別に適切に分離
- ✅ Service Role Keyの適切な管理

### **データベースセキュリティ**

- ✅ Row Level Security (RLS) 設定可能
- ✅ 環境別データベース分離
- ✅ 適切な接続権限

## 🎯 次のステップ

1. **監視の追加**: Vercel Analytics, Supabase Insights
2. **E2Eテスト**: Playwright等の導入
3. **型安全性**: Supabase Database Types生成
4. **カスタムドメイン**: 本番環境用ドメイン設定

---

**これで完全自動化されたCI/CDパイプラインが完成しました！** 🎉

プルリクエスト作成から本番デプロイまで、すべて自動化されています。
