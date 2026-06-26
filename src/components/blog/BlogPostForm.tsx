import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { BlogPost, BlogPostFormData } from "@/types/blog";
import { useCreateBlogPost, useUpdateBlogPost, useUpdateBlogPostSilent, useCreateBlogPostSilent } from "@/hooks/useBlogPosts";
import { useAutoSave } from "@/hooks/useAutoSave";
import FilledButton from "@/components/FilledButton";
import OutlineButton from "@/components/OutlineButton";
import AutoSaveIndicator from "@/components/admin/AutoSaveIndicator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import RichTextEditor from "./RichTextEditor";
import ImageUpload from "./ImageUpload";
import GalleryUpload from "./GalleryUpload";
import RelatedPostsSelect from "./RelatedPostsSelect";
import AuthorSelect from "./AuthorSelect";
import { CircleNotch } from "@phosphor-icons/react";

interface BlogPostFormProps {
  post?: BlogPost | null;
}

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

const BlogPostForm = ({ post }: BlogPostFormProps) => {
  const navigate = useNavigate();
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();
  const updatePostSilent = useUpdateBlogPostSilent();
  const createPostSilent = useCreateBlogPostSilent();

  const [draftId, setDraftId] = useState<string | null>(null);
  const [formData, setFormData] = useState<BlogPostFormData>({
    title: "",
    slug: "",
    thumbnail_url: null,
    logo_url: null,
    brief_intro: "",
    published_date: new Date().toISOString().split("T")[0],
    author_id: null,
    read_time: 5,
    gallery: [],
    content: "",
    related_posts: [],
    is_published: false,
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        slug: post.slug,
        thumbnail_url: post.thumbnail_url,
        logo_url: post.logo_url,
        brief_intro: post.brief_intro || "",
        published_date: post.published_date || new Date().toISOString().split("T")[0],
        author_id: post.author_id,
        read_time: post.read_time || 5,
        gallery: post.gallery || [],
        content: post.content || "",
        related_posts: post.related_posts || [],
        is_published: post.is_published,
      });
    }
  }, [post]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: post ? prev.slug : generateSlug(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.thumbnail_url) {
      alert("Thumbnail is required");
      return;
    }
    if (!formData.brief_intro.trim()) {
      alert("Brief intro is required");
      return;
    }
    if (!formData.author_id) {
      alert("Author is required");
      return;
    }
    if (!formData.content.trim()) {
      alert("Content is required");
      return;
    }

    const currentId = post?.id || draftId;

    if (currentId) {
      await updatePost.mutateAsync({ id: currentId, post: formData });
    } else {
      await createPost.mutateAsync(formData);
    }

    navigate("/admin/post");
  };

  const isLoading = createPost.isPending || updatePost.isPending;

  const handleAutoSave = useCallback(async (data: BlogPostFormData) => {
    const currentId = post?.id || draftId;

    if (currentId) {
      await updatePostSilent.mutateAsync({ id: currentId, post: data });
    } else {
      const created = await createPostSilent.mutateAsync(data);
      setDraftId(created.id);
    }
  }, [post, draftId, updatePostSilent, createPostSilent]);

  const { status: autoSaveStatus, lastSaved } = useAutoSave({
    data: formData,
    onSave: handleAutoSave,
    enabled: true,
    debounceMs: 2000,
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex justify-end">
        <AutoSaveIndicator status={autoSaveStatus} lastSaved={lastSaved} />
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={handleTitleChange}
          placeholder="Enter post title"
          required
        />
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <Label htmlFor="slug">Slug *</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
          placeholder="url-friendly-slug"
          required
        />
      </div>

      {/* Thumbnail */}
      <div className="space-y-2">
        <Label>Thumbnail *</Label>
        <ImageUpload
          value={formData.thumbnail_url}
          onChange={(url) => setFormData((prev) => ({ ...prev, thumbnail_url: url }))}
        />
      </div>

      {/* Logo (Optional) */}
      <div className="space-y-2">
        <Label>Logo (optional)</Label>
        <ImageUpload
          value={formData.logo_url}
          onChange={(url) => setFormData((prev) => ({ ...prev, logo_url: url }))}
          folder="logos"
        />
        <p className="text-body-small text-neutral-08">
          If provided, this logo will be displayed centered on the post card thumbnail.
        </p>
      </div>

      {/* Brief Intro */}
      <div className="space-y-2">
        <Label htmlFor="brief_intro">Brief intro *</Label>
        <Textarea
          id="brief_intro"
          value={formData.brief_intro}
          onChange={(e) => setFormData((prev) => ({ ...prev, brief_intro: e.target.value }))}
          placeholder="A short description of the post"
          rows={3}
          required
        />
      </div>

      {/* Meta Fields Row */}
      <div className="grid grid-cols-1 tablet:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label>Author *</Label>
          <AuthorSelect
            value={formData.author_id}
            onChange={(id) => setFormData((prev) => ({ ...prev, author_id: id }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="published_date">Published date</Label>
          <Input
            id="published_date"
            type="date"
            value={formData.published_date}
            onChange={(e) => setFormData((prev) => ({ ...prev, published_date: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="read_time">Read time (minutes)</Label>
          <Input
            id="read_time"
            type="number"
            min="1"
            value={formData.read_time}
            onChange={(e) => setFormData((prev) => ({ ...prev, read_time: parseInt(e.target.value) || 5 }))}
          />
        </div>
      </div>

      {/* Gallery */}
      <div className="space-y-2">
        <Label>Gallery</Label>
        <GalleryUpload
          value={formData.gallery}
          onChange={(urls) => setFormData((prev) => ({ ...prev, gallery: urls }))}
        />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Label>Content *</Label>
        <RichTextEditor
          content={formData.content}
          onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
        />
      </div>

      {/* Related Posts */}
      <div className="space-y-2">
        <Label>Related posts</Label>
        <RelatedPostsSelect
          value={formData.related_posts}
          onChange={(ids) => setFormData((prev) => ({ ...prev, related_posts: ids }))}
          currentPostId={post?.id}
        />
      </div>

      {/* Published Toggle */}
      <div className="flex items-center gap-3">
        <Switch
          id="is_published"
          checked={formData.is_published}
          onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_published: checked }))}
        />
        <Label htmlFor="is_published">Published</Label>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4 pt-4">
        <FilledButton type="submit" disabled={isLoading} showArrow={false}>
          {isLoading ? (
            <CircleNotch size={16} className="animate-spin" />
          ) : post ? (
            "Update post"
          ) : (
            "Create post"
          )}
        </FilledButton>
        <OutlineButton onClick={() => navigate("/admin/post")}>
          Cancel
        </OutlineButton>
      </div>
    </form>
  );
};

export default BlogPostForm;