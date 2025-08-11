-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create tables
CREATE TABLE IF NOT EXISTS teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  emoji TEXT NOT NULL,
  weight INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS people (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  emoji TEXT,
  bio TEXT,
  ratings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, event_id)
);

CREATE TABLE IF NOT EXISTS map_markers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  emoji TEXT,
  type TEXT,
  description TEXT,
  x NUMERIC NOT NULL,
  y NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);



CREATE TABLE IF NOT EXISTS app_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_scores_team_event ON scores(team_id, event_id);
CREATE INDEX IF NOT EXISTS idx_people_team ON people(team_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);


-- Insert default data
INSERT INTO teams (name, color) VALUES 
  ('Team Rouge', '#ef4444'),
  ('Team Bleu', '#3b82f6'),
  ('Team Vert', '#10b981');

INSERT INTO events (name, emoji, weight) VALUES 
  ('Tennis', '🎾', 1),
  ('Running', '🏃', 1),
  ('Chess', '♟️', 1);

INSERT INTO map_markers (name, emoji, type, description, x, y) VALUES 
  ('Shrek''s swamp', '🪵', 'place', 'No bread for the ogre.', 16, 20),
  ('Main house', '🏠', 'place', 'Kitchen, salon, board games.', 38, 33),
  ('Olympic pool', '🏊', 'fun', 'Sunbeds; shade after 16:00.', 35, 53),
  ('Dining hall', '🍽️', 'place', 'Group meals & briefings.', 52, 55),
  ('Bar de Magrin', '🍹', 'place', 'Aperitivo HQ.', 64, 77),
  ('Tennis court', '🎾', 'sport', 'T-E-R matches hourly.', 78, 20),
  ('Chicken land', '🐔', 'animals', 'Please close at sunset.', 86, 45),
  ('Sheep land', '🐑', 'animals', 'No bread; fresh water nearby.', 82, 60),
  ('Église Saint-Salvy', '⛪', 'place', 'Quiet zone.', 86, 85),
  ('5k start line', '🏁', 'sport', 'Clockwise loop.', 18, 47),
  ('Towards Magrin town hall', '➡️', 'direction', 'Road to village.', 18, 88);

INSERT INTO chat_messages (name, text) VALUES 
  ('System', 'Welcome to Magrin Week chat! Everyone can send messages here.');



INSERT INTO app_settings (key, value) VALUES 
  ('map_image_url', '"magrin-app-enlarged.png"'),
  ('announcement', '""')
ON CONFLICT (key) DO NOTHING;

-- Insert default admin users
INSERT INTO admin_users (email, role, name) VALUES 
  ('admin@magrin.com', 'super_admin', 'Super Admin'),
  ('tennis@magrin.com', 'tennis_admin', 'Tennis Admin'),
  ('running@magrin.com', 'running_admin', 'Running Admin'),
  ('chess@magrin.com', 'chess_admin', 'Chess Admin')
ON CONFLICT (email) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE map_markers ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to teams" ON teams FOR SELECT USING (true);
CREATE POLICY "Allow public read access to events" ON events FOR SELECT USING (true);
CREATE POLICY "Allow public read access to people" ON people FOR SELECT USING (true);
CREATE POLICY "Allow public read access to scores" ON scores FOR SELECT USING (true);
CREATE POLICY "Allow public read access to map_markers" ON map_markers FOR SELECT USING (true);
CREATE POLICY "Allow public read access to chat_messages" ON chat_messages FOR SELECT USING (true);

CREATE POLICY "Allow public read access to app_settings" ON app_settings FOR SELECT USING (true);

-- Create policies for admin write access (simplified for now)
CREATE POLICY "Allow admin write access to teams" ON teams FOR ALL USING (true);
CREATE POLICY "Allow admin write access to events" ON events FOR ALL USING (true);
CREATE POLICY "Allow admin write access to people" ON people FOR ALL USING (true);
CREATE POLICY "Allow admin write access to scores" ON scores FOR ALL USING (true);
CREATE POLICY "Allow admin write access to map_markers" ON map_markers FOR ALL USING (true);
CREATE POLICY "Allow admin write access to chat_messages" ON chat_messages FOR ALL USING (true);

-- Add specific INSERT policy for chat messages (allow anyone to insert)
CREATE POLICY "Allow public insert to chat_messages" ON chat_messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin write access to app_settings" ON app_settings FOR ALL USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for scores table
CREATE TRIGGER update_scores_updated_at BEFORE UPDATE ON scores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable real-time replication for chat messages
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
