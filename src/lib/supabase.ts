/**
 * Supabase クライアント設定
 * サーバーサイドとクライアントサイドの両方に対応
 */

import { createClient } from '@supabase/supabase-js';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { env } from './env';

// クライアントサイド用Supabaseクライアント
export const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * サーバーコンポーネント用Supabaseクライアント
 * Cookie-based認証に対応
 */
export const createServerSupabaseClient = () => {
  const cookieStore = cookies();

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // SSR環境でのエラーハンドリング
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            // SSR環境でのエラーハンドリング
          }
        },
      },
    }
  );
};
