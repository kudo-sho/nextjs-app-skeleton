# API仕様

NextJS App SkeletonのAPIエンドポイントの詳細仕様について説明します。

## 概要

このAPIは RESTful な設計に基づいており、JSON形式でデータをやり取りします。全てのレスポンスは統一された形式で返されます。

### 基本情報

- **ベースURL**: `http://localhost:3000/api` (開発環境)
- **データ形式**: JSON
- **文字エンコーディング**: UTF-8
- **HTTPメソッド**: GET, POST, PUT, DELETE

### 統一レスポンス形式

```typescript
interface ApiResponse<T = any> {
  success: boolean; // 処理成功フラグ
  data?: T; // レスポンスデータ（成功時）
  error?: string; // エラーメッセージ（失敗時）
  message?: string; // 追加メッセージ
}

// ページネーション対応レスポンス
interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number; // 現在のページ番号
    limit: number; // 1ページあたりの表示件数
    total: number; // 全体の件数
    pages: number; // 総ページ数
  };
}
```

## エンドポイント一覧

### ヘルスチェック

#### GET /api/health

サーバーの稼働状況を確認します。

**リクエスト:**

```bash
GET /api/health
```

**レスポンス:**

```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600
}
```

**用途:**

- ロードバランサーのヘルスチェック
- 監視システムでの稼働確認
- CI/CDパイプラインでのサーバー確認

---

### ユーザー管理

#### GET /api/users

ユーザー一覧を取得します。

**リクエスト:**

```bash
GET /api/users?page=1&limit=10&search=john
```

**クエリパラメータ:**
| パラメータ | 型 | 必須 | デフォルト | 説明 |
|---|---|---|---|---|
| page | number | ❌ | 1 | ページ番号 |
| limit | number | ❌ | 10 | 1ページあたりの件数 |
| search | string | ❌ | - | 名前・メールでの検索 |

**レスポンス例:**

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "email": "john@example.com",
      "name": "John Doe",
      "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "pages": 1
  }
}
```

**エラーレスポンス例:**

```json
{
  "success": false,
  "error": "Internal server error"
}
```

#### POST /api/users

新しいユーザーを作成します。

**リクエスト:**

```bash
POST /api/users
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com"
}
```

**リクエストボディ:**
| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| name | string | ✅ | ユーザー名 |
| email | string | ✅ | メールアドレス |

**レスポンス例:**

```json
{
  "success": true,
  "data": {
    "id": "3",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "User created successfully"
}
```

**エラーレスポンス例:**

```json
{
  "success": false,
  "error": "Name and email are required"
}
```

#### GET /api/users/[id]

特定のユーザーの詳細情報を取得します。

**リクエスト:**

```bash
GET /api/users/1
```

**パスパラメータ:**
| パラメータ | 型 | 説明 |
|---|---|---|
| id | string | ユーザーID |

**レスポンス例:**

```json
{
  "success": true,
  "data": {
    "id": "1",
    "email": "john@example.com",
    "name": "John Doe",
    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**エラーレスポンス例:**

```json
{
  "success": false,
  "error": "User not found"
}
```

#### PUT /api/users/[id]

既存のユーザー情報を更新します。

**リクエスト:**

```bash
PUT /api/users/1
Content-Type: application/json

{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

**リクエストボディ:**
| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| name | string | ❌ | 更新するユーザー名 |
| email | string | ❌ | 更新するメールアドレス |

**レスポンス例:**

```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T10:30:00.000Z"
  },
  "message": "User updated successfully"
}
```

#### DELETE /api/users/[id]

ユーザーを削除します。

**リクエスト:**

```bash
DELETE /api/users/1
```

**レスポンス例:**

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

## エラーハンドリング

### HTTPステータスコード

| ステータスコード | 説明                  | 使用例                     |
| ---------------- | --------------------- | -------------------------- |
| 200              | OK                    | 成功時                     |
| 201              | Created               | リソース作成成功           |
| 400              | Bad Request           | リクエストパラメータエラー |
| 404              | Not Found             | リソースが見つからない     |
| 408              | Request Timeout       | リクエストタイムアウト     |
| 500              | Internal Server Error | サーバーエラー             |

### エラーレスポンスの例

**400 Bad Request:**

```json
{
  "success": false,
  "error": "Name and email are required"
}
```

**404 Not Found:**

```json
{
  "success": false,
  "error": "User not found"
}
```

**500 Internal Server Error:**

```json
{
  "success": false,
  "error": "Internal server error"
}
```

## APIクライアントの使用例

### JavaScriptでの使用

```javascript
// APIユーティリティを使用した例
import { api } from '@/utils/api';

// ユーザー一覧取得
try {
  const response = await api.get('/api/users?page=1&limit=5');
  if (response.success) {
    console.log('Users:', response.data);
    console.log('Pagination:', response.pagination);
  }
} catch (error) {
  console.error('API Error:', error);
}

// ユーザー作成
try {
  const response = await api.post('/api/users', {
    name: 'New User',
    email: 'newuser@example.com',
  });
  if (response.success) {
    console.log('Created user:', response.data);
  }
} catch (error) {
  console.error('Creation failed:', error);
}
```

### Reactフックでの使用

```typescript
// カスタムフックの例
import { useEffect, useState } from 'react';
import { api } from '@/utils/api';
import type { User, PaginatedResponse } from '@/types';

export function useUsers(page = 1, limit = 10) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get<PaginatedResponse<User>>(
          `/api/users?page=${page}&limit=${limit}`
        );

        if (response.success) {
          setUsers(response.data || []);
          setPagination(response.pagination);
        } else {
          setError(response.error || 'Failed to fetch users');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, limit]);

  return { users, loading, error, pagination };
}
```

## セキュリティ考慮事項

### 入力検証

```typescript
// APIルートでの入力検証例
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 必須フィールドの検証
    if (!body.name || typeof body.name !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Name is required and must be a string' },
        { status: 400 }
      );
    }

    // メールアドレス形式の検証
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!body.email || !emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    // 処理続行...
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON' },
      { status: 400 }
    );
  }
}
```

### レート制限

```typescript
// レート制限の実装例（middleware.ts）
import { NextRequest, NextResponse } from 'next/server';

const rateLimitMap = new Map();

export function middleware(request: NextRequest) {
  const ip = request.ip || 'unknown';
  const now = Date.now();
  const windowStart = now - 60000; // 1分間のウィンドウ

  const requests = rateLimitMap.get(ip) || [];
  const validRequests = requests.filter((time: number) => time > windowStart);

  if (validRequests.length >= 100) {
    // 1分間に100リクエストまで
    return new NextResponse('Rate limit exceeded', { status: 429 });
  }

  rateLimitMap.set(ip, [...validRequests, now]);
  return NextResponse.next();
}
```

## 今後の拡張予定

### 認証API

- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/refresh
- GET /api/auth/me

### ファイルアップロード

- POST /api/upload
- DELETE /api/upload/[id]

### 通知システム

- GET /api/notifications
- POST /api/notifications
- PUT /api/notifications/[id]/read

詳細な実装については、各機能の開発時に仕様を追加していきます。
