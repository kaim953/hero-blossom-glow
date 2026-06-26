import InstagramLogo from "@/assets/Instagram_Logo.png";
import LinkedinLogo from "@/assets/Linkedin_Logo.png";
import ThreadsLogo from "@/assets/Threads_Logo.png";
import Logo from "@/assets/Logo.png";
import SocialLink from "./footer/SocialLink";
import FooterNavList from "./footer/FooterNavList";

const pagesLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/#pricing-section" },
  { label: "Posts", href: "/post" },
];

const adminLinks = [
  { label: "Login", href: "/auth" },
  { label: "Instructions", href: "https://lunisdesign.com/lovable-template-guides", external: true },
];

const Footer = () => {
  return (
    <footer className="bg-bg-01 relative z-10 pt-5 px-1 pb-0 tablet:p-5 desktop:p-5">
      <div className="container-wrap bg-bg-02 py-10 desktop:py-[60px]">
        <div className="small-container">
          {/* Upper Row: Logo + Nav Lists */}
          <div className="flex flex-col gap-6 tablet:flex-row tablet:justify-between tablet:items-start">
            {/* Left: Logo */}
            <div className="flex flex-col items-start">
              <img src={Logo} alt="Grovia" className="h-[35px] w-auto object-contain" loading="lazy" decoding="async" />
            </div>
            
            {/* Right: Nav Lists */}
            <div className="flex gap-10">
              <FooterNavList title="Pages" items={pagesLinks} />
              <FooterNavList title="Admin" items={adminLinks} />
            </div>
          </div>
          
          {/* Lower Row: Email + Social Links + Copyright */}
          <div className="flex flex-col gap-8 mt-16 tablet:flex-row tablet:justify-between tablet:items-end desktop:mt-10">
            {/* Left: Email + Social Links */}
            <div className="flex flex-col gap-5">
              <h1 className="text-neutral-12">hello@grovia.io</h1>
              <div className="flex items-center gap-2">
                <SocialLink href="https://instagram.com" icon={<img src={InstagramLogo} alt="Instagram" className="w-5 h-5" loading="lazy" decoding="async" />} />
                <SocialLink href="https://linkedin.com" icon={<img src={LinkedinLogo} alt="LinkedIn" className="w-5 h-5" loading="lazy" decoding="async" />} />
                <SocialLink href="https://threads.com" icon={<img src={ThreadsLogo} alt="Threads" className="w-5 h-5" loading="lazy" decoding="async" />} />
              </div>
            </div>
            
            {/* Right: Copyright */}
            <p className="text-body text-neutral-10">
              Designed by <a href="https://lunisdesign.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-neutral-12 transition-colors duration-500">Lunis</a>. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
