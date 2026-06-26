import { useState } from "react";
import { Plus } from "@phosphor-icons/react";
import useInView from "@/hooks/useInView";

interface FAQProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
  className?: string;
}

const FAQ = ({ question, answer, defaultOpen = false, className = "" }: FAQProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <div 
      ref={ref}
      className={`p-6 desktop:p-8 bg-neutral-00/40 hover:bg-neutral-00/60 rounded-[16px] desktop:rounded-[20px] transition-all duration-500 hover:shadow-[5px_8px_15px_rgba(0,0,0,0.15)] cursor-pointer ${isInView ? 'animate-scroll-in-bottom' : 'opacity-0'} ${className}`}
      onClick={() => setIsOpen(!isOpen)}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h6 className="text-neutral-12 mr-4 flex-1 max-w-[650px]">
          {question}
        </h6>
        <Plus 
          size={20}
          className={`text-neutral-08 flex-shrink-0 transition-transform duration-500 ${isOpen ? 'rotate-[225deg]' : ''}`}
        />
      </div>

      {/* Answer - Animated */}
      <div 
        className={`grid transition-all duration-500 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <p className="text-body text-neutral-10 pt-4 max-w-[620px]">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
