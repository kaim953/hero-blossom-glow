import { useTeamMembers } from "@/hooks/useTeamMembers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AuthorSelectProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

const AuthorSelect = ({ value, onChange }: AuthorSelectProps) => {
  const { data: teamMembers, isLoading } = useTeamMembers();

  return (
    <Select
      value={value || ""}
      onValueChange={(val) => onChange(val || null)}
    >
      <SelectTrigger className="bg-background">
        <SelectValue placeholder={isLoading ? "Loading..." : "Select an author"} />
      </SelectTrigger>
      <SelectContent className="bg-background z-50">
        {teamMembers?.map((member) => (
          <SelectItem key={member.id} value={member.id}>
            {member.name} — {member.position}
          </SelectItem>
        ))}
        {!isLoading && (!teamMembers || teamMembers.length === 0) && (
          <div className="px-2 py-1.5 text-sm text-muted-foreground">
            No team members found
          </div>
        )}
      </SelectContent>
    </Select>
  );
};

export default AuthorSelect;
