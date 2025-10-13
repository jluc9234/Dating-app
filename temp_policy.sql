-- Temporarily allow anonymous select on profiles for testing
DROP POLICY IF EXISTS "Users can view other profiles" ON profiles;
CREATE POLICY "Allow all select on profiles" ON profiles FOR SELECT USING (true);
