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
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value || defaultValue!;
}

/**
 * アプリケーション全体で使用する環境変数を集約したオブジェクト
 * 型安全性を確保し、環境変数の一元管理を行います
 */
export const env = {
  // データベース接続URL
  DATABASE_URL: getEnvVar('DATABASE_URL'),
  
  // NextAuth.js設定
  NEXTAUTH_SECRET: getEnvVar('NEXTAUTH_SECRET'), // JWT署名用のシークレットキー
  NEXTAUTH_URL: getEnvVar('NEXTAUTH_URL', 'http://localhost:3000'), // アプリケーションのベースURL
  
  // 実行環境
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
  
  // 機能フラグ（boolean値として解析）
  ENABLE_ANALYTICS: getEnvVar('ENABLE_ANALYTICS', 'false') === 'true', // アナリティクス機能の有効/無効
  ENABLE_LOGGING: getEnvVar('ENABLE_LOGGING', 'true') === 'true', // ログ出力の有効/無効
} as const;