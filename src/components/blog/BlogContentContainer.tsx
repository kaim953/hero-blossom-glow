import { cn } from "@/lib/utils";

interface BlogContentContainerProps {
  children: React.ReactNode;
  className?: string;
}

const BlogContentContainer = ({ children, className }: BlogContentContainerProps) => {
  return (
    <div className={cn(
      "w-full max-w-[550px] tablet:w-[74%] tablet:max-w-[800px] desktop:w-[66%] desktop:max-w-[800px] mx-auto", 
      className
    )}>
      {children}
    </div>
  );
};

export default BlogContentContainer;
