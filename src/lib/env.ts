/**
 * 環境変数を安全に管理するためのユーティリティ
 * 型安全性を確保し、必須の環境変数の不足を早期に検出します
 */

/**
 * 環境変数を取得するヘルパー関数
 * 必須の環境変数が設定されていない場合はエラーを投げます
 *
 * @param name - 環境変数名
 * @param defaultValue - デフォルト値（オプション）
 * @returns 環境変数の値
 * @throws {Error} 必須の環境変数が設定されていない場合
 */
function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name];
  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value || defaultValue!;
}

/**
 * アプリケーション全体で使用する環境変数を集約したオブジェクト
 * 環境別設定はVercel Environment Variablesで管理
 */
export const env = {
  // Supabase設定（環境別にVercelで自動設定）
  NEXT_PUBLIC_SUPABASE_URL: getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: getEnvVar(
    'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY'
  ),

  // データベース設定（Prisma用）
  DATABASE_URL: getEnvVar('DATABASE_URL'),
  DIRECT_URL: getEnvVar('DIRECT_URL'), // マイグレーション用

  // 認証設定
  NEXTAUTH_SECRET: getEnvVar('NEXTAUTH_SECRET'),
  NEXTAUTH_URL: getEnvVar('NEXTAUTH_URL', 'http://localhost:3000'),

  // 実行環境
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
} as const;
