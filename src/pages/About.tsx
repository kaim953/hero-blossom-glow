import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundStripes from "@/components/BackgroundStripes";
import PageHeader from "@/components/PageHeader";
import RatingBadge from "@/components/RatingBadge";
import MissionCard from "@/components/MissionCard";
import MetricCard from "@/components/MetricCard";
import LogoTicker from "@/components/LogoTicker";
import TeamSection from "@/sections/TeamSection";
import ContactSection from "@/sections/ContactSection";
import aboutVideo from "@/assets/about/About_Video.mp4";
import casualCoworkers from "@/assets/about/Casual_Coworkers.png";
import colleaguesCollaborating from "@/assets/about/Colleagues_Collaborating.png";
import abstractMotionBlur from "@/assets/about/Abstract_Motion_Blur.png";
import contentWomanWithLaptop from "@/assets/about/Content_Woman_with_Laptop.png";

const About = () => {
  return (
    <div className="min-h-screen bg-bg-01 flex flex-col relative">
      <BackgroundStripes />
      <Navbar />
      <main className="flex-1 relative z-10">
        {/* Page Header Section */}
        <div className="page-header">
          <div className="section">
            <div className="container">
              {/* Header */}
              <div className="flex flex-col items-center">
                <PageHeader
                  heading="We empower startups to scale smarter and faster"
                  subheading="We are a team of strategists and engineers driven by one goal — helping ambitious startups to grow with confidence."
                />
                <RatingBadge 
                  variant="light" 
                  className="mt-8 justify-center" 
                />
              </div>

              {/* Header Images */}
              <div className="w-full tablet:w-[100%] desktop:w-[83%] max-w-[450px] tablet:max-w-[700px] desktop:max-w-none mx-auto mt-16 flex flex-col tablet:flex-row items-start gap-2">
                {/* About Video Wrap */}
                <div className="w-full h-[250px] tablet:h-auto tablet:aspect-square bg-bg-03 rounded-[20px] desktop:rounded-[24px] p-2 relative">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    className="w-[95%] h-[240px] tablet:h-auto tablet:aspect-square object-cover rounded-[16px] desktop:rounded-[24px] absolute -top-1 -left-1 z-10 opacity-0 animate-about-scale-rotate"
                    style={{
                      boxShadow: "4px 6px 15px hsla(0, 0%, 0%, 0.25)"
                    }}
                  >
                    <source src={aboutVideo} type="video/mp4" />
                  </video>
                </div>

                {/* About Image Wrap */}
                <div className="w-full h-[200px] tablet:h-auto tablet:aspect-square bg-bg-03 rounded-[20px] desktop:rounded-[24px] p-2 flex flex-row tablet:flex-col gap-2">
                  <img
                    src={casualCoworkers}
                    alt="Casual coworkers in workspace"
                    className="flex-1 min-h-0 min-w-0 w-full object-cover rounded-[16px] desktop:rounded-[24px] opacity-0 animate-about-fade-in"
                    loading="lazy"
                    decoding="async"
                  />
                  <img
                    src={colleaguesCollaborating}
                    alt="Colleagues collaborating"
                    className="flex-1 min-h-0 min-w-0 w-full object-cover rounded-[16px] desktop:rounded-[24px] opacity-0 animate-about-fade-in"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="section">
          <div className="container">
            {/* Highlight */}
            <div className="bg-bg-02 rounded-[24px] h-auto desktop:h-[560px] p-2 flex flex-col desktop:flex-row gap-2">
              {/* Mission Card */}
              <MissionCard
                title="Our mission"
                description="Empower startups and growing businesses with the tools, insights, and support they need to scale smarter, move faster, and build lasting success."
                imageSrc={contentWomanWithLaptop}
                backgroundSrc={abstractMotionBlur}
                className="w-full desktop:w-[41%] h-auto desktop:h-full"
              />
              
              {/* Metrics Wrap */}
              <div className="flex-1 flex flex-wrap tablet:grid tablet:grid-cols-2 gap-2">
                <MetricCard
                  value={250}
                  suffix="+"
                  unit="Projects Supported"
                  description="Helping teams move from idea to execution faster."
                  className="flex-1 min-w-[250px] h-[240px] tablet:min-w-0 tablet:h-auto"
                />
                <MetricCard
                  value={85}
                  suffix="%"
                  unit="Client Retention Rate"
                  description="Long-term partnerships built on real results."
                  className="flex-1 min-w-[250px] h-[240px] tablet:min-w-0 tablet:h-auto"
                />
                <MetricCard
                  value={98}
                  suffix="%"
                  unit="Client Satisfaction"
                  description="Consistently high ratings from clients across industries."
                  className="flex-1 min-w-[250px] h-[240px] tablet:min-w-0 tablet:h-auto"
                />
                <MetricCard
                  value={30}
                  suffix="+"
                  unit="Integrations Supported"
                  description="Seamlessly connects with your favorite tools and platforms."
                  className="flex-1 min-w-[250px] h-[240px] tablet:min-w-0 tablet:h-auto"
                />
              </div>
            </div>
            
            {/* Partner Logos */}
            <div className="flex flex-col tablet:flex-row items-center gap-6 mt-16">
              <span className="text-body-large text-neutral-10 whitespace-nowrap">
                Trusted by 50+ partners
              </span>
              <LogoTicker />
            </div>
          </div>
        </div>

        {/* Team Section */}
        <TeamSection />

        {/* Contact Section */}
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default About;
