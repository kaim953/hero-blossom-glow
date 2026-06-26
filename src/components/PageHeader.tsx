interface PageHeaderProps {
  heading: string;
  subheading: string;
  className?: string;
}

const PageHeader = ({ 
  heading, 
  subheading, 
  className = "" 
}: PageHeaderProps) => {
  return (
    <div 
      className={`w-full desktop:w-[66%] max-w-[700px] mx-auto text-center ${className}`}
    >
      <h1 className="text-neutral-12">{heading}</h1>
      <p 
        className="text-body-large text-neutral-10 mt-5 mx-auto"
        style={{ maxWidth: "600px" }}
      >
        {subheading}
      </p>
    </div>
  );
};

export default PageHeader;
