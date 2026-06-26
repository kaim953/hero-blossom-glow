import SectionHeader from "@/components/SectionHeader";
import FilledButton from "@/components/FilledButton";
import IntegrationDivider from "./IntegrationDivider";
import IntegrationStep from "./IntegrationStep";
import useInView from "@/hooks/useInView";

const IntegrationInfo = () => {
  const { ref: stepsRef, isInView: stepsInView } = useInView({ threshold: 0.3 });

  return (
    <div className="w-full max-w-[600px] flex flex-col gap-10 tablet:w-[58%] tablet:gap-16 desktop:w-[41%]">
      {/* Header */}
      <div className="w-full flex flex-col">
        <SectionHeader
          title="Powerful integrations"
          subtitle="Seamlessly integrate with your favorite tools to streamline workflows and keep everything in sync."
          align="left"
          maxWidth="100%"
        />
        <div className="mt-5">
          <FilledButton href="/#pricing-section">Get started</FilledButton>
        </div>
      </div>

      {/* Divider */}
      <IntegrationDivider />

      {/* Steps */}
      <div ref={stepsRef} className="w-full flex flex-col gap-5">
        <IntegrationStep 
          number="01" 
          text="Explore 50+ supported integrations" 
          className={stepsInView ? 'animate-scroll-in-left' : 'opacity-0'}
        />
        <IntegrationStep 
          number="02" 
          text="Securely link your account" 
          className={stepsInView ? 'animate-scroll-in-left-delayed-1' : 'opacity-0'}
        />
        <IntegrationStep 
          number="03" 
          text="Sync and streamline your workflow" 
          className={stepsInView ? 'animate-scroll-in-left-delayed-2' : 'opacity-0'}
        />
      </div>
    </div>
  );
};

export default IntegrationInfo;
