# 状態管理ガイド

NextJS App SkeletonでのZustandを使用した状態管理について詳しく説明します。

## 概要

このプロジェクトでは、軽量で型安全な状態管理ライブラリ「Zustand」を採用しています。Reduxのようなボイラープレートなしに、シンプルで効果的な状態管理を実現できます。

## アーキテクチャ

### 状態管理の階層

```
状態管理の階層:
├── ローカル状態 (useState)
│   ├── コンポーネント固有の状態
│   ├── フォームの入力値
│   └── UI状態（モーダル開閉など）
├── グローバル状態 (Zustand)
│   ├── ユーザー認証情報
│   ├── アプリケーション設定
│   └── 複数コンポーネント間で共有するデータ
└── サーバー状態 (React Query/SWR)
    ├── APIから取得したデータ
    ├── キャッシュ管理
    └── バックグラウンド更新
```

## 実装されているストア

### 1. ユーザーストア (userStore)

ユーザーの認証状態と情報を管理します。

#### ストアの構造

```typescript
interface UserState {
  user: User | null; // 現在ログインしているユーザー
  isLoading: boolean; // 認証処理中かどうか
  error: string | null; // エラーメッセージ
}

interface UserActions {
  setUser: (user: User | null) => void; // ユーザー情報を設定
  setLoading: (loading: boolean) => void; // ローディング状態を設定
  setError: (error: string | null) => void; // エラー状態を設定
  logout: () => void; // ログアウト処理
}
```

#### 使用例

```tsx
import { useUserStore } from '@/store';

function UserProfile() {
  const { user, isLoading, error, setUser, logout } = useUserStore();

  if (isLoading) {
    return <div>ログイン確認中...</div>;
  }

  if (error) {
    return <div>エラー: {error}</div>;
  }

  if (!user) {
    return <div>未ログイン</div>;
  }

  return (
    <div>
      <h2>ようこそ、{user.name}さん</h2>
      <p>メール: {user.email}</p>
      <button onClick={logout}>ログアウト</button>
    </div>
  );
}
```

#### 認証フローの実装例

```tsx
import { useUserStore } from '@/store';
import { api } from '@/utils/api';

function useAuth() {
  const { setUser, setLoading, setError } = useUserStore();

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post('/api/auth/login', { email, password });

      if (response.success) {
        setUser(response.data.user);
      } else {
        setError(response.error || 'ログインに失敗しました');
      }
    } catch (error) {
      setError('ネットワークエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/auth/me');

      if (response.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      // 認証エラーは無視（未ログイン状態として扱う）
    } finally {
      setLoading(false);
    }
  };

  return { login, checkAuth };
}
```

---

### 2. アプリケーションストア (appStore)

アプリケーション全体のUI状態と設定を管理します。

#### ストアの構造

```typescript
interface AppState {
  theme: 'light' | 'dark'; // アプリケーションテーマ
  sidebarOpen: boolean; // サイドバーの開閉状態
  notifications: Notification[]; // 通知リスト
}

interface AppActions {
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  addNotification: (
    notification: Omit<Notification, 'id' | 'createdAt'>
  ) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}
```

#### テーマ管理の使用例

```tsx
import { useAppStore } from '@/store';

function ThemeSettings() {
  const { theme, setTheme, toggleTheme } = useAppStore();

  return (
    <div>
      <h3>テーマ設定</h3>
      <div>
        <label>
          <input
            type="radio"
            value="light"
            checked={theme === 'light'}
            onChange={() => setTheme('light')}
          />
          ライトモード
        </label>
        <label>
          <input
            type="radio"
            value="dark"
            checked={theme === 'dark'}
            onChange={() => setTheme('dark')}
          />
          ダークモード
        </label>
      </div>
      <button onClick={toggleTheme}>テーマを切り替え</button>
    </div>
  );
}
```

#### 通知システムの使用例

```tsx
import { useAppStore } from '@/store';

function NotificationSystem() {
  const { notifications, addNotification, removeNotification } = useAppStore();

  const showSuccessMessage = () => {
    addNotification({
      type: 'success',
      title: '成功',
      message: '操作が完了しました',
      duration: 3000, // 3秒後に自動削除
    });
  };

  const showErrorMessage = () => {
    addNotification({
      type: 'error',
      title: 'エラー',
      message: '操作に失敗しました',
      duration: -1, // 手動削除まで表示
    });
  };

  return (
    <div>
      <button onClick={showSuccessMessage}>成功通知を表示</button>
      <button onClick={showErrorMessage}>エラー通知を表示</button>

      {/* 通知リスト */}
      <div className="fixed top-4 right-4 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded shadow ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">{notification.title}</h4>
                {notification.message && (
                  <p className="text-sm">{notification.message}</p>
                )}
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="ml-2 text-white hover:text-gray-200"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## カスタムストアの作成

### 基本的なストア作成

```typescript
// src/store/todoStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

interface TodoState {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
}

interface TodoActions {
  addTodo: (title: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  setFilter: (filter: TodoState['filter']) => void;
  clearCompleted: () => void;
}

export const useTodoStore = create<TodoState & TodoActions>()(
  persist(
    (set, get) => ({
      // 初期状態
      todos: [],
      filter: 'all',

      // アクション
      addTodo: (title) => {
        const newTodo: Todo = {
          id: crypto.randomUUID(),
          title,
          completed: false,
          createdAt: new Date(),
        };
        set((state) => ({ todos: [...state.todos, newTodo] }));
      },

      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        })),

      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),

      setFilter: (filter) => set({ filter }),

      clearCompleted: () =>
        set((state) => ({
          todos: state.todos.filter((todo) => !todo.completed),
        })),
    }),
    {
      name: 'todo-storage', // localStorageのキー名
      // 永続化したくないデータを除外
      partialize: (state) => ({
        todos: state.todos,
        // filter は除外（セッション毎にリセット）
      }),
    }
  )
);
```

### 非同期処理を含むストア

```typescript
// src/store/dataStore.ts
import { create } from 'zustand';
import { api } from '@/utils/api';

interface DataState {
  items: any[];
  isLoading: boolean;
  error: string | null;
  lastFetched: Date | null;
}

interface DataActions {
  fetchItems: () => Promise<void>;
  addItem: (item: any) => Promise<void>;
  updateItem: (id: string, updates: any) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useDataStore = create<DataState & DataActions>((set, get) => ({
  // 初期状態
  items: [],
  isLoading: false,
  error: null,
  lastFetched: null,

  // アクション
  fetchItems: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.get('/api/items');
      if (response.success) {
        set({
          items: response.data,
          lastFetched: new Date(),
          isLoading: false,
        });
      } else {
        set({ error: response.error, isLoading: false });
      }
    } catch (error) {
      set({ error: 'ネットワークエラー', isLoading: false });
    }
  },

  addItem: async (item) => {
    try {
      const response = await api.post('/api/items', item);
      if (response.success) {
        set((state) => ({
          items: [...state.items, response.data],
        }));
      } else {
        set({ error: response.error });
      }
    } catch (error) {
      set({ error: 'アイテムの追加に失敗しました' });
    }
  },

  updateItem: async (id, updates) => {
    try {
      const response = await api.put(`/api/items/${id}`, updates);
      if (response.success) {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...response.data } : item
          ),
        }));
      } else {
        set({ error: response.error });
      }
    } catch (error) {
      set({ error: 'アイテムの更新に失敗しました' });
    }
  },

  deleteItem: async (id) => {
    try {
      const response = await api.delete(`/api/items/${id}`);
      if (response.success) {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      } else {
        set({ error: response.error });
      }
    } catch (error) {
      set({ error: 'アイテムの削除に失敗しました' });
    }
  },

  clearError: () => set({ error: null }),
}));
```

## 高度なパターン

### 1. セレクターの使用

パフォーマンス最適化のため、必要な状態のみを購読：

```tsx
import { useAppStore } from '@/store';

// 悪い例：不要な再レンダリングが発生
function BadComponent() {
  const store = useAppStore(); // ストア全体を購読
  return <div>{store.theme}</div>;
}

// 良い例：必要な状態のみ購読
function GoodComponent() {
  const theme = useAppStore((state) => state.theme);
  return <div>{theme}</div>;
}

// 複数の値を効率的に取得
function MultipleValues() {
  const { theme, sidebarOpen } = useAppStore((state) => ({
    theme: state.theme,
    sidebarOpen: state.sidebarOpen,
  }));

  return (
    <div>
      <div>テーマ: {theme}</div>
      <div>サイドバー: {sidebarOpen ? '開' : '閉'}</div>
    </div>
  );
}
```

### 2. コンピューテッドプロパティ

```typescript
// Todoストアに計算済みプロパティを追加
export const useTodoStore = create<TodoState & TodoActions>((set, get) => ({
  // ... 既存の実装

  // セレクター（コンピューテッドプロパティ）
  getFilteredTodos: () => {
    const { todos, filter } = get();
    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  },

  getStats: () => {
    const { todos } = get();
    return {
      total: todos.length,
      completed: todos.filter((todo) => todo.completed).length,
      active: todos.filter((todo) => !todo.completed).length,
    };
  },
}));

// 使用例
function TodoStats() {
  const getStats = useTodoStore((state) => state.getStats);
  const stats = getStats();

  return (
    <div>
      <p>総数: {stats.total}</p>
      <p>完了: {stats.completed}</p>
      <p>未完了: {stats.active}</p>
    </div>
  );
}
```

### 3. ミドルウェアの活用

#### デバッグ用ミドルウェア

```typescript
import { devtools } from 'zustand/middleware';

export const useDebugStore = create<State & Actions>()(
  devtools(
    (set) => ({
      // ストア実装
    }),
    {
      name: 'debug-store', // DevTools上での表示名
    }
  )
);
```

#### ログ出力ミドルウェア

```typescript
const loggerMiddleware = (config) => (set, get, api) =>
  config(
    (...args) => {
      console.log('Previous state:', get());
      set(...args);
      console.log('New state:', get());
    },
    get,
    api
  );

export const useLoggedStore = create(
  loggerMiddleware((set) => ({
    // ストア実装
  }))
);
```

## テスト

### ストアのテスト

```typescript
// src/store/__tests__/todoStore.test.ts
import { renderHook, act } from '@testing-library/react';
import { useTodoStore } from '../todoStore';

describe('todoStore', () => {
  beforeEach(() => {
    // テスト前にストアをリセット
    useTodoStore.setState({
      todos: [],
      filter: 'all',
    });
  });

  it('新しいTodoを追加できる', () => {
    const { result } = renderHook(() => useTodoStore());

    act(() => {
      result.current.addTodo('新しいタスク');
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].title).toBe('新しいタスク');
  });

  it('Todoの完了状態を切り替えできる', () => {
    const { result } = renderHook(() => useTodoStore());

    act(() => {
      result.current.addTodo('テストタスク');
    });

    const todoId = result.current.todos[0].id;

    act(() => {
      result.current.toggleTodo(todoId);
    });

    expect(result.current.todos[0].completed).toBe(true);
  });
});
```

### コンポーネントテスト

```typescript
// src/components/__tests__/TodoList.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useTodoStore } from '@/store/todoStore';
import TodoList from '../TodoList';

// ストアをモック
jest.mock('@/store/todoStore');

describe('TodoList', () => {
  const mockStore = {
    todos: [
      { id: '1', title: 'テストタスク1', completed: false },
      { id: '2', title: 'テストタスク2', completed: true },
    ],
    addTodo: jest.fn(),
    toggleTodo: jest.fn(),
  };

  beforeEach(() => {
    (useTodoStore as jest.Mock).mockReturnValue(mockStore);
  });

  it('Todoリストが正しく表示される', () => {
    render(<TodoList />);

    expect(screen.getByText('テストタスク1')).toBeInTheDocument();
    expect(screen.getByText('テストタスク2')).toBeInTheDocument();
  });
});
```

## ベストプラクティス

### 1. ストアの分割

```typescript
// 機能ごとにストアを分割
// ❌ 悪い例：全てを一つのストアに
const useMegaStore = create(() => ({
  user: null,
  theme: 'light',
  todos: [],
  posts: [],
  comments: [],
  // ... 数十個のプロパティ
}));

// ✅ 良い例：機能ごとに分割
const useUserStore = create(() => ({ user: null, ... }));
const useAppStore = create(() => ({ theme: 'light', ... }));
const useTodoStore = create(() => ({ todos: [], ... }));
```

### 2. アクションの命名

```typescript
// ✅ 良い例：意図が明確
const useUserStore = create((set) => ({
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  updateUserProfile: (updates) =>
    set((state) => ({
      user: { ...state.user, ...updates },
    })),
}));

// ❌ 悪い例：不明確
const useUserStore = create((set) => ({
  update: (data) => set(data),
  change: (value) => set({ user: value }),
}));
```

### 3. エラーハンドリング

```typescript
const useApiStore = create<State & Actions>((set) => ({
  fetchData: async () => {
    set({ isLoading: true, error: null });

    try {
      const data = await api.get('/data');
      set({ data, isLoading: false });
    } catch (error) {
      set({
        error: error.message || '不明なエラー',
        isLoading: false,
      });
    }
  },
}));
```

## 関連ドキュメント

- [開発ガイド](./development.md) - 開発の進め方とベストプラクティス
- [コンポーネントガイド](./components.md) - UIコンポーネントの使用方法
- [API仕様](./api.md) - APIエンドポイントの詳細
