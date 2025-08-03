/**
 * ユーザー一覧表示コンポーネント
 * APIからユーザーデータを取得し、カード形式で表示します
 * ローディング状態、エラー状態、リフレッシュ機能を含みます
 */

'use client';

import { useEffect, useState } from 'react';
import { api } from '@/utils/api';
import type { User, PaginatedResponse } from '@/types';
import Button from './ui/Button';

/**
 * ユーザー一覧表示コンポーネント
 *
 * 機能:
 * - APIからユーザーデータを取得
 * - レスポンシブなグリッドレイアウトで表示
 * - ローディング状態とエラー状態の表示
 * - 手動リフレッシュ機能
 *
 * @returns ユーザー一覧のJSX要素
 */
export default function UsersList() {
  // ===== 状態管理 =====
  const [users, setUsers] = useState<User[]>([]); // ユーザーデータのリスト
  const [loading, setLoading] = useState(true); // ローディング状態
  const [error, setError] = useState<string | null>(null); // エラーメッセージ

  /**
   * ユーザーデータをAPIから取得する関数
   * エラーハンドリングとローディング状態の管理を含みます
   */
  const fetchUsers = async () => {
    try {
      setLoading(true); // ローディング開始
      setError(null); // 前回のエラーをクリア

      // APIからユーザーデータを取得
      const response = await api.get<PaginatedResponse<User>>('/api/users');

      if (response.success && response.data) {
        setUsers(response.data as unknown as User[]); // 成功時はデータを設定
      } else {
        setError(response.error || 'Failed to fetch users'); // APIエラーを設定
      }
    } catch {
      // ネットワークエラーなどの例外をキャッチ
      setError('Failed to fetch users');
    } finally {
      setLoading(false); // ローディング終了
    }
  };

  /**
   * コンポーネントマウント時にユーザーデータを取得
   */
  useEffect(() => {
    fetchUsers();
  }, []);

  // ===== ローディング状態の表示 =====
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        {/* スピナーアニメーション */}
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // ===== エラー状態の表示 =====
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="mb-4 text-red-600 dark:text-red-400">{error}</p>
        <Button onClick={fetchUsers}>Try Again</Button>
      </div>
    );
  }

  // ===== メインコンテンツの表示 =====
  return (
    <div className="space-y-4">
      {/* ヘッダー部分（タイトルとリフレッシュボタン） */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Users</h2>
        <Button onClick={fetchUsers} size="sm">
          Refresh
        </Button>
      </div>

      {/* ユーザーカードのグリッド表示 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="p-4 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <div className="flex items-center space-x-3">
              {/* ユーザーアバター画像（存在する場合のみ表示） */}
              {user.avatar && (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
              )}

              {/* ユーザー情報 */}
              <div>
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
