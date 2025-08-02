# コンポーネントガイド

NextJS App Skeletonで提供されるUIコンポーネントの詳細な使用方法について説明します。

## 概要

このプロジェクトでは、再利用可能で一貫性のあるUIコンポーネントを提供しています。全てのコンポーネントは TypeScript で型安全に実装され、Tailwind CSS でスタイリングされています。

## 基本UIコンポーネント

### Button

汎用的なボタンコンポーネントです。複数のバリエーションとサイズをサポートします。

#### Props

```typescript
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}
```

#### 使用例

```tsx
import Button from '@/components/ui/Button';

// 基本的な使用
<Button onClick={handleClick}>クリック</Button>

// バリエーション
<Button variant="primary">メインボタン</Button>
<Button variant="secondary">サブボタン</Button>
<Button variant="outline">枠線ボタン</Button>
<Button variant="ghost">ゴーストボタン</Button>

// サイズ
<Button size="sm">小さい</Button>
<Button size="md">標準</Button>
<Button size="lg">大きい</Button>

// ローディング状態
<Button loading>処理中...</Button>

// 無効化
<Button disabled>無効</Button>

// カスタムクラス
<Button className="w-full">全幅ボタン</Button>
```

#### スタイルガイド

| Variant   | 用途               | 外観                 |
| --------- | ------------------ | -------------------- |
| primary   | メインアクション   | 背景色あり、強調表示 |
| secondary | サブアクション     | 控えめな背景色       |
| outline   | 中間的なアクション | 枠線のみ             |
| ghost     | 軽微なアクション   | 背景なし             |

---

### Card

情報をまとまった形で表示するためのカードコンポーネントです。

#### コンポーネント構成

```typescript
// メインコンポーネント
<Card />           // カードコンテナ
<CardHeader />     // ヘッダー部分
<CardTitle />      // タイトル
<CardDescription /> // 説明文
<CardContent />    // メインコンテンツ
<CardFooter />     // フッター部分
```

#### 使用例

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

// 基本的なカード
<Card>
  <CardHeader>
    <CardTitle>カードタイトル</CardTitle>
    <CardDescription>
      カードの説明文がここに入ります。
    </CardDescription>
  </CardHeader>
  <CardContent>
    <p>メインコンテンツ</p>
  </CardContent>
  <CardFooter>
    <Button>アクション</Button>
  </CardFooter>
</Card>

// シンプルなカード
<Card>
  <CardHeader>
    <CardTitle>シンプルカード</CardTitle>
  </CardHeader>
  <CardContent>
    コンテンツのみ
  </CardContent>
</Card>

// カスタムスタイル
<Card className="max-w-sm">
  <CardContent className="pt-6">
    <div className="text-center">
      <h3 className="text-lg font-semibold">中央揃え</h3>
    </div>
  </CardContent>
</Card>
```

## 機能コンポーネント

### ThemeToggle

ライトテーマとダークテーマを切り替えるボタンです。

#### 使用例

```tsx
import ThemeToggle from '@/components/ThemeToggle';

// ヘッダーなどに配置
<header className="flex justify-between items-center">
  <div>ロゴ</div>
  <ThemeToggle />
</header>;
```

#### 特徴

- 現在のテーマに応じたアイコン表示（🌙/☀️）
- Zustandストアと連携した状態管理
- HTML要素への自動クラス適用
- アクセシビリティ対応

---

### UsersList

ユーザー一覧を表示するコンポーネントです。APIとの連携例としても活用できます。

#### 使用例

```tsx
import UsersList from '@/components/UsersList';

// 基本的な使用
<UsersList />

// カスタムコンテナ内で使用
<div className="container mx-auto py-8">
  <h1 className="text-2xl font-bold mb-6">ユーザー管理</h1>
  <UsersList />
</div>
```

#### 特徴

- API連携（GET /api/users）
- ローディング状態の表示
- エラーハンドリング
- レスポンシブグリッドレイアウト
- 手動リフレッシュ機能

## カスタムフック

### useLocalStorage

ブラウザのlocalStorageとReactステートを同期するフックです。

#### 使用例

```tsx
import useLocalStorage from '@/hooks/useLocalStorage';

function MyComponent() {
  // 基本的な使用
  const [name, setName] = useLocalStorage('user-name', '');

  // オブジェクトの保存
  const [settings, setSettings] = useLocalStorage('app-settings', {
    theme: 'light',
    notifications: true,
  });

  // 配列の保存
  const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', []);

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="名前を入力"
      />

      <button
        onClick={() => setSettings((prev) => ({ ...prev, theme: 'dark' }))}
      >
        ダークモードに切り替え
      </button>

      <button onClick={() => setFavorites((prev) => [...prev, 'new-item'])}>
        お気に入りに追加
      </button>
    </div>
  );
}
```

#### 特徴

- SSR対応（サーバーサイドで安全に動作）
- 型安全性（TypeScriptジェネリクス対応）
- エラーハンドリング内蔵
- useState と同じAPI

## コンポーネント作成ガイドライン

### 1. ファイル構成

```
src/components/ui/NewComponent/
├── NewComponent.tsx      # メインコンポーネント
├── NewComponent.test.tsx # テストファイル
├── NewComponent.stories.tsx # Storybook（オプション）
└── index.ts             # エクスポート
```

### 2. コンポーネント作成テンプレート

```tsx
// src/components/ui/NewComponent/NewComponent.tsx
/**
 * コンポーネントの説明
 * 使用目的や特徴を記載
 */

import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/**
 * コンポーネントのProps定義
 */
interface NewComponentProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'alternative';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * NewComponent
 *
 * @param variant - コンポーネントのバリエーション
 * @param size - コンポーネントのサイズ
 * @param className - 追加のCSSクラス
 * @param children - 子要素
 *
 * @example
 * <NewComponent variant="default" size="md">
 *   内容
 * </NewComponent>
 */
const NewComponent = forwardRef<HTMLDivElement, NewComponentProps>(
  (
    { className, variant = 'default', size = 'md', children, ...props },
    ref
  ) => {
    // スタイル定義
    const baseClasses = 'base-styling-classes';

    const variants = {
      default: 'default-variant-classes',
      alternative: 'alternative-variant-classes',
    };

    const sizes = {
      sm: 'small-size-classes',
      md: 'medium-size-classes',
      lg: 'large-size-classes',
    };

    return (
      <div
        ref={ref}
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

NewComponent.displayName = 'NewComponent';

export default NewComponent;
```

### 3. テストの作成

```tsx
// src/components/ui/NewComponent/NewComponent.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewComponent from './NewComponent';

describe('NewComponent', () => {
  it('正しくレンダリングされる', () => {
    render(<NewComponent>Test content</NewComponent>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('variantプロパティが正しく適用される', () => {
    render(<NewComponent variant="alternative">Content</NewComponent>);
    const element = screen.getByText('Content');
    expect(element).toHaveClass('alternative-variant-classes');
  });

  it('カスタムクラスが正しく適用される', () => {
    render(<NewComponent className="custom-class">Content</NewComponent>);
    const element = screen.getByText('Content');
    expect(element).toHaveClass('custom-class');
  });
});
```

### 4. エクスポート設定

```tsx
// src/components/ui/NewComponent/index.ts
export { default } from './NewComponent';
export type { NewComponentProps } from './NewComponent';
```

## ベストプラクティス

### 1. アクセシビリティ

```tsx
// 適切なARIA属性の使用
<Button
  aria-label="メニューを開く"
  aria-expanded={isOpen}
  aria-controls="menu"
>
  ☰
</Button>

// セマンティックなHTML要素の使用
<nav role="navigation">
  <ul>
    <li><a href="/">ホーム</a></li>
  </ul>
</nav>
```

### 2. パフォーマンス

```tsx
import { memo, useMemo } from 'react';

// 重い計算のメモ化
const ExpensiveComponent = memo(({ data }) => {
  const processedData = useMemo(() => {
    return data.map(heavyProcessing);
  }, [data]);

  return <div>{processedData}</div>;
});

// 条件付きレンダリング
const ConditionalComponent = ({ show, children }) => {
  if (!show) return null;
  return <div>{children}</div>;
};
```

### 3. 型安全性

```tsx
// 適切な型定義
interface StrictProps {
  title: string;
  count: number;
  items: readonly string[];
  onSelect: (item: string) => void;
}

// ジェネリクス活用
interface GenericListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

function GenericList<T>({
  items,
  renderItem,
  keyExtractor,
}: GenericListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}
```

## 関連ドキュメント

- [開発ガイド](./development.md) - 開発の進め方とベストプラクティス
- [状態管理ガイド](./state-management.md) - Zustandストアの使い方
- [API仕様](./api.md) - APIエンドポイントの詳細
