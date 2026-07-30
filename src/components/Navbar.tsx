import { useState } from "react";
import { Link } from "react-router-dom";
import { List, X } from "@phosphor-icons/react";
import FilledButton from "./FilledButton";
import HashLink from "./HashLink";
import ThemeControls from "./ThemeControls";
import Logo from "@/assets/Logo.png";

interface NavItem {
  label: string;
  href: string;
}

interface NavbarProps {
  logoHref?: string;
  logoSrc?: string;
  navItems?: NavItem[];
  ctaText?: string;
  ctaHref?: string;
}

const defaultNavItems: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Posts", href: "/post" },
  { label: "Features", href: "/#features-section" },
  { label: "Pricing", href: "/#pricing-section" },
];

const Navbar = ({
  logoHref = "/",
  logoSrc,
  navItems = defaultNavItems,
  ctaText = "Contact us",
  ctaHref = "/#contact-section",
}: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-[20px] left-1/2 -translate-x-1/2 z-20 w-[calc(100%-48px)] tablet:w-max tablet:min-w-[616px] tablet:max-w-[calc(100%-48px)] bg-neutral-00 rounded-[60px] py-[10px] px-[12px] items-center justify-between gap-8 border shadow-[0_1px_20px_rgba(224,215,198,0.5)] border-neutral-03 flex flex-row">
        {/* Logo */}
        <Link to={logoHref} className="flex-shrink-0 pl-1" aria-label="Grovia home">
          <BrandLogo />
        </Link>


        {/* Navigation Links - hidden on mobile */}
        <div className="hidden tablet:flex items-center gap-[16px]">
        {navItems.map((item) => (
            <HashLink
              key={item.label}
              to={item.href}
              className="text-nav text-neutral-11 hover:text-neutral-12 transition-colors duration-500"
            >
              {item.label}
            </HashLink>
          ))}
        </div>

        {/* CTA Button + Theme controls - hidden on mobile */}
        <div className="hidden tablet:flex items-center gap-3">
          <ThemeControls />
          <FilledButton href={ctaHref}>{ctaText}</FilledButton>
        </div>

        {/* Mobile Menu Button - visible only on mobile */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="tablet:hidden btn-filled flex items-center gap-3 text-neutral-00 p-2 pl-4 rounded-[32px] text-nav transition-opacity duration-500 hover:opacity-90"
        >
          <span>{isMobileMenuOpen ? "Close" : "Menu"}</span>
          <div className="rounded-full p-1 bg-neutral-00">
            {isMobileMenuOpen ? (
              <X size={16} className="text-neutral-12" />
            ) : (
              <List size={16} className="text-neutral-12" />
            )}
          </div>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 tablet:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-neutral-12/50"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Content */}
        <div
          className={`absolute top-[96px] left-1/2 -translate-x-1/2 w-[calc(100%-48px)] bg-neutral-12 rounded-[12px] p-[20px] shadow-[0_2px_20px_rgba(0,0,0,0.15)] border border-neutral-10 transition-all duration-300 ease-out flex flex-col items-center gap-3 ${
            isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
        {navItems.map((item) => (
            <HashLink
              key={item.label}
              to={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-nav text-neutral-00 hover:text-neutral-03 transition-colors duration-500"
            >
              {item.label}
            </HashLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navbar;
