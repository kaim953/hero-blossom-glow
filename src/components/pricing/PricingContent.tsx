import { useState } from "react";
import { Pencil, Lightning, Rocket } from "@phosphor-icons/react";
import PricingCard from "./PricingCard";
import PricingMenuItem from "./PricingMenuItem";
import SectionHeader from "@/components/SectionHeader";
import RatingBadge from "@/components/RatingBadge";
import useInView from "@/hooks/useInView";

// Define pricing tier data
const pricingTiers = [
  {
    id: "starter",
    menuTitle: "Starter",
    menuSubtitle: "For early-stage teams",
    icon: Pencil,
    title: "Starter",
    price: "$24",
    priceUnit: "/ mo",
    details: "Ideal for early-stage teams who need actionable insights to move forward.",
    buttonText: "Schedule a demo",
    buttonHref: "/#contact-section",
    features: [
      "Access to core features",
      "Basic performance reporting",
      "Email support",
      "Strategy onboarding guide",
      "Monthly check-in summary",
    ],
  },
  {
    id: "growth",
    menuTitle: "Growth",
    menuSubtitle: "Most popular",
    icon: Lightning,
    title: "Growth",
    price: "$49",
    priceUnit: "/ mo",
    details: "For growing teams ready to scale their operations and performance.",
    buttonText: "Schedule a demo",
    buttonHref: "/#contact-section",
    features: [
      "Everything in Starter",
      "Advanced analytics dashboard",
      "Priority email & chat support",
      "Dedicated success manager",
      "Weekly strategy sessions",
    ],
  },
  {
    id: "scale",
    menuTitle: "Scale",
    menuSubtitle: "For fast-scaling startups",
    icon: Rocket,
    title: "Scale",
    price: "$99",
    priceUnit: "/ mo",
    details: "Enterprise-grade tools for teams ready to dominate their market.",
    buttonText: "Schedule a demo",
    buttonHref: "/#contact-section",
    features: [
      "Everything in Growth",
      "Custom integrations",
      "24/7 dedicated support",
      "Quarterly business reviews",
      "Custom training programs",
    ],
  },
];


const PricingContent = () => {
  const [activeTier, setActiveTier] = useState("starter");
  const { ref: menuRef, isInView: menuInView } = useInView({ threshold: 0.3 });
  const { ref: cardRef, isInView: cardInView } = useInView({ threshold: 0.3 });
  
  const currentTier = pricingTiers.find(tier => tier.id === activeTier)!;

  return (
    <div className="flex flex-col gap-5 desktop:flex-row desktop:gap-0 desktop:justify-between relative">
      {/* Pricing Menu Wrap */}
      <div className="w-full desktop:w-[33%] desktop:max-w-[600px] desktop:h-full flex flex-col desktop:justify-between">
        {/* Pricing Header */}
        <div>
          <SectionHeader
            title="Flexible pricing"
            subtitle="Simple, transparent pricing with no hidden fees."
            hideSubtitleOnDesktop={true}
            variant="dark"
            maxWidth="100%"
          />
          
          {/* Pricing Menu List */}
          <div 
            ref={menuRef}
            className={`mt-5 desktop:mt-10 bg-overlay-01 p-2 rounded-[24px] flex flex-col gap-2 ${
              menuInView ? 'animate-scroll-in-bottom-20 desktop:animate-scroll-in-left-30' : 'opacity-0'
            }`}
          >
            {pricingTiers.map((tier) => (
              <PricingMenuItem
                key={tier.id}
                title={tier.menuTitle}
                subtitle={tier.menuSubtitle}
                isActive={activeTier === tier.id}
                onClick={() => setActiveTier(tier.id)}
              />
            ))}
          </div>
        </div>

        {/* Rating Section - Desktop only (absolute positioned) */}
        <RatingBadge variant="dark" className="hidden desktop:flex absolute left-0 bottom-0" />
      </div>

      {/* Pricing Cards Wrap */}
      <div ref={cardRef} className={`w-full desktop:w-[425px] ${cardInView ? 'animate-scroll-in-bottom-20 desktop:animate-scroll-in-right' : 'opacity-0'}`}>
        {/* Mobile only - vertical layout */}
        <PricingCard
          icon={currentTier.icon}
          title={currentTier.title}
          price={currentTier.price}
          priceUnit={currentTier.priceUnit}
          details={currentTier.details}
          buttonText={currentTier.buttonText}
          buttonHref={currentTier.buttonHref}
          features={currentTier.features}
          variant="vertical"
          className="tablet:hidden"
        />
        
        {/* Tablet only - horizontal layout */}
        <PricingCard
          icon={currentTier.icon}
          title={currentTier.title}
          price={currentTier.price}
          priceUnit={currentTier.priceUnit}
          details={currentTier.details}
          buttonText={currentTier.buttonText}
          buttonHref={currentTier.buttonHref}
          features={currentTier.features}
          variant="horizontal"
          className="hidden tablet:flex desktop:hidden"
        />
        
        {/* Desktop only - vertical layout */}
        <PricingCard
          icon={currentTier.icon}
          title={currentTier.title}
          price={currentTier.price}
          priceUnit={currentTier.priceUnit}
          details={currentTier.details}
          buttonText={currentTier.buttonText}
          buttonHref={currentTier.buttonHref}
          features={currentTier.features}
          className="hidden desktop:flex"
        />

        {/* Rating Section - Tablet/Mobile only */}
        <RatingBadge variant="dark" className="flex desktop:hidden mt-5" />
      </div>
    </div>
  );
};

export default PricingContent;
