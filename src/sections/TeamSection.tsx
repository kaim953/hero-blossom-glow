import SectionHeader from "@/components/SectionHeader";
import ProfileCard from "@/components/team/ProfileCard";
import { useTeamMembers } from "@/hooks/useTeamMembers";

const TeamSection = () => {
  const { data: members } = useTeamMembers();

  return (
    <div className="section">
      <div className="container flex flex-col gap-10 desktop:flex-row desktop:gap-0 desktop:justify-between">
        {/* Section Header */}
        <div className="w-full max-w-[600px] relative desktop:w-[33%] desktop:sticky desktop:top-[100px] desktop:self-start">
          <SectionHeader
            title="Meet the team"
            subtitle="Our team combines deep industry knowledge with hands-on experience to help startups grow smarter and faster."
            align="left"
            maxWidth="100%"
          />
        </div>

        {/* Profile Wrapper */}
        <div className="w-full flex flex-wrap gap-x-2 gap-y-10 tablet:grid tablet:grid-cols-2 desktop:w-[58%]">
          {members?.map((member) => (
            <ProfileCard 
              key={member.id} 
              member={member} 
              className="flex-1 max-w-[550px] min-w-[280px] tablet:flex-none tablet:w-full tablet:max-w-none tablet:min-w-0"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamSection;
