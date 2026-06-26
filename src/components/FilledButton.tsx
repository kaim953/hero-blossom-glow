import { ArrowRight } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import HashLink from "./HashLink";

interface FilledButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  showArrow?: boolean;
  fullWidth?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
  variant?: "filled-black" | "filled-main";
}

const FilledButton = ({ 
  children, 
  href, 
  onClick, 
  showArrow = true, 
  fullWidth = false,
  type = "button",
  disabled = false,
  icon,
  className: additionalClassName,
  variant = "filled-black"
}: FilledButtonProps) => {
  const isMainVariant = variant === "filled-main";

  const buttonContent = (
    <>
      <span>{children}</span>
      {icon && icon}
      {showArrow && (
        <div className={`rounded-full p-1 ${isMainVariant ? 'bg-neutral-12' : 'bg-neutral-00'}`}>
          <ArrowRight size={16} className={isMainVariant ? 'text-neutral-00' : 'text-neutral-12'} />
        </div>
      )}
    </>
  );

  const btnClass = isMainVariant ? 'btn-filled-main' : 'btn-filled';
  const textColor = isMainVariant ? 'text-neutral-12' : 'text-neutral-00';

  const className = `${btnClass} inline-flex items-center justify-center gap-3 text-button ${textColor} p-2 ${showArrow ? 'pl-4' : 'px-4'} rounded-[32px] transition-opacity duration-500 hover:opacity-90 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed ${fullWidth ? 'w-full' : ''} ${additionalClassName || ''}`;

  if (href && !disabled) {
    const isExternal = href.startsWith('http://') || href.startsWith('https://');
    const isHashLink = href.includes('#');
    
    if (isExternal) {
      return (
        <a href={href} className={className} onClick={onClick} target="_blank" rel="noopener noreferrer">
          {buttonContent}
        </a>
      );
    }
    
    if (isHashLink) {
      return (
        <HashLink to={href} className={className} onClick={onClick}>
          {buttonContent}
        </HashLink>
      );
    }
    
    return (
      <Link to={href} className={className} onClick={onClick}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <button className={className} onClick={onClick} type={type} disabled={disabled}>
      {buttonContent}
    </button>
  );
};

export default FilledButton;
