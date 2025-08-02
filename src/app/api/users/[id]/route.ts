import { NextRequest, NextResponse } from 'next/server';
import type { User, ApiResponse } from '@/types';

// Mock users data (in a real app, this would come from a database)
const mockUsers: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    name: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    email: 'jane@example.com',
    name: 'Jane Smith',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const user = mockUsers.find((u) => u.id === id);

    if (!user) {
      const response: ApiResponse = {
        success: false,
        error: 'User not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<User> = {
      success: true,
      data: user,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching user:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const userIndex = mockUsers.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      const response: ApiResponse = {
        success: false,
        error: 'User not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Update user
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...body,
      updatedAt: new Date(),
    };

    const response: ApiResponse<User> = {
      success: true,
      data: mockUsers[userIndex],
      message: 'User updated successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating user:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const userIndex = mockUsers.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      const response: ApiResponse = {
        success: false,
        error: 'User not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Remove user
    mockUsers.splice(userIndex, 1);

    const response: ApiResponse = {
      success: true,
      message: 'User deleted successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error deleting user:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error',
    };
    return NextResponse.json(response, { status: 500 });
  }
}