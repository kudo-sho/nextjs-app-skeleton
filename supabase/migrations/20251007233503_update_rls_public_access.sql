-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;

-- Create new policy: Anyone can do anything (public access)
-- This is temporary until authentication is implemented
CREATE POLICY "Public access - full CRUD"
ON users
FOR ALL
USING (true)
WITH CHECK (true);

-- Note: When authentication is implemented in the future,
-- replace this policy with proper role-based policies like:
--
-- FOR SELECT: USING (true) -- Anyone can read
-- FOR INSERT: WITH CHECK (auth.role() = 'authenticated')
-- FOR UPDATE: USING (auth.uid()::text = id::text)
-- FOR DELETE: USING (auth.uid()::text = id::text)
