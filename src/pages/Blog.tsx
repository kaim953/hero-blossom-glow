import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundStripes from "@/components/BackgroundStripes";
import PageHeader from "@/components/PageHeader";
import Post from "@/components/blog/Post";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import useInView from "@/hooks/useInView";

const Blog = () => {
  const { data: posts } = useBlogPosts(true);
  const { ref: postsRef, isInView: postsInView } = useInView({ threshold: 0.1 });

  return (
    <div className="min-h-screen bg-bg-01 flex flex-col relative">
      <BackgroundStripes />
      <Navbar />
      <main className="flex-1 relative z-10">
        {/* Page Header */}
        <div className="page-header">
          <div className="section">
            <div className="container">
              {/* Header */}
              <div className="flex flex-col items-center">
                <PageHeader
                  heading="Success stories from fast-growing startups"
                  subheading="Explore how Grovia has helped startups and growing businesses overcome challenges, scale faster, and build high-performing teams."
                />
              </div>

              {/* Posts */}
              <div ref={postsRef} className="bg-bg-02 rounded-[24px] p-2 mt-16">
                {posts && posts.length > 0 ? (
                  <div className="grid grid-cols-1 tablet:grid-cols-2 gap-2">
                    {posts.map((post) => (
                      <Link 
                        key={post.id} 
                        to={`/post/${post.slug}`}
                        className={postsInView ? 'animate-scroll-fade-in' : 'opacity-0'}
                      >
                        <Post
                          thumbnailUrl={post.thumbnail_url}
                          logoUrl={post.logo_url}
                          publishedDate={post.published_date}
                          title={post.title}
                          briefIntro={post.brief_intro}
                        />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-16">
                    <p className="text-body text-neutral-10">No posts yet. Coming soon.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
