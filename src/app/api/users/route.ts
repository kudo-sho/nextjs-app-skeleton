import { NextRequest, NextResponse } from 'next/server';
import type { User, ApiResponse, PaginatedResponse } from '@/types';

// Mock users data
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    // Filter users based on search
    let filteredUsers = mockUsers;
    if (search) {
      filteredUsers = mockUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    const response: PaginatedResponse<User> = {
      success: true,
      data: paginatedUsers,
      pagination: {
        page,
        limit,
        total: filteredUsers.length,
        pages: Math.ceil(filteredUsers.length / limit),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching users:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      const response: ApiResponse = {
        success: false,
        error: 'Name and email are required',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // In a real app, you would save to database
    mockUsers.push(newUser);

    const response: ApiResponse<User> = {
      success: true,
      data: newUser,
      message: 'User created successfully',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error',
    };
    return NextResponse.json(response, { status: 500 });
  }
}