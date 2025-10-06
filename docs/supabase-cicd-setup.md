# Supabase CI/CD セットアップガイド

このプロジェクトでは、Vercelデプロイ時に自動的にSupabaseマイグレーション（RLS、関数、トリガー）を実行します。

## 概要

### マイグレーション戦略

- **Prisma**: テーブルスキーマ（users テーブルなど）
- **Supabase**: RLSポリシー、関数、トリガー、ビュー

### デプロイフロー

```
Vercel Build開始
  ↓
1. prisma generate
  ↓
2. scripts/deploy-migrations.sh 実行
  ├─ Supabaseプロジェクトにリンク
  ├─ Prismaマイグレーション実行
  └─ Supabaseマイグレーション実行（RLS/関数）
  ↓
3. next build
  ↓
デプロイ完了
```

## Vercel環境変数の設定

### 1. Supabase Access Tokenの取得

1. [Supabase Dashboard](https://app.supabase.com) にアクセス
2. Account Settings > Access Tokens に移動
3. "Generate New Token" をクリック
4. トークンをコピー

### 2. Supabase Project IDの取得

1. Supabaseプロジェクトを開く
2. Settings > General に移動
3. "Reference ID" をコピー（例: `abcdefghijklmnop`）

### 3. Database Passwordの取得

1. Supabaseプロジェクトを開く
2. Settings > Database に移動
3. Database Passwordを確認（プロジェクト作成時に設定したパスワード）

### 4. Vercelに環境変数を設定

Vercel Dashboard > Project > Settings > Environment Variables で以下を設定：

#### 必須環境変数（本番・プレビュー環境）

| 変数名                          | 値                             | 環境                             |
| ------------------------------- | ------------------------------ | -------------------------------- |
| `SUPABASE_ACCESS_TOKEN`         | Supabaseアクセストークン       | Production, Preview              |
| `SUPABASE_PROJECT_ID`           | SupabaseプロジェクトID         | Production, Preview              |
| `SUPABASE_DB_PASSWORD`          | データベースパスワード         | Production, Preview              |
| `DATABASE_URL`                  | PostgreSQL接続文字列（Pooled） | Production, Preview              |
| `DIRECT_URL`                    | PostgreSQL接続文字列（Direct） | Production, Preview              |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase API URL               | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key              | Production, Preview, Development |

#### DATABASE_URLの取得方法

1. Supabaseプロジェクト > Settings > Database
2. "Connection string" セクションで "URI" を選択
3. **Pooled connection** をコピー → `DATABASE_URL`
4. **Direct connection** をコピー → `DIRECT_URL`

例：

```bash
# Pooled (DATABASE_URL)
postgresql://postgres.abcdefghijklmnop:[YOUR-PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres

# Direct (DIRECT_URL)
postgresql://postgres.abcdefghijklmnop:[YOUR-PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres
```

**重要**: `[YOUR-PASSWORD]` を実際のデータベースパスワードに置き換えてください。

### 5. 環境変数設定のスクリーンショット

Vercelでの設定例：

```
Environment Variables
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUPABASE_ACCESS_TOKEN     sbp_xxxxx...    Production, Preview
SUPABASE_PROJECT_ID       abcdefgh...     Production, Preview
SUPABASE_DB_PASSWORD      your-pass...    Production, Preview
DATABASE_URL              postgresql...   Production, Preview
DIRECT_URL                postgresql...   Production, Preview
NEXT_PUBLIC_SUPABASE_URL  https://...     Production, Preview, Development
NEXT_PUBLIC_SUPABASE_ANON_KEY  eyJhbG...  Production, Preview, Development
```

## Supabaseマイグレーションの作成

### 新しいマイグレーションの作成

```bash
# マイグレーションファイルを作成
npm run supabase:migration:new add_new_rls_policy

# 生成されたファイルを編集
# supabase/migrations/YYYYMMDDHHMMSS_add_new_rls_policy.sql
```

### マイグレーション例

```sql
-- Enable RLS on posts table
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read all posts
CREATE POLICY "Anyone can read posts"
ON posts
FOR SELECT
USING (true);

-- Policy: Users can create their own posts
CREATE POLICY "Users can create own posts"
ON posts
FOR INSERT
WITH CHECK (auth.uid()::text = user_id::text);
```

### ローカルでのテスト

```bash
# ローカルSupabaseを起動
npm run supabase:start

# マイグレーションを適用
npm run supabase:migration:up

# 確認
npm run supabase:status
```

## トラブルシューティング

### ビルドエラー: "SUPABASE_ACCESS_TOKEN is not set"

→ Vercel環境変数が正しく設定されているか確認してください。

### マイグレーションエラー: "password authentication failed"

→ `SUPABASE_DB_PASSWORD` が正しいか確認してください。

### リンクエラー: "Project not found"

→ `SUPABASE_PROJECT_ID` が正しいか確認してください（Reference ID）。

### マイグレーションが重複実行される

→ スクリプトは既に実行済みのマイグレーションをスキップします。問題ありません。

## ローカル開発環境

ローカル開発では、Vercel環境変数は不要です：

```bash
# ローカルSupabaseを起動
npx supabase start

# 開発サーバー起動
npm run dev
```

`.env`ファイルはローカルSupabaseの設定のみでOKです。

## CI/CD フロー全体

### GitHub Actions (CI)

Pull Request作成時：

1. ローカルSupabaseを起動
2. Prismaマイグレーション実行
3. Supabaseマイグレーション実行
4. テスト実行
5. ビルド検証

### Vercel (CD)

デプロイ時：

1. `npm run build` 実行
2. `scripts/deploy-migrations.sh` で本番DBにマイグレーション適用
3. Next.jsビルド
4. デプロイ

## 参考リンク

- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli)
- [Supabase Migrations](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
