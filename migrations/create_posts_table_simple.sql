-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  media_url JSONB DEFAULT '[]',
  post_type VARCHAR(20) NOT NULL DEFAULT 'insights' CHECK (post_type IN ('insights', 'achievements', 'trends', 'announcements')),
  is_fundable BOOLEAN DEFAULT FALSE NOT NULL,
  likes_count INTEGER DEFAULT 0 NOT NULL,
  comments_count INTEGER DEFAULT 0 NOT NULL,
  shares_count INTEGER DEFAULT 0 NOT NULL,
  views_count INTEGER DEFAULT 0 NOT NULL,
  is_public BOOLEAN DEFAULT TRUE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_is_fundable ON posts(is_fundable);
CREATE INDEX IF NOT EXISTS idx_posts_post_type ON posts(post_type);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- Add post_id to donations table
ALTER TABLE donations ADD COLUMN IF NOT EXISTS post_id INTEGER REFERENCES posts(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_donations_post_id ON donations(post_id);
