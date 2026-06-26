-- Add new author_id column with foreign key reference to team_members
ALTER TABLE public.blog_posts 
ADD COLUMN author_id uuid REFERENCES public.team_members(id) ON DELETE SET NULL;

-- Drop the old author text column
ALTER TABLE public.blog_posts 
DROP COLUMN author;