interface IntegrationStepProps {
  number: string;
  text: string;
  className?: string;
}

const IntegrationStep = ({ number, text, className = "" }: IntegrationStepProps) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="w-7 h-7 bg-neutral-12 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-tag text-neutral-00">{number}</span>
      </div>
      <p className="text-body-large text-neutral-10 ml-3">{text}</p>
    </div>
  );
};

export default IntegrationStep;
