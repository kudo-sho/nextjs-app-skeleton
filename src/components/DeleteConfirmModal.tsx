'use client';

import { useState } from 'react';
import { api } from '@/utils/api';
import type { User } from '@/types';
import Button from './ui/Button';

interface DeleteConfirmModalProps {
  user: User;
  onConfirm: (userId: string) => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({
  user,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.delete(`/api/users/${user.id}`);

      if (response.success) {
        onConfirm(user.id);
      } else {
        setError(response.error || 'Failed to delete user');
      }
    } catch {
      setError('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Delete User
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Are you sure you want to delete <strong>{user.name}</strong>? This
          action cannot be undone.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="flex space-x-3">
          <Button
            onClick={handleDelete}
            disabled={loading}
            variant="destructive"
            className="flex-1"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
          <Button
            onClick={onCancel}
            disabled={loading}
            variant="secondary"
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
