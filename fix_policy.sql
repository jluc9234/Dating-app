-- Fix profiles policies for authenticated access
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view other profiles" ON profiles;
CREATE POLICY "Authenticated users can view profiles" ON profiles FOR SELECT USING (auth.uid() IS NOT NULL);
