-- Enable Row Level Security on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own data
CREATE POLICY "Users can read own data"
ON users
FOR SELECT
USING (auth.uid()::text = id::text);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own data"
ON users
FOR UPDATE
USING (auth.uid()::text = id::text);

-- Policy: Allow insert for authenticated users
CREATE POLICY "Users can insert own data"
ON users
FOR INSERT
WITH CHECK (auth.uid()::text = id::text);
