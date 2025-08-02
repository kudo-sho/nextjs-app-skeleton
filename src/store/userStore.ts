/**
 * ユーザー認証状態を管理するZustandストア
 * ユーザー情報とログイン状態を一元管理し、永続化も行います
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

/**
 * ユーザー状態を表すインターフェース
 */
interface UserState {
  user: User | null; // 現在ログインしているユーザー情報
  isLoading: boolean; // 認証処理中かどうか
  error: string | null; // エラーメッセージ
}

/**
 * ユーザー状態を操作するアクションのインターフェース
 */
interface UserActions {
  setUser: (user: User | null) => void; // ユーザー情報を設定
  setLoading: (loading: boolean) => void; // ローディング状態を設定
  setError: (error: string | null) => void; // エラー状態を設定
  logout: () => void; // ログアウト処理
}

/**
 * ユーザー状態管理用のZustandストア
 * 認証情報はlocalStorageに永続化されます
 */
export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set) => ({
      // ===== 初期状態 =====
      user: null, // 未ログイン状態
      isLoading: false, // 初期は非ローディング状態
      error: null, // 初期はエラーなし

      // ===== アクション =====
      
      /**
       * ユーザー情報を設定し、エラーをクリア
       * ログイン成功時に呼び出されます
       */
      setUser: (user) => set({ user, error: null }),
      
      /**
       * ローディング状態を設定
       * 認証処理の開始・終了時に呼び出されます
       */
      setLoading: (isLoading) => set({ isLoading }),
      
      /**
       * エラー状態を設定し、ローディングを終了
       * 認証エラー時に呼び出されます
       */
      setError: (error) => set({ error, isLoading: false }),
      
      /**
       * ログアウト処理
       * 全ての状態をリセットします
       */
      logout: () => set({ user: null, error: null, isLoading: false }),
    }),
    {
      name: 'user-storage', // localStorageのキー名
      partialize: (state) => ({ user: state.user }), // ユーザー情報のみ永続化
    }
  )
);