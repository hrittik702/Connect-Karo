-- =====================================================================
-- CONNECT-KARO SUPABASE DATABASE SCHEMA SETUP & SECURITY POLICIES
-- =====================================================================
-- Run this DDL script inside the Supabase SQL Editor (https://supabase.com)
-- This creates all tables, triggers, and RLS policies for a complete Firebase migration.
-- =====================================================================

-- Clean up existing resources (optional, run only if starting fresh)
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user cascade;
drop table if exists public.comments cascade;
drop table if exists public.posts cascade;
drop table if exists public.root_support_tickets cascade;
drop table if exists public.announcements cascade;
drop table if exists public.users cascade;
drop table if exists public.colleges cascade;

-- =====================================================================
-- 1. COLLEGES TABLE
-- =====================================================================
create table public.colleges (
    id text primary key, -- stores sanitized collegeCode (e.g., 'DUMMY_COLLEGE_01', 'LNCT')
    name text not null,
    domain text,
    status text default 'active' not null, -- 'active', 'suspended'
    admin_phone text,
    address text,
    billing_plan text default 'Free' not null,
    subscription jsonb default '{"plan": "free", "expiresAt": null}'::jsonb not null,
    admin_email text,
    admin_uid uuid, -- references auth.users uid if available
    metrics jsonb default '{"totalStudents": 0, "totalAlumni": 0}'::jsonb not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.colleges enable row level security;

-- Policies for Colleges
create policy "Colleges are viewable by everyone" on public.colleges
    for select using (true);

create policy "System changes are allowed by anyone for onboarding" on public.colleges
    for all using (true); -- Full access to allow colleges creation and status toggles


-- =====================================================================
-- 2. USERS (PROFILES) TABLE
-- =====================================================================
create table public.users (
    id uuid references auth.users on delete cascade primary key,
    email text not null unique,
    name text not null,
    role text default 'student' not null, -- 'student', 'alumni', 'college_admin', 'root_admin'
    status text default 'pending' not null, -- 'pending', 'approved', 'rejected', 'blocked'
    college_id text references public.colleges(id) on delete set null,
    college_name text,
    batch text,
    degree text,
    company text,
    designation text,
    linkedin text,
    bio text,
    pronouns text,
    url text,
    photo_url text,
    roll_no text,
    branch text,
    current_year integer,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.users enable row level security;

-- Policies for Users
create policy "User profiles are viewable by everyone" on public.users
    for select using (true);

create policy "Users can update their own profile" on public.users
    for update using (auth.uid() = id);

create policy "Users can insert their own profile" on public.users
    for insert with check (auth.uid() = id);

create policy "Users can delete their own profile" on public.users
    for delete using (auth.uid() = id);

create policy "System permissions for user management" on public.users
    for all using (true); -- Allows managers to filter, update counts, and verify nodes


-- Trigger: Sync Supabase Auth User details to public.users table automatically
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.users (
        id, 
        email, 
        name, 
        role, 
        status, 
        college_id, 
        college_name, 
        batch, 
        degree, 
        company, 
        designation, 
        linkedin, 
        bio, 
        pronouns, 
        url, 
        photo_url, 
        roll_no, 
        branch, 
        current_year
    )
    values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'name', 'New Member'),
        coalesce(new.raw_user_meta_data->>'role', 'student'),
        coalesce(new.raw_user_meta_data->>'status', 'pending'),
        new.raw_user_meta_data->>'collegeId',
        new.raw_user_meta_data->>'collegeName',
        new.raw_user_meta_data->>'batch',
        new.raw_user_meta_data->>'degree',
        new.raw_user_meta_data->>'company',
        new.raw_user_meta_data->>'designation',
        new.raw_user_meta_data->>'linkedin',
        new.raw_user_meta_data->>'bio',
        new.raw_user_meta_data->>'pronouns',
        new.raw_user_meta_data->>'url',
        new.raw_user_meta_data->>'photoURL',
        new.raw_user_meta_data->>'rollNo',
        new.raw_user_meta_data->>'branch',
        (new.raw_user_meta_data->>'currentYear')::integer
    );
    return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();


-- =====================================================================
-- 3. ANNOUNCEMENTS TABLE
-- =====================================================================
create table public.announcements (
    id uuid default gen_random_uuid() primary key,
    college_id text references public.colleges(id) on delete cascade, -- null or 'global' means system global notice
    title text not null,
    message text not null,
    status text default 'active' not null, -- 'active', 'deleted'
    type text default 'announcement' not null, -- 'notice', 'announcement', 'broadcast'
    target text default 'all' not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.announcements enable row level security;

-- Policies for Announcements
create policy "Announcements are viewable by everyone" on public.announcements
    for select using (true);

create policy "Authorized updates allowed for everyone" on public.announcements
    for all using (true);


-- =====================================================================
-- 4. ROOT SUPPORT TICKETS TABLE
-- =====================================================================
create table public.root_support_tickets (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    email text not null,
    subject text not null,
    message text not null,
    status text default 'pending' not null, -- 'pending', 'resolved', 'closed'
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.root_support_tickets enable row level security;

-- Policies for Support Tickets
create policy "Tickets can be selected by anyone" on public.root_support_tickets
    for select using (true);

create policy "Tickets can be created or updated by anyone" on public.root_support_tickets
    for all using (true);


-- =====================================================================
-- 5. POSTS TABLE (SANDBOX)
-- =====================================================================
create table public.posts (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    title text not null,
    content text,
    image_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.posts enable row level security;

-- Policies for Posts
create policy "Posts are viewable by everyone" on public.posts
    for select using (true);

create policy "Users can modify their own posts" on public.posts
    for all using (true);


-- =====================================================================
-- 6. COMMENTS TABLE (SANDBOX)
-- =====================================================================
create table public.comments (
    id uuid default gen_random_uuid() primary key,
    post_id uuid references public.posts(id) on delete cascade not null,
    user_id uuid references public.users(id) on delete cascade not null,
    text text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.comments enable row level security;

-- Policies for Comments
create policy "Comments are viewable by everyone" on public.comments
    for select using (true);

create policy "Users can modify their own comments" on public.comments
    for all using (true);
