import { useParams, Link } from "react-router-dom";
import { Plus, CircleNotch } from "@phosphor-icons/react";
import DOMPurify from "dompurify";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundStripes from "@/components/BackgroundStripes";
import BackButton from "@/components/BackButton";
import Post from "@/components/blog/Post";
import { useBlogPost, useRelatedPosts } from "@/hooks/useBlogPosts";
const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useBlogPost(slug || "");
  const { data: relatedPosts } = useRelatedPosts(post?.related_posts || []);

  const year = post?.published_date 
    ? new Date(post.published_date).getFullYear() 
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-01 flex flex-col relative">
        <BackgroundStripes />
        <Navbar />
        <main className="flex-1 flex items-center justify-center relative z-10">
          <CircleNotch size={32} className="animate-spin text-neutral-08" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-bg-01 flex flex-col relative">
        <BackgroundStripes />
        <Navbar />
        <main className="flex-1 flex items-center justify-center relative z-10">
          <p className="text-body-large text-neutral-08">Post not found</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-01 flex flex-col relative">
      <BackgroundStripes />
      <Navbar />
      <main className="flex-1 relative z-10">
        {/* Blog Page Header */}
        <div className="blog-page-header">
          <div className="container">
            {/* Blog Header */}
            <div className="flex flex-col items-start pt-20">
              {/* Back Button */}
              <BackButton goBack>Back</BackButton>

              {/* Thumbnail Wrapper */}
              <div className="w-full bg-bg-02 rounded-[24px] p-2 mt-6">
                {/* Thumbnail Image Container */}
                <div className="relative w-full aspect-[4/3] desktop:aspect-auto desktop:h-[450px] tablet:max-h-[450px] rounded-[20px] overflow-hidden">
                  <img
                    src={post.thumbnail_url || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-full object-cover opacity-0 animate-about-fade-in"
                    loading="lazy"
                    decoding="async"
                  />
                  {/* Year Badge */}
                  {year && (
                    <div className="absolute bottom-4 right-4 tablet:bottom-6 tablet:right-6 px-2 py-1 bg-overlay-01 rounded-[40px]">
                      <span className="text-body-small text-neutral-00">{year}</span>
                    </div>
                  )}
                </div>

                {/* Blog Info */}
                <div className="flex flex-col items-start gap-6 p-6 tablet:flex-row tablet:items-center tablet:justify-between tablet:gap-0 tablet:p-8 mt-2 bg-neutral-00/60 rounded-[20px]">
                  {/* Heading */}
                  <div className="flex flex-col w-full tablet:w-[68%] tablet:max-w-[650px]">
                    <h2>{post.title}</h2>
                    {post.brief_intro && (
                      <p className="text-body-large text-neutral-10 mt-4">
                        {post.brief_intro}
                      </p>
                    )}
                  </div>

                  {/* Vertical Divider */}
                  <div className="flex flex-row gap-10 tablet:flex-col tablet:gap-8">
                    {[1, 2, 3].map((i) => (
                      <Plus key={i} size={16} className="text-neutral-05" />
                    ))}
                  </div>

                  {/* Author */}
                  {post.author_name && (
                    <div className="flex flex-col">
                      <div className="w-14 h-14 rounded-[12px] overflow-hidden bg-neutral-03">
                        {post.author_photo_url ? (
                          <img
                            src={post.author_photo_url}
                            alt={post.author_name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-08 text-h5">
                            {post.author_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <span className="text-body mt-2">{post.author_name}</span>
                      {post.author_position && (
                        <span className="text-body text-neutral-10">
                          {post.author_position}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Blog Content */}
            <div className="flex flex-col items-start gap-10 py-10 px-0 tablet:px-16 desktop:px-20 max-w-[1000px] mx-auto animate-scroll-fade-in">
              {/* Content from CMS */}
              {post.content && (
                <div 
                  className="blog-prose max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: DOMPurify.sanitize(post.content, {
                      ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'img', 'br', 'blockquote', 'code', 'pre'],
                      ALLOWED_ATTR: ['href', 'src', 'alt', 'target', 'rel', 'class'],
                      ALLOW_DATA_ATTR: false
                    })
                  }}
                />
              )}

              {/* Gallery */}
              {post.gallery && post.gallery.length > 0 && (
                <div className="flex flex-row flex-wrap gap-2 w-full">
                  {post.gallery.map((imageUrl, index) => (
                    <div
                      key={index}
                      className="flex-1 min-w-[300px] tablet:min-w-[400px] tablet:min-h-[300px] max-h-[400px] tablet:max-h-[550px] aspect-[4/3]"
                    >
                      <img
                        src={imageUrl}
                        alt={`Gallery image ${index + 1}`}
                        className="w-full h-full object-cover rounded-[24px]"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* More Posts Section */}
        {post.related_posts && post.related_posts.length > 0 && (
          <div className="section">
            <div className="container">
              {/* Header */}
              <div className="flex flex-col items-center gap-4 text-center w-full desktop:w-[66%] max-w-[600px] mx-auto">
                <h3>More insights to explore</h3>
                <p className="text-body text-neutral-10">
                  Discover additional case studies and strategies to help your business grow and innovate faster.
                </p>
              </div>

              {/* Post Wrap */}
              <div className="bg-bg-02 rounded-[24px] p-2 mt-10 animate-scroll-fade-in">
                <div className="grid grid-cols-1 tablet:grid-cols-2 gap-2">
                  {relatedPosts?.map((relatedPost) => (
                    <Link 
                      key={relatedPost.id} 
                      to={`/post/${relatedPost.slug}`}
                    >
                      <Post
                        thumbnailUrl={relatedPost.thumbnail_url}
                        logoUrl={relatedPost.logo_url}
                        publishedDate={relatedPost.published_date}
                        title={relatedPost.title}
                        briefIntro={relatedPost.brief_intro}
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
