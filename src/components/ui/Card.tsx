/**
 * カード型UIコンポーネント群
 * 情報をまとまった形で表示するためのコンテナコンポーネントです
 * ヘッダー、コンテンツ、フッターなどの構造を提供します
 */

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * カードのメインコンテナ
 * 角丸、境界線、影などの基本的なカードスタイルを提供します
 *
 * @example
 * <Card>
 *   <CardHeader>
 *     <CardTitle>タイトル</CardTitle>
 *   </CardHeader>
 *   <CardContent>内容</CardContent>
 * </Card>
 */
const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100', // カードの基本スタイル
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

/**
 * カードのヘッダー部分
 * タイトルや説明文を配置するためのコンテナです
 */
const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)} // 縦方向の配置とパディング
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

/**
 * カードのタイトル
 * セマンティックなh3タグを使用し、適切なタイポグラフィを適用します
 */
const CardTitle = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight', // タイトル用のタイポグラフィ
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

/**
 * カードの説明文
 * タイトルの補足説明を表示するためのコンポーネントです
 */
const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-gray-600 dark:text-gray-400', className)} // 控えめなスタイルの説明文
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

/**
 * カードのメインコンテンツ部分
 * カードの主要な内容を配置するためのコンテナです
 */
const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('p-6 pt-0', className)} // ヘッダーとの間隔を考慮したパディング
      {...props}
    />
  )
);
CardContent.displayName = 'CardContent';

/**
 * カードのフッター部分
 * アクションボタンなどを配置するためのコンテナです
 */
const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)} // 水平方向の配置
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

// 全てのカード関連コンポーネントをエクスポート
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
