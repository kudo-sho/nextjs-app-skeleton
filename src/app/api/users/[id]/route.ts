import { NextRequest, NextResponse } from 'next/server';
import type { User, ApiResponse } from '@/types';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;

    const supabase = await createServerSupabaseClient();

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, avatar, created_at, updated_at')
      .eq('id', id)
      .single();

    if (error || !user) {
      console.error('Supabase error:', error);
      const response: ApiResponse = {
        success: false,
        error: 'User not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const transformedUser: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at),
    };

    const response: ApiResponse<User> = {
      success: true,
      data: transformedUser,
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
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;
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

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({
        name,
        email,
        avatar,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('id, email, name, avatar, created_at, updated_at')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      const response: ApiResponse = {
        success: false,
        error:
          error.code === '23505'
            ? 'Email already exists'
            : error.code === 'PGRST116'
              ? 'User not found'
              : 'Failed to update user',
      };
      return NextResponse.json(response, {
        status:
          error.code === '23505' ? 409 : error.code === 'PGRST116' ? 404 : 500,
      });
    }

    const transformedUser: User = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      avatar: updatedUser.avatar,
      createdAt: new Date(updatedUser.created_at),
      updatedAt: new Date(updatedUser.updated_at),
    };

    const response: ApiResponse<User> = {
      success: true,
      data: transformedUser,
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
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;

    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.from('users').delete().eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      const response: ApiResponse = {
        success: false,
        error:
          error.code === 'PGRST116'
            ? 'User not found'
            : 'Failed to delete user',
      };
      return NextResponse.json(response, {
        status: error.code === 'PGRST116' ? 404 : 500,
      });
    }

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
