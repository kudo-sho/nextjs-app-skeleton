# Gemini コードレビュー用プロジェクトスタイルガイド

## プロジェクト概要

Next.js 15 + Supabase + Vercel フルスタックWebアプリケーションスケルトン

## コア技術

- **フロントエンド**: Next.js 15 (App Router), React 19, TypeScript
- **バックエンド**: Supabase (PostgreSQL), Prisma ORM
- **スタイリング**: Tailwind CSS
- **状態管理**: Zustand
- **テスト**: Jest + React Testing Library
- **デプロイ**: Vercel

## コードレビュー重点エリア

### 1. Next.js App Router ベストプラクティス

- Server Components をデフォルトの選択とすること
- Client Components は必要な場合のみ使用すること (`'use client'`)
- Server Components での適切なデータ取得
- `loading.tsx`, `error.tsx`, `not-found.tsx` の正しい使用

### 2. TypeScript 規約

- 厳密な型チェックが有効になっていること
- `src/types/index.ts` で適切な型定義を使用すること
- 環境変数は `src/lib/env.ts` を通して型安全であること
- オブジェクトの形状には type より interface を優先すること
- データベースモデルを扱う際は Prisma 生成型を使用すること

### 3. ファイル構造規約

```
src/
├── app/                 # Next.js App Router ページとレイアウト
├── components/          # 再利用可能な React コンポーネント
│   └── ui/             # 基本UIコンポーネント (Button, Card など)
├── hooks/              # カスタム React フック
├── lib/                # ユーティリティライブラリと設定
├── store/              # Zustand ストア
├── types/              # TypeScript 型定義
└── utils/              # ユーティリティ関数
```

### 4. コンポーネント設計パターン

- コンポーネントは単一責任であること
- 継承より合成を使用すること
- Props は interface で適切に型付けすること
- hooks を使った関数コンポーネントを優先すること
- 適切な命名規則：コンポーネントは PascalCase、関数は camelCase

### 5. 状態管理 (Zustand)

- ドメインごとに別々のストアを作成すること (userStore, appStore)
- ストアは焦点を絞り、god object を避けること
- ストアインターフェースに適切な TypeScript 型付けを使用すること
- 必要な場合のみ状態を永続化すること

### 6. データベース & API パターン

- すべてのデータベース操作に Prisma を使用すること
- API ルートで適切なエラーハンドリングを実装すること
- API エンドポイントで入力データを検証すること
- 適切な HTTP ステータスコードを使用すること
- RESTful な規約に従うこと

### 7. スタイリングガイドライン

- Tailwind CSS ユーティリティクラスを使用すること
- 必要に応じて再利用可能なコンポーネントバリアントを作成すること
- レスポンシブデザインを確保すること (`sm:`, `md:`, `lg:`, `xl:`)
- 一貫したスペーシングとカラースキームを維持すること
- テーマ値には CSS カスタムプロパティを使用すること

### 8. セキュリティベストプラクティス

- 機密の環境変数をクライアントに露出させないこと
- Supabase RLS ポリシーを使用すること
- すべてのユーザー入力を検証すること
- 適切な認証チェックを実装すること
- 本番環境では HTTPS を使用すること

### 9. テスト要件

- ユーティリティ関数の単体テストを書くこと
- React Testing Library で React コンポーネントをテストすること
- 良いテストカバレッジを維持すること (80%以上を目標)
- ハッピーパスとエラーシナリオの両方をテストすること
- 外部依存関係を適切にモックすること

### 10. パフォーマンス考慮事項

- Next.js Image コンポーネントで画像を最適化すること
- 適切なキャッシング戦略を使用すること
- クライアントサイド JavaScript を最小化すること
- 有益な場合はコード分割を実装すること
- バンドルサイズを監視すること

## よくあるコードレビューコメント

### Server vs Client コンポーネント

❌ **避けるべき**: 不要な Client Components

```tsx
'use client'; // インタラクティビティがない場合は不要
export default function StaticContent() {
  return <div>静的コンテンツ</div>;
}
```

✅ **推奨**: デフォルトで Server Components

```tsx
export default function StaticContent() {
  return <div>静的コンテンツ</div>;
}
```

### 型安全性

❌ **避けるべき**: `any` 型の使用

```tsx
const handleData = (data: any) => {
  // 型安全性が失われる
};
```

✅ **推奨**: 適切な型定義

```tsx
interface UserData {
  id: string;
  name: string;
  email: string;
}

const handleData = (data: UserData) => {
  // 型安全
};
```

### 環境変数

❌ **避けるべき**: process.env の直接使用

```tsx
const apiUrl = process.env.NEXT_PUBLIC_API_URL; // 型安全でない
```

✅ **推奨**: 集約した env 設定

```tsx
import { env } from '@/lib/env';
const apiUrl = env.NEXT_PUBLIC_API_URL; // 型安全
```

### 状態管理

❌ **避けるべき**: Prop drilling

```tsx
function Parent({ user }) {
  return <Child user={user} />;
}

function Child({ user }) {
  return <GrandChild user={user} />;
}
```

✅ **推奨**: Zustand ストア

```tsx
import { useUserStore } from '@/store/userStore';

function GrandChild() {
  const user = useUserStore((state) => state.user);
  return <div>{user.name}</div>;
}
```

## 品質チェックリスト

### PR提出前

- [ ] すべての TypeScript エラーが解決済み
- [ ] ESLint 警告が対処済み
- [ ] Prettier フォーマットが適用済み
- [ ] テストが通っている
- [ ] console.log 文がない
- [ ] 環境変数が適切に設定済み
- [ ] データベースマイグレーションがテスト済み

### コードレビューチェックリスト

- [ ] プロジェクトアーキテクチャパターンに従っている
- [ ] 適切なエラーハンドリングが実装済み
- [ ] セキュリティ考慮事項が対処済み
- [ ] パフォーマンスへの影響が考慮済み
- [ ] アクセシビリティ標準を満たしている
- [ ] モバイルレスポンシブが確認済み
- [ ] 必要に応じてドキュメントが更新済み

## 開発コマンド

```bash
# 開発
npm run dev              # 開発サーバー起動
npm run build           # DB マイグレーション付き本番ビルド
npm run build:dev       # マイグレーションなし開発ビルド

# コード品質
npm run lint            # ESLint チェック
npm run format         # Prettier フォーマット
npm run format:check   # Prettier チェック

# テスト
npm test               # テスト実行
npm run test:watch     # ウォッチモード
npm run test:coverage  # カバレッジレポート

# データベース
npm run db:generate    # Prisma クライアント生成
npm run db:migrate     # マイグレーション実行
npm run db:seed        # データベースシード
npm run db:studio      # Prisma Studio 起動
```

## Git ワークフロー

- 規約的なコミットメッセージを使用する
- main からフィーチャーブランチを作成する
- CI/CD パイプラインが通ることを確認する
- マージ前にコードレビューを依頼する
- アトミックで焦点を絞ったコミットを保つ

## 日本語でのコードレビュー指示

**重要**: すべてのコードレビューコメントは日本語で書いてください。以下のような形式で回答してください：

### 良い例

```
✅ **良い実装**
適切に Server Component と Client Component が分離されており、TypeScript の型定義も充実しています。
```

### 改善提案

```
🔄 **改善提案**
この処理はServer Componentで実行できるため、`'use client'`を削除してパフォーマンスを向上できます。

**提案する変更:**
- `'use client'` ディレクティブを削除
- データ取得をサーバーサイドで実行
- 必要な部分のみ Client Component として分離
```

### 修正が必要

```
❌ **修正必要**
環境変数がクライアントサイドに露出しています。

**修正方法:**
- サーバーサイド専用の環境変数に移動
- API Route 経由でのデータ取得に変更
- セキュリティリスクの回避
```
