-- Create users table for the application
-- This table stores user profile information

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS (allow all operations for now - adjust as needed)
CREATE POLICY "Users can view all profiles" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (true);

-- Create function to automatically update updated_at column
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at column
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();