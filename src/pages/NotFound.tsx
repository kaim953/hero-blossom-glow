import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Footer from "@/components/Footer";
import FilledButton from "@/components/FilledButton";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-bg-01">
      {/* Main content area with responsive height */}
      <div className="h-[80vh] desktop:h-[90vh] flex items-center justify-center">
        {/* Content container */}
        <div className="w-full max-w-[500px] px-6 text-center flex flex-col items-center">
          {/* 404 text */}
          <span className="font-geist font-medium text-[100px] tablet:text-[130px] leading-none tracking-[-0.05em] text-neutral-12">
            404
          </span>
          
          {/* Heading - 32px gap from 404 */}
          <h1 className="text-h4 text-neutral-12 mt-8">
            Sorry, there's nothing here.
          </h1>
          
          {/* Description - 24px gap from heading */}
          <p className="text-body font-medium text-neutral-10 mt-6">
            We couldn't find the page you're looking for. It might have been moved or it doesn't exist anymore.
          </p>
          
          {/* Button - 32px gap from description */}
          <div className="mt-8">
            <FilledButton href="/">Back to home</FilledButton>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
