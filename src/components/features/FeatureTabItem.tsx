import { ReactNode } from "react";

interface FeatureTabItemProps {
  icon: ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const FeatureTabItem = ({ icon, label, isActive, onClick }: FeatureTabItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-center gap-2 p-4 rounded-[32px] transition-all duration-500 desktop:flex-1 relative z-10
        ${isActive 
          ? "bg-neutral-00/80 text-neutral-12 shadow-[0_4px_10px_rgba(0,0,0,0.1)] desktop:bg-transparent desktop:shadow-none"
          : "bg-transparent opacity-50 hover:opacity-75"
        }
      `}
    >
      <span className="w-5 h-5 flex items-center justify-center">
        {icon}
      </span>
      <span className="text-body-large font-medium">{label}</span>
    </button>
  );
};

export default FeatureTabItem;
