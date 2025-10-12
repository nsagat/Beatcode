-- prefering pgcrypto for UUID generation bc supabase
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  leetcode_id TEXT
);

-- ROOMS
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  created_by UUID REFERENCES users(id) ON DELETE CASCADE
);

-- ROOM MEMBERS
CREATE TABLE IF NOT EXISTS room_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (room_id, user_id)
);

-- PROGRESS
CREATE TABLE IF NOT EXISTS progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  problem_slug TEXT NOT NULL,
  solved_at TIMESTAMPTZ DEFAULT NOW(),
  source TEXT CHECK (source IN ('leetcode-daily', 'custom')),
  room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
  UNIQUE (user_id, problem_slug, room_id)
);
/*
-- Enable RLS where you want policies to apply
ALTER TABLE users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms         ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_members  ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress      ENABLE ROW LEVEL SECURITY;


-- Users can read/update own profile
DROP POLICY IF EXISTS "Users can view own profile"   ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Rooms: view only if member; create/update if creator
DROP POLICY IF EXISTS "Users can view joined rooms"   ON rooms;
DROP POLICY IF EXISTS "Users can create rooms"        ON rooms;
DROP POLICY IF EXISTS "Room creators can update rooms" ON rooms;

CREATE POLICY "Users can view joined rooms"
  ON rooms FOR SELECT
  USING (
    id IN (SELECT room_id FROM room_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create rooms"
  ON rooms FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Room creators can update rooms"
  ON rooms FOR UPDATE
  USING (auth.uid() = created_by);

-- Room members: view/insert/delete scoped to self
DROP POLICY IF EXISTS "Users can view room members" ON room_members;
DROP POLICY IF EXISTS "Users can join rooms"        ON room_members;
DROP POLICY IF EXISTS "Users can leave rooms"       ON room_members;

CREATE POLICY "Users can view room members"
  ON room_members FOR SELECT
  USING (
    room_id IN (
      SELECT room_id FROM room_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join rooms"
  ON room_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave rooms"
  ON room_members FOR DELETE
  USING (auth.uid() = user_id);

-- Progress: view/insert own
DROP POLICY IF EXISTS "Users can view own progress"  ON progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON progress;

CREATE POLICY "Users can view own progress"
  ON progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);
  */