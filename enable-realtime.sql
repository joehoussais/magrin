-- Enable real-time replication for chat messages table
-- Run this in your Supabase SQL Editor

-- First, check if the publication exists
SELECT * FROM pg_publication WHERE pubname = 'supabase_realtime';

-- If it exists, add the chat_messages table to it
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;

-- Verify the table is now in the publication
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' 
AND tablename = 'chat_messages';
