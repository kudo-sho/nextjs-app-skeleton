/**
 * localStorage と React state を同期するカスタムフック
 * ブラウザのローカルストレージに値を永続化しながら、React の状態管理も行います
 */

import { useState } from 'react';

/**
 * 値の設定方法を表す型
 * 直接値を指定するか、前の値を受け取る関数を指定できます
 */
type SetValue<T> = T | ((val: T) => T);

/**
 * localStorage と同期する useState のような機能を提供するフック
 * 
 * @param key - localStorage のキー名
 * @param initialValue - 初期値（localStorage に値がない場合に使用）
 * @returns [現在の値, 値を更新する関数] のタプル
 * 
 * @example
 * const [name, setName] = useLocalStorage('user-name', '');
 * const [settings, setSettings] = useLocalStorage('app-settings', { theme: 'light' });
 */
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void] {
  
  /**
   * 初期値を設定するための関数
   * SSR環境での安全性を考慮し、localStorage の読み込みを行います
   */
  const [storedValue, setStoredValue] = useState<T>(() => {
    // サーバーサイドレンダリング環境では window が存在しないため初期値を返す
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      // localStorage から値を取得
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // JSON パースエラーなどが発生した場合は初期値を返す
      console.log(error);
      return initialValue;
    }
  });

  /**
   * 値を更新する関数
   * React state と localStorage の両方を同時に更新します
   * 
   * @param value - 新しい値、または前の値を受け取って新しい値を返す関数
   */
  const setValue = (value: SetValue<T>) => {
    try {
      // 関数が渡された場合は現在の値を渡して実行し、そうでなければそのまま使用
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // React state を更新
      setStoredValue(valueToStore);
      
      // localStorage に保存（ブラウザ環境でのみ実行）
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // localStorage への書き込みエラーなどをキャッチ
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;