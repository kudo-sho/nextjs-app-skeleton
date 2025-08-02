/**
 * アプリケーション全体の状態を管理するZustandストア
 * テーマ、通知、UI状態などのグローバルな状態を管理します
 */

import { create } from 'zustand';

/**
 * アプリケーションの状態を表すインターフェース
 */
interface AppState {
  theme: 'light' | 'dark'; // アプリケーションのテーマ
  sidebarOpen: boolean; // サイドバーの開閉状態
  notifications: Notification[]; // 通知のリスト
}

/**
 * 通知情報を表すインターフェース
 */
interface Notification {
  id: string; // 通知の一意識別子
  type: 'info' | 'success' | 'warning' | 'error'; // 通知の種類
  title: string; // 通知のタイトル
  message?: string; // 通知の詳細メッセージ（オプション）
  duration?: number; // 自動削除までの時間（ミリ秒、-1で無期限）
  createdAt: Date; // 通知の作成日時
}

/**
 * アプリケーション状態を操作するアクションのインターフェース
 */
interface AppActions {
  setTheme: (theme: 'light' | 'dark') => void; // テーマを設定
  toggleTheme: () => void; // テーマを切り替え
  setSidebarOpen: (open: boolean) => void; // サイドバーの開閉を設定
  toggleSidebar: () => void; // サイドバーの開閉を切り替え
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void; // 通知を追加
  removeNotification: (id: string) => void; // 通知を削除
  clearNotifications: () => void; // 全ての通知をクリア
}

/**
 * アプリケーション状態管理用のZustandストア
 * グローバルなUI状態と通知システムを提供します
 */
export const useAppStore = create<AppState & AppActions>((set, get) => ({
  // ===== 初期状態 =====
  theme: 'light', // デフォルトはライトテーマ
  sidebarOpen: false, // サイドバーは初期状態で閉じている
  notifications: [], // 初期は通知なし

  // ===== アクション =====
  
  /**
   * テーマを直接設定
   */
  setTheme: (theme) => set({ theme }),
  
  /**
   * テーマを切り替え（light ⇔ dark）
   */
  toggleTheme: () => {
    const { theme } = get();
    set({ theme: theme === 'light' ? 'dark' : 'light' });
  },
  
  /**
   * サイドバーの開閉状態を設定
   */
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  
  /**
   * サイドバーの開閉を切り替え
   */
  toggleSidebar: () => {
    const { sidebarOpen } = get();
    set({ sidebarOpen: !sidebarOpen });
  },

  /**
   * 新しい通知を追加
   * IDと作成日時は自動生成され、指定した時間後に自動削除されます
   */
  addNotification: (notification) => {
    const id = crypto.randomUUID(); // 一意のIDを生成
    const newNotification: Notification = {
      ...notification,
      id,
      createdAt: new Date(),
    };
    
    // 通知リストに追加
    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));

    // 自動削除タイマー設定（duration が -1 でなければ）
    if (notification.duration !== -1) {
      const duration = notification.duration || 5000; // デフォルト5秒
      setTimeout(() => {
        get().removeNotification(id);
      }, duration);
    }
  },

  /**
   * 指定したIDの通知を削除
   */
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  /**
   * 全ての通知をクリア
   */
  clearNotifications: () => set({ notifications: [] }),
}));