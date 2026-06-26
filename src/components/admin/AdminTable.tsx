import React from "react";
import { CircleNotch } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import FilledButton from "@/components/FilledButton";
import { cn } from "@/lib/utils";

// Container wrapper with card styling
interface AdminTableContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const AdminTableContainer = ({ children, className }: AdminTableContainerProps) => (
  <div className={cn("bg-neutral-00 rounded-2xl border border-neutral-03 overflow-hidden", className)}>
    {children}
  </div>
);

// Table wrapper with horizontal scroll
interface AdminTableProps {
  children: React.ReactNode;
  className?: string;
}

export const AdminTable = ({ children, className }: AdminTableProps) => (
  <div className="overflow-x-auto">
    <table className={cn("w-full table-fixed min-w-[900px]", className)}>{children}</table>
  </div>
);

// Table header
interface AdminTableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const AdminTableHeader = ({ children, className }: AdminTableHeaderProps) => (
  <thead className={cn("bg-neutral-02 border-b border-neutral-03", className)}>
    {children}
  </thead>
);

// Table head cell
interface AdminTableHeadProps {
  children: React.ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
}

export const AdminTableHead = ({ children, align = "left", className }: AdminTableHeadProps) => (
  <th
    className={cn(
      "p-4 text-body font-medium text-neutral-10 min-w-[150px]",
      align === "left" && "text-left",
      align === "right" && "text-right",
      align === "center" && "text-center",
      className
    )}
  >
    {children}
  </th>
);

// Table body
interface AdminTableBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const AdminTableBody = ({ children, className }: AdminTableBodyProps) => (
  <tbody className={className}>{children}</tbody>
);

// Table row
interface AdminTableRowProps {
  children: React.ReactNode;
  className?: string;
}

export const AdminTableRow = ({ children, className }: AdminTableRowProps) => (
  <tr className={cn("border-b border-neutral-03 last:border-b-0 hover:bg-neutral-01", className)}>
    {children}
  </tr>
);

// Table cell (for non-text content like badges, buttons, links - no truncation)
interface AdminTableCellProps {
  children: React.ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
}

export const AdminTableCell = ({ children, align = "left", className }: AdminTableCellProps) => (
  <td
    className={cn(
      "p-4 min-w-[150px]",
      align === "left" && "text-left",
      align === "right" && "text-right",
      align === "center" && "text-center",
      className
    )}
  >
    {children}
  </td>
);

// Table cell for text content with truncation
interface AdminTableCellTextProps {
  children: React.ReactNode;
  className?: string;
}

export const AdminTableCellText = ({ children, className }: AdminTableCellTextProps) => (
  <td className={cn("p-4 min-w-[150px]", className)}>
    {children}
  </td>
);

// Table cell for images with fixed width
interface AdminTableCellImageProps {
  children: React.ReactNode;
  className?: string;
}

export const AdminTableCellImage = ({ children, className }: AdminTableCellImageProps) => (
  <td className={cn("p-4 w-20", className)}>
    {children}
  </td>
);

// Table head for image columns with fixed width
export const AdminTableHeadImage = ({ children, className }: { children?: React.ReactNode; className?: string }) => (
  <th className={cn("p-4 text-body font-medium text-neutral-10 text-left w-20", className)}>
    {children}
  </th>
);

// Action button for tables
interface AdminTableActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  asChild?: boolean;
}

export const AdminTableActionButton = React.forwardRef<
  HTMLButtonElement,
  AdminTableActionButtonProps
>(({ children, onClick, disabled, className, asChild }, ref) => (
  <Button
    ref={ref}
    variant="ghost"
    size="sm"
    onClick={onClick}
    disabled={disabled}
    className={cn("hover:bg-neutral-02", className)}
    asChild={asChild}
  >
    {children}
  </Button>
));
AdminTableActionButton.displayName = "AdminTableActionButton";

// Loading state
interface AdminTableLoadingProps {
  className?: string;
}

export const AdminTableLoading = ({ className }: AdminTableLoadingProps) => (
  <div className={cn("flex justify-center py-20", className)}>
    <CircleNotch size={32} className="animate-spin text-neutral-08" />
  </div>
);

// Empty state
interface AdminTableEmptyStateProps {
  image: string;
  imageAlt?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
  className?: string;
}

export const AdminTableEmptyState = ({
  image,
  imageAlt = "Empty state illustration",
  message,
  actionLabel,
  onAction,
  actionIcon,
  className,
}: AdminTableEmptyStateProps) => (
  <div className={cn("bg-neutral-00 rounded-2xl border border-neutral-03 p-12 text-center", className)}>
    <img
      src={image}
      alt={imageAlt}
      className="h-[150px] md:h-[200px] w-auto mx-auto mb-10"
    />
    <p className="text-body-large text-neutral-08 mb-4">{message}</p>
    {actionLabel && onAction && (
      <FilledButton onClick={onAction} showArrow={false} icon={actionIcon}>
        {actionLabel}
      </FilledButton>
    )}
  </div>
);
