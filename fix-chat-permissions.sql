-- Fix chat message permissions - run this in your Supabase SQL Editor

-- First, check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'chat_messages';

-- Drop the overly restrictive policy if it exists
DROP POLICY IF EXISTS "Allow admin write access to chat_messages" ON chat_messages;

-- Create a more permissive policy for chat messages
CREATE POLICY "Allow public access to chat_messages" ON chat_messages 
FOR ALL USING (true) WITH CHECK (true);

-- Verify the new policy
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'chat_messages';
