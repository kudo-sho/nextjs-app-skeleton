/**
 * アプリケーション全体で使用される共通ユーティリティ関数
 * 再利用可能な便利な関数を提供します
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind CSSクラスを効率的に結合するユーティリティ関数
 * clsxとtailwind-mergeを組み合わせて、条件付きクラスと重複クラスの解決を行います
 * 
 * @param inputs - 結合するクラス名の配列
 * @returns 結合されたクラス名文字列
 * 
 * @example
 * cn('px-4 py-2', isActive && 'bg-blue-500', 'text-white')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 日付を読みやすい形式でフォーマットする関数
 * 
 * @param date - フォーマットする日付（DateオブジェクトまたはISO文字列）
 * @returns フォーマットされた日付文字列（例: "January 1, 2024"）
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

/**
 * 相対時間を表示する関数（例: "2時間前"）
 * SNSやチャットアプリでよく使われる時間表示形式です
 * 
 * @param date - 基準となる日付
 * @returns 相対時間の文字列
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  // 1分未満の場合
  if (diffInSeconds < 60) return 'just now';
  // 1時間未満の場合
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  // 1日未満の場合
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  // 1ヶ月未満の場合
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  // それ以上古い場合は通常の日付フォーマットを使用
  return formatDate(date);
}

/**
 * 関数の実行を遅延させるデバウンス関数
 * 検索入力やリサイズイベントなどの頻繁に発火するイベントに使用します
 * 
 * @param func - デバウンスする関数
 * @param wait - 遅延時間（ミリ秒）
 * @returns デバウンスされた関数
 * 
 * @example
 * const debouncedSearch = debounce((query: string) => {
 *   // 検索処理
 * }, 300);
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * 文字列をURL安全なスラッグに変換する関数
 * ブログ記事のURLやファイル名の生成に使用します
 * 
 * @param text - スラッグ化する文字列
 * @returns URL安全なスラッグ文字列
 * 
 * @example
 * slugify("Hello World!") // "hello-world"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase() // 小文字に変換
    .replace(/[^\w\s-]/g, '') // 英数字、空白、ハイフン以外を削除
    .replace(/[\s_-]+/g, '-') // 空白とアンダースコアをハイフンに変換
    .replace(/^-+|-+$/g, ''); // 先頭と末尾のハイフンを削除
}