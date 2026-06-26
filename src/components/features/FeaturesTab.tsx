import { useState } from "react";
import { Monitor, TrendUp, Stack, Users } from "@phosphor-icons/react";
import FeatureTabItem from "./FeatureTabItem";
import Feature1 from "@/assets/features/Feature1.png";
import Feature2 from "@/assets/features/Feature2.png";
import Feature3 from "@/assets/features/Feature3.png";
import Feature4 from "@/assets/features/Feature4.png";
import useInView from "@/hooks/useInView";

const tabsData = [
  {
    id: "client-portal",
    icon: <Monitor size={20} />,
    label: "Client portal",
    tag: "CLIENT PORTAL",
    title: "Centralized access for teams and clients",
    description:
      "Securely share progress, files, feedback, and timelines with stakeholders. Keep everyone on the same page without switching platforms.",
    image: Feature1,
  },
  {
    id: "kpi-tracking",
    icon: <TrendUp size={20} />,
    label: "KPI tracking",
    tag: "KPI TRACKING",
    title: "Track what matters most",
    description:
      "Monitor key performance indicators in real-time. Make data-driven decisions with clear visibility into team and business metrics.",
    image: Feature2,
  },
  {
    id: "workflow-automation",
    icon: <Stack size={20} />,
    label: "Workflow automation",
    tag: "WORKFLOW AUTOMATION",
    title: "Automate repetitive tasks",
    description:
      "Streamline your processes with intelligent automation. Reduce manual work and let your team focus on what truly matters.",
    image: Feature3,
  },
  {
    id: "team-management",
    icon: <Users size={20} />,
    label: "Team management",
    tag: "TEAM MANAGEMENT",
    title: "Empower your team",
    description:
      "Manage roles, permissions, and collaboration seamlessly. Build a high-performing team with the right tools and structure.",
    image: Feature4,
  },
];

const FeaturesTab = () => {
  const [activeTab, setActiveTab] = useState(tabsData[0].id);
  const { ref: dashboardRef, isInView: dashboardInView } = useInView({ threshold: 0.2 });

  const activeTabData = tabsData.find((tab) => tab.id === activeTab) || tabsData[0];
  const activeIndex = tabsData.findIndex((tab) => tab.id === activeTab);

  return (
    <div className="w-full">
      {/* Tab Header Container */}
      <div className="bg-bg-02 rounded-[40px] w-full p-2 flex flex-col tablet:grid tablet:grid-cols-2 desktop:flex desktop:flex-row gap-2 relative">
        {/* Sliding Background Indicator - Desktop Only */}
        <div 
          className="hidden desktop:block absolute top-2 bottom-2 bg-neutral-00/80 rounded-[32px] shadow-[0_4px_10px_rgba(0,0,0,0.1)] transition-all duration-300 ease-out pointer-events-none"
          style={{
            width: `calc((100% - 16px - 6px) / 4)`,
            left: `calc(8px + ${activeIndex} * ((100% - 16px - 6px) / 4 + 2px))`
          }}
        />
        
        {tabsData.map((tab) => (
          <FeatureTabItem
            key={tab.id}
            icon={tab.icon}
            label={tab.label}
            isActive={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          />
        ))}
      </div>

      {/* Tab Content Container */}
      <div 
        ref={dashboardRef}
        className={`bg-neutral-00/60 rounded-[24px] flex flex-col desktop:flex-row desktop:items-center mt-3 p-2 w-full h-auto ${
          dashboardInView ? 'animate-scroll-in-bottom' : 'opacity-0'
        }`}
      >
        {/* Feature UI (Dashboard) */}
        <div className="w-full desktop:flex-1 aspect-[16/10] desktop:aspect-auto desktop:h-[390px] bg-bg-02 rounded-[16px] overflow-hidden relative">
          {tabsData.map((tab) => (
            <img 
              key={tab.id}
              src={tab.image} 
              alt={tab.label}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                activeTab === tab.id ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>

        {/* Feature Content */}
        <div className="w-full desktop:w-[430px] flex flex-col py-8 px-5 desktop:py-0 desktop:px-8 gap-4 desktop:gap-0">
          {/* Tag */}
          <span className="bg-main text-tag px-3 py-1.5 rounded-full inline-block w-fit">
            {activeTabData.tag}
          </span>

          {/* Title */}
          <h3 className="desktop:mt-6">{activeTabData.title}</h3>

          {/* Description */}
          <p className="text-body text-neutral-10 desktop:mt-6">{activeTabData.description}</p>
        </div>
      </div>
    </div>
  );
};

export default FeaturesTab;
