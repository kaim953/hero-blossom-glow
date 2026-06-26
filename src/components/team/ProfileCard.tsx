import { TeamMember } from "@/types/team";
import useInView from "@/hooks/useInView";

interface ProfileCardProps {
  member: TeamMember;
  className?: string;
}

const ProfileCard = ({ member, className = "" }: ProfileCardProps) => {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <div 
      ref={ref}
      className={`flex flex-col gap-2 opacity-0 ${isInView ? "animate-scroll-fade-in" : ""} ${className}`}
    >
      {/* Profile Image */}
      <div className="w-full aspect-[3/4] rounded-[20px] overflow-hidden bg-neutral-03">
        {member.photo_url ? (
          <img
            src={member.photo_url}
            alt={member.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-08 text-h2">
            {member.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="p-4 bg-neutral-00 rounded-[16px] flex flex-col">
        <span className="text-body-large text-neutral-12">{member.name}</span>
        <span className="text-body text-neutral-10">{member.position}</span>
      </div>
    </div>
  );
};

export default ProfileCard;
