import { useParams, Link } from "react-router-dom";
import { useTeamMemberById } from "@/hooks/useTeamMembers";
import AdminNavbar from "@/components/AdminNavbar";
import TeamMemberForm from "@/components/team/TeamMemberForm";
import { ArrowLeft, CircleNotch } from "@phosphor-icons/react";

const TeamMemberEditor = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const { data: member, isLoading } = useTeamMemberById(id || "");

  return (
    <div className="min-h-screen bg-neutral-01">
      <AdminNavbar />

      <main className="admin-page-header section">
        <div className="container max-w-[900px]">
          <Link
            to="/admin/team"
            className="inline-flex items-center gap-2 text-body text-neutral-10 hover:text-neutral-12 mb-8"
          >
            <ArrowLeft size={16} />
            Back to team admin
          </Link>

          <div className="bg-neutral-00 rounded-2xl border border-neutral-03 p-6 tablet:p-8">
            <h2 className="text-neutral-12 mb-8">
              {isEditing ? "Edit team member" : "Add new team member"}
            </h2>

            {isEditing && isLoading ? (
              <div className="flex justify-center py-20">
                <CircleNotch size={32} className="animate-spin text-neutral-08" />
              </div>
            ) : (
              <TeamMemberForm member={isEditing ? member : null} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeamMemberEditor;
