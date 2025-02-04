-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT,
  job_title TEXT,
  industry TEXT,
  goals TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  last_login TIMESTAMP WITH TIME ZONE,
  profile_image_url TEXT,
  settings JSONB
);

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  source TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  published_date TIMESTAMP WITH TIME ZONE,
  saved_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  tags TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  status TEXT CHECK (status IN ('unread', 'reading', 'read')) DEFAULT 'unread' NOT NULL,
  importance INTEGER DEFAULT 0 NOT NULL,
  metadata JSONB,
  UNIQUE(user_id, url)
);

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  article_id UUID REFERENCES articles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  is_archived BOOLEAN DEFAULT FALSE NOT NULL,
  metadata JSONB
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT CHECK (status IN ('draft', 'review', 'published')) DEFAULT 'draft' NOT NULL,
  published_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  tags TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  seo_metadata JSONB,
  referenced_articles UUID[] DEFAULT '{}'::UUID[] NOT NULL,
  referenced_notes UUID[] DEFAULT '{}'::UUID[] NOT NULL
);

-- Create article_notes_links table
CREATE TABLE IF NOT EXISTS article_notes_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE NOT NULL,
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(article_id, note_id)
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  usage_count INTEGER DEFAULT 0 NOT NULL,
  UNIQUE(user_id, name)
);

-- Create publishing_history table
CREATE TABLE IF NOT EXISTS publishing_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL,
  status TEXT CHECK (status IN ('scheduled', 'published', 'failed')) NOT NULL,
  published_url TEXT,
  scheduled_date TIMESTAMP WITH TIME ZONE,
  published_date TIMESTAMP WITH TIME ZONE,
  metadata JSONB
);

-- Set up Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_notes_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE publishing_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own articles" ON articles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own articles" ON articles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own articles" ON articles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own articles" ON articles
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own notes" ON notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notes" ON notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes" ON notes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes" ON notes
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own blog posts" ON blog_posts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own blog posts" ON blog_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own blog posts" ON blog_posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own blog posts" ON blog_posts
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own article notes links" ON article_notes_links
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM articles WHERE id = article_id AND user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM notes WHERE id = note_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own article notes links" ON article_notes_links
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM articles WHERE id = article_id AND user_id = auth.uid()
    ) AND
    EXISTS (
      SELECT 1 FROM notes WHERE id = note_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own article notes links" ON article_notes_links
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM articles WHERE id = article_id AND user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM notes WHERE id = note_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own tags" ON tags
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tags" ON tags
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tags" ON tags
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tags" ON tags
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own publishing history" ON publishing_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM blog_posts WHERE id = blog_post_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own publishing history" ON publishing_history
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM blog_posts WHERE id = blog_post_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own publishing history" ON publishing_history
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM blog_posts WHERE id = blog_post_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own publishing history" ON publishing_history
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM blog_posts WHERE id = blog_post_id AND user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS articles_user_id_idx ON articles(user_id);
CREATE INDEX IF NOT EXISTS notes_user_id_idx ON notes(user_id);
CREATE INDEX IF NOT EXISTS notes_article_id_idx ON notes(article_id);
CREATE INDEX IF NOT EXISTS blog_posts_user_id_idx ON blog_posts(user_id);
CREATE INDEX IF NOT EXISTS article_notes_links_article_id_idx ON article_notes_links(article_id);
CREATE INDEX IF NOT EXISTS article_notes_links_note_id_idx ON article_notes_links(note_id);
CREATE INDEX IF NOT EXISTS tags_user_id_idx ON tags(user_id);
CREATE INDEX IF NOT EXISTS publishing_history_blog_post_id_idx ON publishing_history(blog_post_id);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();
