import { Link, useLocation, useNavigate } from "react-router-dom";
import { ReactNode, MouseEvent } from "react";

interface HashLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const HashLink = ({ to, children, className, onClick }: HashLinkProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const hashIndex = to.indexOf('#');
    
    if (hashIndex === -1) {
      onClick?.();
      return;
    }

    const path = to.substring(0, hashIndex) || '/';
    const hash = to.substring(hashIndex + 1);
    const currentPath = location.pathname;
    const isSamePage = path === currentPath || (path === '/' && currentPath === '/');

    if (isSamePage) {
      e.preventDefault();
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', to);
      }
    } else {
      e.preventDefault();
      navigate(path);
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }

    onClick?.();
  };

  return (
    <Link to={to} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
};

export default HashLink;
