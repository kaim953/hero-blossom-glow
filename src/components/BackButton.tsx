import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react";

interface BackButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  goBack?: boolean;
}

const BackButton = ({ 
  children, 
  href, 
  onClick,
  className: customClassName = "",
  goBack = false
}: BackButtonProps) => {
  const navigate = useNavigate();
  
  const className = `inline-flex items-center justify-center gap-2 p-1 text-button text-neutral-12 bg-transparent transition-all duration-500 hover:opacity-70 whitespace-nowrap ${customClassName}`;

  const handleClick = () => {
    onClick?.();
    if (goBack && !href) {
      navigate(-1);
    }
  };

  if (href) {
    return (
      <Link to={href} className={className} onClick={onClick}>
        <ArrowLeft size={20} />
        {children}
      </Link>
    );
  }

  return (
    <button className={className} onClick={handleClick} type="button">
      <ArrowLeft size={20} />
      {children}
    </button>
  );
};

export default BackButton;
