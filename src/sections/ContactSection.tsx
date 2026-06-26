import ContactForm from "@/components/contact/ContactForm";
import SectionBackground from "@/components/SectionBackground";
import SectionHeader from "@/components/SectionHeader";
import RatingBadge from "@/components/RatingBadge";
import ContactBG from "@/assets/contact/Contact_BG.png";

const ContactSection = () => {
  return (
    <div className="section relative">
      {/* Section Background */}
      <SectionBackground imageSrc={ContactBG} imageAlt="Contact background" />
      
      {/* Content Container */}
      <div className="container relative z-10">
        {/* Contact Content - responsive layout */}
        <div className="relative flex flex-col gap-10 desktop:flex-row desktop:justify-between desktop:gap-0">
          
          {/* Section Header - order 1 on mobile */}
          <div className="order-1 w-full desktop:absolute desktop:w-[33%] desktop:max-w-[600px]">
            <SectionHeader
              title="Start your journey"
              subtitle="Let's start building something great together."
              align="left"
              variant="dark"
            />
          </div>
          
          {/* Contact Form - order 2 on mobile */}
          <div className="order-2 w-full desktop:w-[56%] desktop:max-w-[600px] desktop:ml-auto">
            <ContactForm />
          </div>
          
          {/* Contact List - order 3 on mobile (below form) */}
          <div className="order-3 w-full flex flex-col desktop:absolute desktop:bottom-0 desktop:w-[33%] desktop:max-w-[600px]">
            <p className="text-body-large text-neutral-00/80">206-837-1232</p>
            <h5 className="text-h5 text-neutral-00 mt-1">hello@grovia.io</h5>
            <RatingBadge variant="dark" className="mt-8" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
