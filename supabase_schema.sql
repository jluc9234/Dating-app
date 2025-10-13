-- Create profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  email TEXT,
  age INTEGER,
  bio TEXT,
  images TEXT[],
  interests TEXT[],
  is_premium BOOLEAN DEFAULT FALSE,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create date_ideas table
CREATE TABLE date_ideas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id),
  location TEXT,
  date TIMESTAMP WITH TIME ZONE,
  budget TEXT,
  dress_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create matches table
CREATE TABLE matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participants UUID[] NOT NULL,
  interest_type TEXT NOT NULL,
  interest_expires_at TIMESTAMP WITH TIME ZONE,
  date_idea_id UUID REFERENCES date_ideas(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id),
  text TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security) if needed for security
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- Add policies as per your security needs
