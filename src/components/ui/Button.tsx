/**
 * 再利用可能なボタンコンポーネント
 * 複数のバリエーションとサイズをサポートし、ローディング状態も表示できます
 */

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * ボタンコンポーネントのプロパティ
 * 標準のボタン要素の属性に加えて、カスタムプロパティを提供します
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'; // ボタンの見た目のバリエーション
  size?: 'sm' | 'md' | 'lg'; // ボタンのサイズ
  loading?: boolean; // ローディング状態を表示するかどうか
}

/**
 * 汎用的なボタンコンポーネント
 *
 * @param variant - ボタンのスタイルバリエーション（primary, secondary, outline, ghost）
 * @param size - ボタンのサイズ（sm, md, lg）
 * @param loading - ローディング状態の表示
 * @param children - ボタンの内容
 * @param disabled - 無効状態
 * @param className - 追加のCSSクラス
 * @param ref - ボタン要素への参照
 *
 * @example
 * <Button variant="primary" size="md" loading={isSubmitting} onClick={handleSubmit}>
 *   送信
 * </Button>
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // ===== スタイル定義 =====

    /**
     * 全てのボタンに共通の基本スタイル
     * アクセシビリティとインタラクションを考慮した設定
     */
    const baseClasses =
      'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    /**
     * バリエーション別のスタイル定義
     */
    const variants = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90', // メインアクション用
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80', // サブアクション用
      outline:
        'border border-input hover:bg-accent hover:text-accent-foreground', // 枠線スタイル
      ghost: 'hover:bg-accent hover:text-accent-foreground', // 背景なしスタイル
      destructive: 'bg-red-600 text-white hover:bg-red-700', // 削除など危険な操作用
    };

    /**
     * サイズ別のスタイル定義
     */
    const sizes = {
      sm: 'h-9 px-3 text-sm', // 小サイズ
      md: 'h-10 px-4 py-2', // 中サイズ（デフォルト）
      lg: 'h-11 px-8', // 大サイズ
    };

    return (
      <button
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={disabled || loading} // ローディング中も無効化
        {...props}
      >
        {/* ローディングスピナー */}
        {loading && (
          <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

// デバッグ用の表示名を設定
Button.displayName = 'Button';

export default Button;
