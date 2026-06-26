import type { Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface AdminLabelProps {
  children: React.ReactNode;
  icon?: Icon;
  className?: string;
}

const AdminLabel = ({ children, icon: IconComponent, className }: AdminLabelProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm bg-neutral-02 text-neutral-10",
        className
      )}
    >
      {IconComponent && <IconComponent size={12} />}
      {children}
    </span>
  );
};

export default AdminLabel;
