-- Seed data for users table
-- This file populates the users table with sample data for development

-- Insert sample users
INSERT INTO public.users (id, email, name, avatar, created_at, updated_at) VALUES
    (
        '11111111-1111-1111-1111-111111111111',
        'john@example.com',
        'John Doe',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        '2024-01-01T00:00:00.000Z',
        '2024-01-01T00:00:00.000Z'
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'jane@example.com',
        'Jane Smith',
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        '2024-01-02T00:00:00.000Z',
        '2024-01-02T00:00:00.000Z'
    ),
    (
        '33333333-3333-3333-3333-333333333333',
        'bob@example.com',
        'Bob Johnson',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        '2024-01-03T00:00:00.000Z',
        '2024-01-03T00:00:00.000Z'
    ),
    (
        '44444444-4444-4444-4444-444444444444',
        'alice@example.com',
        'Alice Brown',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        '2024-01-04T00:00:00.000Z',
        '2024-01-04T00:00:00.000Z'
    ),
    (
        '55555555-5555-5555-5555-555555555555',
        'charlie@example.com',
        'Charlie Wilson',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        '2024-01-05T00:00:00.000Z',
        '2024-01-05T00:00:00.000Z'
    )
ON CONFLICT (email) DO NOTHING;