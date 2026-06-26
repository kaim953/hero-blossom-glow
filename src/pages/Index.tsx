import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundStripes from "@/components/BackgroundStripes";
import LogoTicker from "@/components/LogoTicker";
import FilledButton from "@/components/FilledButton";
import OutlineButton from "@/components/OutlineButton";
import SectionHeader from "@/components/SectionHeader";
import WidgetPng from "@/assets/hero/Widget.png";
import ChartPng from "@/assets/hero/Chart.png";
import DashboardPng from "@/assets/process/Dashboard.png";
import StepsContainer from "@/components/process/StepsContainer";
import FeaturesTab from "@/components/features/FeaturesTab";
import IntegrationInfo from "@/components/integrations/IntegrationInfo";
import IntegrationTicker from "@/components/integrations/IntegrationTicker";
import SectionBackground from "@/components/SectionBackground";
import PricingBG from "@/assets/pricing/Pricing_BG.png";
import PricingContent from "@/components/pricing/PricingContent";
import SuccessStories from "@/sections/SuccessStories";
import ContactSection from "@/sections/ContactSection";
import FAQSection from "@/sections/FAQSection";
const Index = () => {
  return (
    <div className="min-h-screen bg-bg-01 flex flex-col relative">
      <BackgroundStripes />
      <Navbar />
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <div className="page-header">
          <div className="section-hero">
            <div className="container">
              {/* Hero Main Content */}
              <div className="flex flex-col items-center gap-16 desktop:flex-row desktop:items-start desktop:gap-0 desktop:justify-between">
                {/* Left Side - Text Content */}
                <div className="w-full max-w-[600px] text-center desktop:w-[41%] desktop:max-w-none desktop:text-left">
                  <h1 className="opacity-0 animate-slide-in-top desktop:animate-slide-in-left">Strategy and growth for modern teams</h1>
                  <p className="text-body-large text-neutral-10 mt-6 desktop:mt-[24px] opacity-0 animate-slide-in-top desktop:animate-slide-in-left">
                    Grovia partners with startups and small businesses to 
                    streamline operations, elevate team performance, and 
                    build a foundation for lasting success.
                  </p>
                  <div className="flex justify-center gap-4 mt-8 desktop:justify-start desktop:mt-[44px] opacity-0 animate-slide-in-top-delayed desktop:animate-slide-in-left-delayed">
                    <FilledButton href="/#pricing-section">Get started</FilledButton>
                    <OutlineButton href="/#contact-section">Contact us</OutlineButton>
                  </div>
                </div>

                {/* Right Side - UI Widgets */}
                <div className="w-full max-w-[450px] h-[270px] tablet:w-[75%] tablet:max-w-[600px] tablet:h-[400px] desktop:w-[49%] desktop:max-w-none desktop:h-[415px] relative">
                  {/* Widget PNG - positioned top-left with rotation */}
                  <img 
                    src={WidgetPng} 
                    alt="Customers widget" 
                    className="absolute top-0 left-0 w-[320px] tablet:top-[8px] tablet:left-[6px] tablet:w-[460px] desktop:top-[8px] desktop:left-[6px] desktop:w-[460px] h-auto rounded-[20px] border-2 border-neutral-00 opacity-0 animate-slide-in-top-widget desktop:animate-slide-in-right-widget"
                    style={{ filter: 'drop-shadow(0px 15px 25px rgba(104, 99, 80, 0.15))' }}
                    fetchPriority="high"
                    decoding="async"
                  />
                  {/* Chart PNG - positioned bottom-right with rotation */}
                  <img 
                    src={ChartPng} 
                    alt="Daily average chart" 
                    className="absolute right-0 bottom-[2px] w-[240px] tablet:right-[8px] tablet:bottom-[8px] tablet:w-[290px] desktop:right-0 desktop:bottom-[8px] desktop:w-[290px] h-auto rounded-[20px] border-2 border-neutral-00 opacity-0 animate-slide-in-top-chart desktop:animate-slide-in-right-chart"
                    style={{ filter: 'drop-shadow(0px 15px 25px rgba(104, 99, 80, 0.15))' }}
                    fetchPriority="high"
                    decoding="async"
                  />
                </div>
              </div>

              {/* Logo Ticker - 80px below hero-main */}
              <div className="mt-[80px]">
                <LogoTicker />
              </div>
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div className="section">
          <div className="container">
            {/* Dashboard Container - relative wrapper for fade effect */}
            <div className="w-full max-w-[550px] min-[810px]:w-[90%] min-[810px]:max-w-[700px] min-[1200px]:w-[83%] min-[1200px]:max-w-none mx-auto relative opacity-0 animate-slide-in-bottom-delayed">
              {/* Dashboard Wrapper */}
              <div 
                className="aspect-[5/3] min-[1200px]:aspect-auto min-[1200px]:h-[480px] rounded-[24px] border-2 border-neutral-00 overflow-hidden"
                style={{ 
                  boxShadow: '0px 4px 40px rgba(225, 216, 198, 0.5)' 
                }}
              >
                {/* Dashboard Image */}
                <img 
                  src={DashboardPng} 
                  alt="Dashboard preview" 
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              
              {/* Bottom Fade Effect - OUTSIDE wrapper, covers border */}
              <div 
                className="absolute bottom-0 left-0 right-0 h-[15%] pointer-events-none"
                style={{
                  background: 'linear-gradient(to bottom, transparent, hsl(40 18% 95%))'
                }}
              />
            </div>

            {/* Steps Wrapper */}
            <StepsContainer />
          </div>
        </div>

        {/* Features Section */}
        <div id="features-section" className="section">
          <div className="container">
            {/* Section Header - 100% on mobile/tablet, 66% on desktop, max 600px */}
            <div className="w-full desktop:w-[66%] max-w-[600px] mx-auto">
              <SectionHeader
                title="Built for high performance"
                subtitle="Grovia gives your team everything it needs to stay aligned, track performance, and scale with confidence — all in one place."
                align="center"
                maxWidth="100%"
              />
            </div>

            {/* Features Tab - 100% width placeholder */}
            <div className="w-full mt-12">
              <FeaturesTab />
            </div>
          </div>
        </div>

        {/* Integrations Section */}
        <div className="section">
          <div className="container">
            <div className="flex flex-col gap-10 tablet:flex-row tablet:gap-0 tablet:justify-between">
              {/* Integration Info */}
              <IntegrationInfo />

              {/* Integration Ticker */}
              <IntegrationTicker />
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div id="pricing-section" className="section relative">
          {/* Section Background */}
          <SectionBackground imageSrc={PricingBG} imageAlt="Pricing background" />
          
          {/* Content Container */}
          <div className="container relative z-10">
            <PricingContent />
          </div>
        </div>

        {/* Success Stories Section */}
        <SuccessStories />

        {/* FAQ Section */}
        <FAQSection />

        {/* Contact Section */}
        <div id="contact-section">
          <ContactSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
