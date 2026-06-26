import { Plus } from "@phosphor-icons/react";

const IntegrationDivider = () => {
  return (
    <div className="flex gap-16">
      {[1, 2, 3, 4].map((i) => (
        <Plus key={i} size={16} className="text-neutral-06" />
      ))}
    </div>
  );
};

export default IntegrationDivider;
