# デバッグガイド

このドキュメントでは、Next.js アプリケーションのデバッグ方法について説明します。

## 目次

- [クイックスタート（30秒で始める）](#クイックスタート30秒で始める)
- [デファクトスタンダード](#デファクトスタンダード)
- [デバッグの仕組み](#デバッグの仕組み)
- [基本操作](#基本操作)
- [応用：その他のデバッグ方法](#応用その他のデバッグ方法)
- [トラブルシューティング](#トラブルシューティング)
- [Tips](#tips)

---

## クイックスタート（30秒で始める）

### このプロジェクトの標準的な開発開始方法

**1. ブレークポイントを設定**

デバッグしたいファイルを開き、停止させたい行番号の左側をクリック（赤い点🔴が表示される）

```typescript
// 例：API Route
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url); // ← ここにブレークポイント
  const category = searchParams.get('category');
  // ...
}

// 例：Reactコンポーネント
export function AuthProvider({ children }: AuthProviderProps) {
  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      // ← ここにも
      email,
      password,
    });
    // ...
  }, []);
}
```

**2. デバッグ起動**

VSCodeのデバッグパネルから起動します：

1. VSCodeの左サイドバーで「実行とデバッグ」アイコン（▶️虫マーク）をクリック
2. 上部のドロップダウンで「**Next.js: debug full stack**」を選択
3. 緑の再生ボタン（▶️）をクリック、または `F5` キーを押す

> **初回起動時**: `F5` キーを押すと構成選択ダイアログが表示されます。その場合は「**Next.js: debug full stack**」を選択してください。

**3. 開発を始める**

- サーバーが起動
- Chromeブラウザが自動で開く
- API・フロントエンド両方でブレークポイントが動作

**これだけです！** 🎉

---

## デファクトスタンダード

### このプロジェクトの推奨開発方法

```
開発開始 = VSCodeデバッグパネルから「debug full stack」を起動
```

#### なぜこの方法なのか？

✅ **ワンアクション**: デバッグパネルから1回クリックで開発開始
✅ **全てデバッグ可能**: API・フロントエンド両方
✅ **シンプル**: `npm run dev` を覚える必要がない
✅ **チーム統一**: 全員が同じ方法を使う

#### 起動方法の詳細

**推奨手順:**

1. VSCodeの左サイドバー「実行とデバッグ」パネルを開く
2. 上部ドロップダウンで「**Next.js: debug full stack**」を選択
3. 緑の再生ボタン（▶️）をクリック、または `F5` キーを押す

> **注意**: `F5` キーは「最後に実行したデバッグ構成」を実行します。初回起動時や別の構成を使った後は、構成選択ダイアログが表示されるので「**Next.js: debug full stack**」を選択してください。

#### 従来の方法との比較

**従来:**

```bash
npm run dev  # サーバー起動
# → デバッグするには別途設定が必要
```

**このプロジェクトの標準:**

```
VSCodeデバッグパネルから起動  # サーバー起動 + デバッグ準備完了
```

---

## デバッグの仕組み

### デバッグ起動で何が起こるのか？

```
あなた → デバッグパネルから「debug full stack」起動
    ↓
VSCodeが複合デバッグ構成を実行
    ↓
├─ サーバーサイド: npm run dev でNext.jsサーバー起動
│  └─ VSCodeが自動でデバッグモードを有効化
│     └─ API Routesでブレークポイントが動作 ✨
│
└─ クライアントサイド: Chromeブラウザを自動で開く
   └─ Chrome DevToolsと連携
      └─ Reactコンポーネントでブレークポイントが動作 ✨
```

### 技術的な詳細

**サーバーサイド:**

- VSCodeの `node-terminal` タイプが統合ターミナルでNode.jsプロセスを監視
- `--inspect` フラグなしでも自動的にデバッグを有効化
- `src/app/api/**/route.ts` などのサーバーコードでブレークポイントが動作

**クライアントサイド:**

- Chrome DevTools Protocolで接続
- `'use client'` のあるReactコンポーネントでブレークポイントが動作
- ソースマップを通じてTypeScriptコードをデバッグ

---

## 基本操作

### ブレークポイントの設定

**どこに置けるか？**

| ファイルの種類    | 例                                             | 止まる？          |
| ----------------- | ---------------------------------------------- | ----------------- |
| API Routes        | `src/app/api/**/route.ts`                      | ✅ サーバー側     |
| Server Components | `src/app/**/page.tsx` (`'use client'`なし)     | ✅ サーバー側     |
| Server Actions    | `'use server'` のある関数                      | ✅ サーバー側     |
| Client Components | `'use client'` のあるコンポーネント            | ✅ クライアント側 |
| Context           | `src/contexts/AuthContext.tsx`                 | ✅ クライアント側 |
| Hooks             | `src/hooks/**/*.ts` (`'use client'`ファイル内) | ✅ クライアント側 |

**ブレークポイントの種類:**

1. **通常のブレークポイント**: 行番号の左側をクリック（赤🔴）
2. **条件付きブレークポイント**: 右クリック → 「ブレークポイントの編集」
   ```javascript
   page > 5; // pageが5より大きい場合のみ停止
   email === 'admin@example.com'; // 特定条件のみ
   ```
3. **ログポイント**: 停止せずにログを出力
   ```javascript
   {page}, {limit}, {search}  // ブレークせずに変数をログ出力
   ```

### デバッグ中の操作

**キーボードショートカット:**

- `F5`: 続行（次のブレークポイントまで実行）
- `F10`: ステップオーバー（次の行へ）
- `F11`: ステップイン（関数内部へ）
- `Shift+F11`: ステップアウト（関数から出る）
- `Shift+F5`: デバッグ停止

**変数の確認:**

- 左サイドバーの「変数」パネル
- マウスホバーで即座に表示
- デバッグコンソールで式を評価
  ```javascript
  // デバッグコンソールで実行
  searchParams.get('page');
  users.filter((u) => u.email.includes('test'));
  ```

**コールスタック:**

- 関数の呼び出し履歴を確認
- クリックで該当箇所にジャンプ

### APIのテスト方法

デバッグ中にAPIを呼び出す方法：

**1. curlコマンド**

```bash
# GET
curl http://localhost:3000/api/products

# POST
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}'
```

**2. ブラウザ**

```
http://localhost:3000/api/products?category=バーガー
```

**3. VSCode REST Client拡張機能**

`.http` ファイルを作成：

```http
### Get Products
GET http://localhost:3000/api/products?category=バーガー

### Create User
POST http://localhost:3000/api/users
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com"
}
```

---

## 応用：その他のデバッグ方法

標準の「debug full stack」以外にも、特殊なケース向けの方法があります。

### 利用可能な設定

| 設定名                  | 用途                       | いつ使う？                 |
| ----------------------- | -------------------------- | -------------------------- |
| **debug full stack** ⭐ | サーバー＋クライアント両方 | **標準・推奨**             |
| debug server-side       | API Routesのみ             | ブラウザを開きたくない時   |
| debug client-side       | Reactコンポーネントのみ    | サーバーが既に起動済みの時 |
| attach to dev:debug     | 外部ターミナルのサーバー   | 外部ターミナルを使いたい時 |

### 方法1: サーバーサイドのみデバッグ

ブラウザを開かずに、API Routesだけデバッグしたい場合：

1. デバッグパネルで「**Next.js: debug server-side**」を選択して起動
2. curlやブラウザで手動でAPIを呼び出す

### 方法2: クライアントサイドのみデバッグ

既にサーバーが起動している状態で、Reactコンポーネントだけデバッグしたい場合：

1. 別ターミナルで `npm run dev` を実行
2. デバッグパネルで「**Next.js: debug client-side**」を選択して起動
3. Chromeが自動で開く

### 方法3: 外部ターミナルでサーバー起動してアタッチ

外部ターミナルを使いたい場合や、複数プロジェクトでポート競合を避けたい場合：

**手順：**

1. **ターミナルでデバッグモード起動**

   ```bash
   npm run dev:debug
   ```

   以下のメッセージが表示されることを確認：

   ```
   Debugger listening on ws://127.0.0.1:9230/...  ← メインプロセス
   Debugger listening on ws://127.0.0.1:9231/...  ← ルーターサーバー（API Routes用）
   the Next.js router server should be inspected at 9231.
   ```

2. **VSCodeでアタッチ**
   - デバッグパネルで「**Next.js: attach to dev:debug**」を選択して起動
   - ブレークポイントが**グレー◯ → 赤🔴**に変わることを確認

**仕組み：**

- サーバーが明示的にデバッグポート（9230 & 9231）を開く
- VSCodeが9231番ポート（API Routes用）に接続
- サーバーの再起動時も自動で再アタッチ

**npmコマンドの違い：**

| コマンド            | デバッグポート | いつ使う                             |
| ------------------- | -------------- | ------------------------------------ |
| `npm run dev`       | なし           | 通常の開発（VSCodeが自動デバッグ化） |
| `npm run dev:debug` | 9230 & 9231    | 外部ターミナルからアタッチする時     |

---

## トラブルシューティング

### ブレークポイントがグレー◯（白抜き）のまま

**原因:** デバッガーが接続されていません

**対処法:**

1. `F5` でデバッグを開始しましたか？
2. VSCode上部にオレンジ色のデバッグツールバーが表示されていますか？
3. サーバーが完全に起動してから（"Ready"メッセージ確認後）APIを呼び出してください

### ブレークポイントで停止しない

**チェックリスト:**

1. **正しいデバッガーを使っていますか？**
   - API Routes → サーバーサイドデバッガー（`F5` でOK）
   - `'use client'` のファイル → クライアントサイドデバッガー（`F5` でOK）

2. **サーバーが起動していますか？**
   - ターミナルで "Ready" メッセージを確認

3. **ブレークポイントが赤🔴ですか？**
   - グレー◯の場合はデバッガーが接続されていません

### デバッグが開始されない

**対処法:**

1. **デバッグ構成を確認**
   - 左サイドバー「実行とデバッグ」を開く
   - 上部のドロップダウンで「**Next.js: debug full stack**」が選択されているか確認
   - 選択後、緑の再生ボタン（▶️）をクリック

2. **launch.jsonを確認**
   - `.vscode/launch.json` が存在するか確認
   - 破損している場合は再作成

### ポートが使用中のエラー

```bash
# 既存のプロセスを確認
lsof -i :3000

# プロセスを終了
kill -9 <PID>
```

### デバッグが遅い

Turbopackが原因の場合：

```bash
# package.jsonのdevスクリプトから--turbopackを削除
"dev": "prisma generate && next dev"
```

### attach to dev:debug でアタッチできない

**確認項目:**

1. **サーバーが `dev:debug` で起動されているか**

   ```bash
   # 以下のメッセージが表示されているか確認
   Debugger listening on ws://127.0.0.1:9230/...
   Debugger listening on ws://127.0.0.1:9231/...
   ```

2. **ポートが他のプロセスに使われている**

   ```bash
   # ポート使用状況を確認
   lsof -i :9230
   lsof -i :9231

   # 競合しているプロセスを停止
   kill -9 <PID>
   ```

---

## Tips

### console.logも活用しよう

ブレークポイントと併用すると便利です：

```typescript
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  console.log('📝 Request params:', {
    page: searchParams.get('page'),
    limit: searchParams.get('limit'),
    search: searchParams.get('search'),
  });
  // ... 処理
}
```

**出力先:**

- **サーバーサイド**: VSCodeのターミナル
- **クライアントサイド**: ブラウザのDevToolsコンソール

### デバッグ不要な時は？

デバッグが不要な場合は、通常通り `npm run dev` でOKです：

```bash
npm run dev  # デバッグなしで起動
```

ただし、チーム開発では **常にデバッグモードで起動することを推奨** します。必要な時にすぐデバッグできます。

### 開発環境と本番環境の違い

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

---

## 関連ドキュメント

- [開発ガイド](./development.md) - 開発ワークフロー全体
- [Next.js Debugging Documentation](https://nextjs.org/docs/app/building-your-application/configuring/debugging)
- [VSCode Debugging](https://code.visualstudio.com/docs/editor/debugging)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
