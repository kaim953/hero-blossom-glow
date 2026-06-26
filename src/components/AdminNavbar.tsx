import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { List, X } from "@phosphor-icons/react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/Logo.png";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const { signOut, isAdmin, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const navLinkClasses = "text-nav text-neutral-11 hover:text-neutral-12 transition-colors";
  const activeClasses = "text-neutral-12 font-medium";
  const mobileNavLinkClasses = "text-nav text-neutral-00 hover:text-neutral-03 transition-colors";
  const mobileActiveClasses = "text-neutral-00 font-medium";

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 pt-[20px]">
        <div className="container">
          <nav className="bg-neutral-00 rounded-[16px] py-[10px] px-[12px] items-center justify-between gap-8 border border-neutral-03 flex flex-row desktop:grid desktop:grid-cols-[1fr_auto_1fr]">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img src={logo} alt="Logo" className="h-[30px] w-auto" />
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden tablet:flex items-center gap-[16px] desktop:justify-center">
              <NavLink
                to="/admin/post"
                className={navLinkClasses}
                activeClassName={activeClasses}
                end
              >
                Posts
              </NavLink>
              <NavLink
                to="/admin/team"
                className={navLinkClasses}
                activeClassName={activeClasses}
              >
                Team
              </NavLink>
              {isAdmin && (
                <NavLink
                  to="/admin/access"
                  className={navLinkClasses}
                  activeClassName={activeClasses}
                >
                  Access
                </NavLink>
              )}
            </div>

            {/* Desktop Sign Out Button with tooltip */}
            <div className="hidden tablet:block desktop:flex desktop:justify-end desktop:justify-self-end relative group">
              <button
                onClick={handleSignOut}
                className="inline-flex items-center justify-center gap-2 text-button text-neutral-12 py-[8px] px-[16px] rounded-[12px] border border-neutral-04 bg-neutral-00 transition-colors hover:bg-neutral-02 whitespace-nowrap"
              >
                Sign out
              </button>
              {/* Tooltip */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                {/* Arrow pointing up */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full w-0 h-0 border-l-8 border-r-8 border-transparent border-b-8 border-b-neutral-12/60" />
                {/* Tooltip content */}
                <div className="bg-neutral-12/60 backdrop-blur-md text-neutral-00 text-sm px-3 py-2 rounded-lg whitespace-nowrap">
                  Signed in as {user?.email}
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="tablet:hidden btn-filled flex items-center gap-2 text-neutral-00 py-[10px] px-[12px] rounded-[12px] text-nav"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <span>{isMobileMenuOpen ? "Close" : "Menu"}</span>
              {isMobileMenuOpen ? <X size={18} /> : <List size={18} />}
            </button>
          </nav>
        </div>
      </div>

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
        <div className="absolute top-[96px] left-0 right-0">
          <div className="container">
            <div
              className={`bg-neutral-12 rounded-[12px] p-[20px] shadow-[0_2px_20px_rgba(0,0,0,0.15)] border border-neutral-10 transition-all duration-300 ${
                isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <NavLink
                  to="/admin/post"
                  className={mobileNavLinkClasses}
                  activeClassName={mobileActiveClasses}
                  onClick={() => setIsMobileMenuOpen(false)}
                  end
                >
                  Posts
                </NavLink>
                <NavLink
                  to="/admin/team"
                  className={mobileNavLinkClasses}
                  activeClassName={mobileActiveClasses}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Team
                </NavLink>
                {isAdmin && (
                  <NavLink
                    to="/admin/access"
                    className={mobileNavLinkClasses}
                    activeClassName={mobileActiveClasses}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Access
                  </NavLink>
                )}

                {/* Separator */}
                <div className="w-full h-px bg-neutral-08/30 my-3" />

                {/* User email */}
                <span className="text-caption text-neutral-06 mb-2">
                  Signed in as {user?.email}
                </span>

                {/* Sign out button */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="inline-flex items-center justify-center gap-2 text-button text-neutral-00 py-[8px] px-[16px] rounded-[12px] border border-neutral-04 bg-transparent transition-colors hover:bg-neutral-08/20 whitespace-nowrap w-[200px]"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to account for fixed navbar */}
      <div className="h-[96px]" />
    </>
  );
};

export default AdminNavbar;
