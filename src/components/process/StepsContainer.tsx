import { useState } from "react";
import StepCard from "./StepCard";
import StepBgImage from "@/assets/process/Step_BG.png";
import StepCard1Image from "@/assets/process/Step_Card_1.png";
import StepCard2Image from "@/assets/process/Step_Card_2.png";
import StepCard3Image from "@/assets/process/Step_Card_3.png";

const stepsData = [
  {
    stepNumber: "01",
    title: "Easy setup",
    description:
      "Create your workspace and invite your team. Get everything ready in minutes.",
    backgroundImage: StepBgImage,
    mainImage: StepCard1Image,
  },
  {
    stepNumber: "02",
    title: "Collaborate",
    description:
      "Assign tasks and keep communication clear. Everyone stays aligned.",
    backgroundImage: StepBgImage,
    mainImage: StepCard2Image,
  },
  {
    stepNumber: "03",
    title: "Track growth",
    description:
      "Use dashboards to monitor progress, trends, and what matters most.",
    backgroundImage: StepBgImage,
    mainImage: StepCard3Image,
  },
];

const StepsContainer = () => {
  const [activeCard, setActiveCard] = useState(0);

  const handleMouseLeave = () => {
    setActiveCard(0);
  };

  return (
    <div
      className="w-full max-w-[600px] min-[810px]:max-w-[800px] min-[1200px]:max-w-none mx-auto bg-bg-02 p-[8px] mt-[8px] rounded-[24px]"
      onMouseLeave={handleMouseLeave}
    >
      {/* Desktop Layout - Horizontal cards with hover */}
      <div className="hidden min-[1200px]:flex gap-[8px]">
        {stepsData.map((step, index) => (
          <StepCard
            key={index}
            stepNumber={step.stepNumber}
            title={step.title}
            description={step.description}
            backgroundImage={step.backgroundImage}
            mainImage={step.mainImage}
            variant="horizontal"
            isOpen={activeCard === index}
            onHover={() => setActiveCard(index)}
          />
        ))}
      </div>

      {/* Tablet Layout - 2 vertical on top, 1 horizontal on bottom */}
      <div className="hidden min-[810px]:block min-[1200px]:hidden">
        {/* Top Row - Steps 1 & 2 as vertical cards */}
        <div className="grid grid-cols-2 gap-[8px]">
          {stepsData.slice(0, 2).map((step, index) => (
            <StepCard
              key={index}
              stepNumber={step.stepNumber}
              title={step.title}
              description={step.description}
              backgroundImage={step.backgroundImage}
              mainImage={step.mainImage}
              variant="vertical"
              isOpen={true}
              onHover={() => {}}
            />
          ))}
        </div>
        {/* Bottom Row - Step 3 as horizontal card (always open) */}
        <div className="mt-[8px]">
          <StepCard
            stepNumber={stepsData[2].stepNumber}
            title={stepsData[2].title}
            description={stepsData[2].description}
            backgroundImage={stepsData[2].backgroundImage}
            mainImage={stepsData[2].mainImage}
            variant="horizontal"
            isOpen={true}
            onHover={() => {}}
          />
        </div>
      </div>

      {/* Mobile Layout - All vertical cards stacked */}
      <div className="flex flex-col gap-[8px] min-[810px]:hidden">
        {stepsData.map((step, index) => (
          <StepCard
            key={index}
            stepNumber={step.stepNumber}
            title={step.title}
            description={step.description}
            backgroundImage={step.backgroundImage}
            mainImage={step.mainImage}
            variant="vertical"
            isOpen={true}
            onHover={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

export default StepsContainer;
