-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  thumbnail_url TEXT,
  brief_intro TEXT,
  published_date DATE DEFAULT CURRENT_DATE,
  author TEXT NOT NULL DEFAULT 'Admin',
  read_time INTEGER DEFAULT 5,
  gallery TEXT[] DEFAULT '{}',
  content TEXT DEFAULT '',
  related_posts UUID[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Public can read published posts
CREATE POLICY "Anyone can read published posts" 
ON public.blog_posts 
FOR SELECT 
USING (is_published = true);

-- Authenticated users can manage all posts (for admin)
CREATE POLICY "Authenticated users can insert posts" 
ON public.blog_posts 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update posts" 
ON public.blog_posts 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete posts" 
ON public.blog_posts 
FOR DELETE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can read all posts" 
ON public.blog_posts 
FOR SELECT 
TO authenticated
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true);

-- Storage policies for blog images
CREATE POLICY "Anyone can view blog images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can update blog images" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can delete blog images" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id = 'blog-images');