import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { TeamMember, TeamMemberFormData } from "@/types/team";
import { useCreateTeamMember, useUpdateTeamMember, useUpdateTeamMemberSilent, useCreateTeamMemberSilent } from "@/hooks/useTeamMembers";
import { useAutoSave } from "@/hooks/useAutoSave";
import FilledButton from "@/components/FilledButton";
import OutlineButton from "@/components/OutlineButton";
import AutoSaveIndicator from "@/components/admin/AutoSaveIndicator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/blog/ImageUpload";
import { CircleNotch } from "@phosphor-icons/react";

interface TeamMemberFormProps {
  member?: TeamMember | null;
}

const TeamMemberForm = ({ member }: TeamMemberFormProps) => {
  const navigate = useNavigate();
  const createMember = useCreateTeamMember();
  const updateMember = useUpdateTeamMember();
  const updateMemberSilent = useUpdateTeamMemberSilent();
  const createMemberSilent = useCreateTeamMemberSilent();

  const [draftId, setDraftId] = useState<string | null>(null);
  const [formData, setFormData] = useState<TeamMemberFormData>({
    name: "",
    photo_url: null,
    position: "",
    social_link: null,
  });

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        photo_url: member.photo_url,
        position: member.position,
        social_link: member.social_link,
      });
    }
  }, [member]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.photo_url) {
      alert("Photo is required");
      return;
    }

    const currentId = member?.id || draftId;

    if (currentId) {
      await updateMember.mutateAsync({ id: currentId, member: formData });
    } else {
      await createMember.mutateAsync(formData);
    }

    navigate("/admin/team");
  };

  const isLoading = createMember.isPending || updateMember.isPending;

  const handleAutoSave = useCallback(async (data: TeamMemberFormData) => {
    const currentId = member?.id || draftId;

    if (currentId) {
      await updateMemberSilent.mutateAsync({ id: currentId, member: data });
    } else {
      const created = await createMemberSilent.mutateAsync(data);
      setDraftId(created.id);
    }
  }, [member, draftId, updateMemberSilent, createMemberSilent]);

  const { status: autoSaveStatus, lastSaved } = useAutoSave({
    data: formData,
    onSave: handleAutoSave,
    enabled: true,
    debounceMs: 2000,
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex justify-end">
        <AutoSaveIndicator status={autoSaveStatus} lastSaved={lastSaved} />
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="Enter team member name"
          required
        />
      </div>

      {/* Photo */}
      <div className="space-y-2">
        <Label>Photo *</Label>
        <ImageUpload
          value={formData.photo_url}
          onChange={(url) => setFormData((prev) => ({ ...prev, photo_url: url }))}
          folder="team"
        />
      </div>

      {/* Position */}
      <div className="space-y-2">
        <Label htmlFor="position">Position *</Label>
        <Input
          id="position"
          value={formData.position}
          onChange={(e) => setFormData((prev) => ({ ...prev, position: e.target.value }))}
          placeholder="e.g. CEO, Designer, Developer"
          required
        />
      </div>

      {/* Social Link */}
      <div className="space-y-2">
        <Label htmlFor="social_link">Social Link</Label>
        <Input
          id="social_link"
          type="url"
          value={formData.social_link || ""}
          onChange={(e) => setFormData((prev) => ({ ...prev, social_link: e.target.value || null }))}
          placeholder="https://linkedin.com/in/username"
        />
      </div>


      {/* Submit Buttons */}
      <div className="flex gap-4 pt-4">
        <FilledButton type="submit" disabled={isLoading} showArrow={false}>
          {isLoading ? (
            <CircleNotch size={16} className="animate-spin" />
          ) : member ? (
            "Update member"
          ) : (
            "Add member"
          )}
        </FilledButton>
        <OutlineButton onClick={() => navigate("/admin/team")}>
          Cancel
        </OutlineButton>
      </div>
    </form>
  );
};

export default TeamMemberForm;
