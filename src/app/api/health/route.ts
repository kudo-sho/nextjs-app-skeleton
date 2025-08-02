/**
 * ヘルスチェック API エンドポイント
 * サーバーの稼働状態を確認するためのAPIです
 * ロードバランサーやモニタリングツールから定期的に呼び出されます
 */

import { NextResponse } from 'next/server';

/**
 * GET /api/health
 * サーバーの稼働状況を返すエンドポイント
 * 
 * @returns {Object} ヘルスチェック結果
 * - success: 常にtrue（エラーの場合は500エラーが返される）
 * - message: 稼働状況メッセージ
 * - timestamp: 現在のタイムスタンプ（ISO形式）
 * - uptime: サーバープロセスの稼働時間（秒）
 * 
 * @example
 * GET /api/health
 * Response: {
 *   "success": true,
 *   "message": "Server is healthy",
 *   "timestamp": "2024-01-01T00:00:00.000Z",
 *   "uptime": 3600
 * }
 */
export async function GET() {
  return NextResponse.json({
    success: true, // 処理成功フラグ
    message: 'Server is healthy', // 稼働状況メッセージ
    timestamp: new Date().toISOString(), // 現在のタイムスタンプ
    uptime: process.uptime(), // プロセス開始からの経過時間（秒）
  });
}