import { Link } from "react-router-dom";
import SectionHeader from "@/components/SectionHeader";
import Post from "@/components/blog/Post";
import OutlineButton from "@/components/OutlineButton";
import IntegrationDivider from "@/components/integrations/IntegrationDivider";
import Testimonial from "@/components/testimonials/Testimonial";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import useInView from "@/hooks/useInView";

import Avatar1 from "@/assets/pricing/avatars/dreamy-woman.png";
import Avatar2 from "@/assets/pricing/avatars/modern-gradient.png";
import Avatar3 from "@/assets/pricing/avatars/modern-man.png";

const testimonials = [
  {
    quote: "Grovia helped us streamline our operations and scale faster than we imagined. Their mix of strategy and execution is unmatched.",
    name: "Talia Smith",
    position: "Head of Product at Forma",
    avatarUrl: Avatar1,
  },
  {
    quote: "Working with Grovia felt like having an extension of our team. They understood our challenges and delivered real, measurable results.",
    name: "Jordan Johnson",
    position: "COO at Metricon",
    avatarUrl: Avatar2,
  },
  {
    quote: "From the first meeting, Grovia brought clarity and momentum to our hiring strategy. We've seen a major improvement in team performance.",
    name: "Samuel Torres",
    position: "Founder at Bloomtech",
    avatarUrl: Avatar3,
  }
];

const SuccessStories = () => {
  const { data: posts } = useBlogPosts(true);
  const displayedPosts = posts?.slice(0, 4) || [];
  const { ref: postsRef, isInView: postsInView } = useInView({ threshold: 0.2 });

  return (
    <div className="section">
      <div className="container">
        {/* Posts Section */}
        <div>
          {/* Section Header */}
          <div className="w-full desktop:w-[66%] max-w-[600px] mx-auto">
            <SectionHeader
              title="Success stories"
              subtitle="Grovia has partnered with growing businesses to build foundations for sustainable success. Explore real stories of transformation."
              align="center"
              maxWidth="100%"
            />
          </div>

          {/* Post Wrap */}
          <div ref={postsRef} className="bg-bg-02 rounded-[24px] p-2 my-10">
            {displayedPosts.length > 0 ? (
              <div className="grid grid-cols-1 tablet:grid-cols-2 gap-2">
                {displayedPosts.map((post) => (
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

          {/* Read More Button */}
          <div className="flex justify-center">
            <OutlineButton href="/post">Read more</OutlineButton>
          </div>
        </div>

        {/* Divider */}
        <div className="flex justify-center py-16">
          <IntegrationDivider />
        </div>

        {/* Testimonials Section */}
        <div className="flex flex-col gap-2 tablet:grid tablet:grid-cols-2 desktop:flex desktop:flex-row">
          <Testimonial
            quote={testimonials[0].quote}
            name={testimonials[0].name}
            position={testimonials[0].position}
            avatarUrl={testimonials[0].avatarUrl}
            className="h-[410px] tablet:h-[400px] desktop:h-[410px] desktop:flex-1"
          />
          <Testimonial
            quote={testimonials[1].quote}
            name={testimonials[1].name}
            position={testimonials[1].position}
            avatarUrl={testimonials[1].avatarUrl}
            className="h-[410px] tablet:h-[400px] desktop:h-[410px] desktop:flex-1 desktop:mt-10"
          />
          <Testimonial
            quote={testimonials[2].quote}
            name={testimonials[2].name}
            position={testimonials[2].position}
            avatarUrl={testimonials[2].avatarUrl}
            className="h-[410px] tablet:h-[300px] desktop:h-[410px] tablet:col-span-2 desktop:col-span-1 desktop:flex-1 desktop:mt-20"
          />
        </div>
      </div>
    </div>
  );
};

export default SuccessStories;
