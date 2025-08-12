# 開発ガイド

NextJS App Skeletonでの効率的な開発方法とベストプラクティスについて説明します。

## ローカル開発環境のセットアップ

### クイックスタート

```bash
# 1. 依存関係のインストール
npm install

# 2. Supabaseローカル環境の起動
npx supabase start

# 3. Prismaクライアントを生成
npm run db:generate

# 4. データベースの初期化（マイグレーション適用）
npm run db:migrate

# 5. サンプルデータの投入
npm run db:seed

# 6. 開発サーバーの起動
npm run dev
```

### データベース環境

#### Supabase Local Development（デフォルト設定）

環境変数は既に設定済み（`.env`ファイル）なので、追加の設定は不要です：

```bash
# Supabaseローカル環境（事前設定済み）
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**利用可能なサービス:**

- **API URL**: http://127.0.0.1:54321
- **GraphQL**: http://127.0.0.1:54321/graphql/v1
- **DB URL**: postgresql://postgres:postgres@127.0.0.1:54322/postgres
- **Studio**: http://127.0.0.1:54323
- **Mail**: http://127.0.0.1:54324

#### オプション B: Docker Compose（PostgreSQL）

```yaml
# docker-compose.dev.yml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: nextjs_app_skeleton
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 30s
      timeout: 10s
      retries: 3

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

```bash
# Docker環境を起動
docker-compose -f docker-compose.dev.yml up -d

# データベース接続確認
psql postgresql://postgres:password@localhost:5432/nextjs_app_skeleton
```

**環境変数の設定（.envファイル）:**

```bash
# PostgreSQL直接接続
DATABASE_URL=postgresql://postgres:password@localhost:5432/nextjs_app_skeleton
REDIS_URL=redis://localhost:6379

# その他必須項目
NODE_ENV=development
```

#### オプション C: リモートSupabaseプロジェクト

```bash
# 開発用Supabaseプロジェクトを使用
NEXT_PUBLIC_SUPABASE_URL=https://your-dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-dev-anon-key
```

### 2. データベーススキーマの作成

#### データベーススキーマ管理：

このプロジェクトではPrismaを使用してデータベーススキーマを管理します。

```bash
# Prismaスキーマファイルを編集
# prisma/schema.prisma

# マイグレーションファイルを生成・適用
npm run db:migrate
```

### 3. 開発環境の起動

```bash
# データベース環境の起動（選択したオプションに応じて）
supabase start                    # Supabaseローカル
# または
docker-compose -f docker-compose.dev.yml up -d  # Docker

# Next.jsアプリケーション起動
npm run dev

# ブラウザで確認
# アプリ: http://localhost:3000
# Supabase Studio: http://localhost:54323 (Supabaseローカルの場合)
```

### 4. 開発環境の停止

```bash
# Supabaseローカル環境の停止
supabase stop

# Docker環境の停止
docker-compose -f docker-compose.dev.yml down

# データを残したい場合
docker-compose -f docker-compose.dev.yml down --volumes  # データも削除
```

### 5. 開発データの投入

```bash
# Prisma seedを実行
npm run db:seed

# データベースをリセットしてシードデータを投入
# Supabaseの場合
supabase db reset  # 全データリセット + マイグレーション + シード
```

## 開発ワークフロー

### 1. 機能開発の基本フロー

```bash
# 1. 新しいブランチを作成
git checkout -b feature/new-feature

# 2. 開発サーバーを起動
npm run dev

# 3. 開発作業
# - コンポーネント作成
# - API実装
# - テスト作成

# 4. コードの確認
npm run lint        # ESLintチェック
npm test           # テスト実行
npm run build      # ビルド確認

# 5. コミット（pre-commitフックが自動実行される）
git add .
git commit -m "feat: 新機能の追加"

# 6. プッシュとプルリクエスト
git push origin feature/new-feature
```

### 2. コード品質の維持

**自動実行されるチェック：**

- **pre-commit**: lint-stagedによるESLint + Prettier
- **CI/CD**: テスト、ビルド、型チェック

**手動実行するチェック：**

```bash
npm run format:check    # Prettierフォーマット確認
npm run test:coverage   # テストカバレッジ
npm run type-check      # TypeScript型チェック（存在する場合）
```

## アーキテクチャパターン

### コンポーネント設計

#### 1. ディレクトリ構造

```
src/components/
├── ui/              # 再利用可能な基本UIコンポーネント
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── index.ts
│   └── Card/
├── layout/          # レイアウト関連コンポーネント
├── forms/           # フォーム関連コンポーネント
└── features/        # 機能固有のコンポーネント
```

#### 2. コンポーネントの作成例

```typescript
// src/components/ui/Input/Input.tsx
/**
 * 再利用可能な入力フィールドコンポーネント
 */
import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error';
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', label, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <input
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2',
            'text-sm ring-offset-background file:border-0 file:bg-transparent',
            'placeholder:text-muted-foreground focus-visible:outline-none',
            'focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed',
            variant === 'error' && 'border-destructive',
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
```

### 状態管理パターン

#### 1. ローカル状態 vs グローバル状態

**ローカル状態（useState）を使用する場合：**

- コンポーネント固有の状態
- フォームの入力値
- UI状態（開閉状態など）

**グローバル状態（Zustand）を使用する場合：**

- ユーザー認証情報
- アプリケーション設定
- 複数コンポーネント間で共有するデータ

#### 2. ストア作成の例

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
    }),
    {
      name: 'todo-storage',
    }
  )
);
```

### API統合パターン

#### 1. APIクライアントの使用

```typescript
// src/hooks/useTodos.ts
import { useEffect, useState } from 'react';
import { api } from '@/utils/api';
import type { Todo, ApiResponse } from '@/types';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<ApiResponse<Todo[]>>('/api/todos');

      if (response.success && response.data) {
        setTodos(response.data);
      } else {
        setError(response.error || 'Failed to fetch todos');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (title: string) => {
    try {
      const response = await api.post<ApiResponse<Todo>>('/api/todos', {
        title,
      });
      if (response.success && response.data) {
        setTodos((prev) => [...prev, response.data]);
      }
    } catch (err) {
      setError('Failed to add todo');
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return {
    todos,
    loading,
    error,
    refetch: fetchTodos,
    addTodo,
  };
}
```

#### 2. APIルートの実装

```typescript
// src/app/api/todos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import type { Todo, ApiResponse } from '@/types';

export async function GET() {
  try {
    // データベースからTodoを取得
    const todos = await getTodosFromDatabase();

    const response: ApiResponse<Todo[]> = {
      success: true,
      data: todos,
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error',
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json();

    if (!title || typeof title !== 'string') {
      const response: ApiResponse = {
        success: false,
        error: 'Title is required',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const newTodo = await createTodoInDatabase({ title });

    const response: ApiResponse<Todo> = {
      success: true,
      data: newTodo,
      message: 'Todo created successfully',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error',
    };

    return NextResponse.json(response, { status: 500 });
  }
}
```

## テスト戦略

### 1. テストの種類

**単体テスト（Unit Tests）:**

- ユーティリティ関数
- カスタムフック
- 純粋な関数

**コンポーネントテスト（Component Tests）:**

- UIコンポーネントの動作
- ユーザーインタラクション
- プロパティの変更による挙動

**統合テスト（Integration Tests）:**

- APIとの連携
- ストアとコンポーネントの連携

### 2. テスト作成例

```typescript
// src/components/ui/Button/Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button', () => {
  it('正しくレンダリングされる', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('クリックイベントが正しく処理される', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('ローディング状態が正しく表示される', () => {
    render(<Button loading>Loading</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button.querySelector('svg')).toBeInTheDocument();
  });
});
```

## パフォーマンス最適化

### 1. コンポーネントの最適化

```typescript
import { memo, useMemo, useCallback } from 'react';

// 重い計算をメモ化
const ExpensiveComponent = memo(({ data }: { data: any[] }) => {
  const processedData = useMemo(() => {
    return data.map(item => heavyProcessing(item));
  }, [data]);

  const handleClick = useCallback((id: string) => {
    // イベントハンドラーをメモ化
  }, []);

  return (
    <div>
      {processedData.map(item => (
        <div key={item.id} onClick={() => handleClick(item.id)}>
          {item.name}
        </div>
      ))}
    </div>
  );
});
```

### 2. 画像の最適化

```typescript
import Image from 'next/image';

// Next.js Imageコンポーネントの使用
<Image
  src="/hero.jpg"
  alt="Hero image"
  width={800}
  height={600}
  priority // LCP改善のため
  placeholder="blur" // ローディング中のぼかし
  blurDataURL="data:image/jpeg;base64,..." // ぼかし用データ
/>
```

## デバッグとトラブルシューティング

### 1. 開発ツール

**React Developer Tools:**

- コンポーネントの状態確認
- プロパティの変更追跡

**Zustand DevTools:**

```typescript
import { devtools } from 'zustand/middleware';

export const useStore = create<State & Actions>()(
  devtools(
    (set) => ({
      // ストア実装
    }),
    {
      name: 'app-store', // DevTools上での表示名
    }
  )
);
```

### 2. ログ出力

```typescript
// 開発環境でのログ出力
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}

// 本番環境での安全なログ
import { env } from '@/lib/env';

if (env.ENABLE_LOGGING) {
  // 外部ログサービスに送信
  logger.info('User action', { userId, action });
}
```

## デプロイメント

### 1. 本番ビルド前のチェック

```bash
# 全体的な品質チェック
npm run lint
npm test
npm run build

# 型チェック
npx tsc --noEmit

# セキュリティ監査
npm audit
```

### 2. 環境変数の本番設定

```bash
# 本番環境用の環境変数
NODE_ENV=production
DATABASE_URL=your-production-database-url
```

次のステップ：

- [API仕様](./api.md) - APIエンドポイントの詳細
- [コンポーネントガイド](./components.md) - UIコンポーネントの使用方法
- [状態管理ガイド](./state-management.md) - Zustandストアの使い方
