/**
 * API通信を行うためのユーティリティ関数群
 * 型安全性、エラーハンドリング、タイムアウト機能を提供します
 */

import type { ApiResponse } from '@/types';

/**
 * API呼び出し時のエラーを表すカスタムエラークラス
 * HTTPステータスコードと追加情報を含みます
 */
class ApiError extends Error {
  constructor(
    message: string,
    public status: number, // HTTPステータスコード
    public response?: any // 生のレスポンスオブジェクト
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * APIリクエストのオプション
 * 標準のRequestInitにタイムアウト機能を追加
 */
interface RequestOptions extends RequestInit {
  timeout?: number; // タイムアウト時間（ミリ秒）
}

/**
 * 汎用的なHTTPリクエスト関数
 * エラーハンドリング、タイムアウト、レスポンス変換を含む
 * 
 * @param url - リクエストURL
 * @param options - リクエストオプション
 * @returns API レスポンス
 * @throws {ApiError} リクエストが失敗した場合
 */
async function request<T>(
  url: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { timeout = 10000, ...fetchOptions } = options;

  // タイムアウト機能のためのAbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json', // デフォルトでJSONを指定
        ...fetchOptions.headers,
      },
    });

    clearTimeout(timeoutId);

    // HTTPステータスエラーをチェック
    if (!response.ok) {
      throw new ApiError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        response
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    
    // 既存のApiErrorはそのまま再投げ
    if (error instanceof ApiError) {
      throw error;
    }
    
    // タイムアウトエラーの処理
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timeout', 408);
    }
    
    // その他のネットワークエラー
    throw new ApiError('Network error', 0, error);
  }
}

/**
 * API呼び出し用のメソッド群
 * REST APIの標準的なHTTPメソッドを提供します
 */
export const api = {
  /**
   * GETリクエストを送信
   * @param url - リクエストURL
   * @param options - リクエストオプション
   */
  get: <T>(url: string, options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'GET' }),
    
  /**
   * POSTリクエストを送信
   * @param url - リクエストURL
   * @param body - リクエストボディ
   * @param options - リクエストオプション
   */
  post: <T>(url: string, body?: any, options?: RequestOptions) =>
    request<T>(url, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),
    
  /**
   * PUTリクエストを送信
   * @param url - リクエストURL
   * @param body - リクエストボディ
   * @param options - リクエストオプション
   */
  put: <T>(url: string, body?: any, options?: RequestOptions) =>
    request<T>(url, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),
    
  /**
   * DELETEリクエストを送信
   * @param url - リクエストURL
   * @param options - リクエストオプション
   */
  delete: <T>(url: string, options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'DELETE' }),
};

export { ApiError };