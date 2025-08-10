import { NextRequest, NextResponse } from 'next/server';
import type { User, ApiResponse, PaginatedResponse } from '@/types';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const supabase = await createServerSupabaseClient();

    // Build query
    let query = supabase
      .from('users')
      .select('id, email, name, avatar, created_at, updated_at', {
        count: 'exact',
      });

    // Add search filter if provided
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    // Add pagination
    const startIndex = (page - 1) * limit;
    query = query.range(startIndex, startIndex + limit - 1);

    const { data: users, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to fetch users',
      };
      return NextResponse.json(response, { status: 500 });
    }

    // Transform the data to match our User type
    const transformedUsers: User[] = (users || []).map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at),
    }));

    const response: PaginatedResponse<User> = {
      success: true,
      data: transformedUsers,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
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
    const { name, email, avatar } = body;

    if (!name || !email) {
      const response: ApiResponse = {
        success: false,
        error: 'Name and email are required',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    const { data: newUser, error } = await supabase
      .from('users')
      .insert([
        {
          name,
          email,
          avatar,
        },
      ])
      .select('id, email, name, avatar, created_at, updated_at')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      const response: ApiResponse = {
        success: false,
        error:
          error.code === '23505'
            ? 'Email already exists'
            : 'Failed to create user',
      };
      return NextResponse.json(response, {
        status: error.code === '23505' ? 409 : 500,
      });
    }

    // Transform the data to match our User type
    const transformedUser: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      avatar: newUser.avatar,
      createdAt: new Date(newUser.created_at),
      updatedAt: new Date(newUser.updated_at),
    };

    const response: ApiResponse<User> = {
      success: true,
      data: transformedUser,
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
