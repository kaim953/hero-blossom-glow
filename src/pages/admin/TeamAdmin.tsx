import { useNavigate } from "react-router-dom";
import { useTeamMembers, useDeleteTeamMember, useReorderTeamMembers } from "@/hooks/useTeamMembers";
import AdminNavbar from "@/components/AdminNavbar";
import OutlineButton from "@/components/OutlineButton";
import FilledButton from "@/components/FilledButton";
import { Plus, Trash, ArrowSquareOut } from "@phosphor-icons/react";
import emptyStateImage from "@/assets/Reading_in_Focus.png";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  AdminTableContainer,
  AdminTable,
  AdminTableHeader,
  AdminTableHead,
  AdminTableHeadImage,
  AdminTableBody,
  AdminTableCell,
  AdminTableCellText,
  AdminTableCellImage,
  AdminTableActionButton,
  AdminTableLoading,
  AdminTableEmptyState,
} from "@/components/admin/AdminTable";
import {
  DraggableAdminTableContext,
  DraggableAdminTableRow,
  DragHandleTableHead,
} from "@/components/admin/DraggableAdminTable";

const TeamAdmin = () => {
  const navigate = useNavigate();
  const { data: members, isLoading } = useTeamMembers();
  const deleteMember = useDeleteTeamMember();
  const reorderMembers = useReorderTeamMembers();
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    await deleteMember.mutateAsync(id);
    setOpenDialogId(null);
  };

  const handleReorder = (newOrder: string[]) => {
    reorderMembers.mutate(newOrder);
  };

  const memberIds = members?.map((m) => m.id) ?? [];

  return (
    <div className="min-h-screen bg-neutral-01">
      <AdminNavbar />

      <main className="admin-page-header section">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-neutral-12 mb-4">Team management</h2>
              <p className="text-body-large text-neutral-10">
                Add and manage your team members. Drag to reorder.
              </p>
            </div>
            <OutlineButton
              onClick={() => navigate("/admin/team/new")}
              icon={<Plus size={16} />}
              className="hidden tablet:flex"
            >
              Add member
            </OutlineButton>
          </div>

          {/* Floating action button for mobile */}
          <div className="fixed bottom-6 right-6 z-50 tablet:hidden">
            <OutlineButton
              onClick={() => navigate("/admin/team/new")}
              icon={<Plus size={16} />}
            >
              Add member
            </OutlineButton>
          </div>

          {isLoading ? (
            <AdminTableLoading />
          ) : members && members.length > 0 ? (
            <DraggableAdminTableContext items={memberIds} onReorder={handleReorder}>
              <AdminTableContainer>
                <AdminTable>
                  <AdminTableHeader>
                    <tr>
                      <DragHandleTableHead />
                      <AdminTableHeadImage>Photo</AdminTableHeadImage>
                      <AdminTableHead>Name</AdminTableHead>
                      <AdminTableHead>Position</AdminTableHead>
                      <AdminTableHead>Social</AdminTableHead>
                      <AdminTableHead align="right">Actions</AdminTableHead>
                    </tr>
                  </AdminTableHeader>
                  <AdminTableBody>
                    {members.map((member) => (
                      <DraggableAdminTableRow key={member.id} id={member.id} onClick={() => navigate(`/admin/team/edit/${member.id}`)}>
                        <AdminTableCellImage>
                          {member.photo_url ? (
                            <img
                              src={member.photo_url}
                              alt={member.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-neutral-03 flex items-center justify-center text-neutral-08">
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </AdminTableCellImage>
                        <AdminTableCellText>
                          <p className="text-body font-medium text-neutral-12 truncate">{member.name}</p>
                        </AdminTableCellText>
                        <AdminTableCellText>
                          <span className="text-body text-neutral-10 truncate block">{member.position}</span>
                        </AdminTableCellText>
                        <AdminTableCell>
                          {member.social_link ? (
                            <a
                              href={member.social_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-body text-neutral-12 hover:underline"
                            >
                              <ArrowSquareOut size={16} />
                              Link
                            </a>
                          ) : (
                            <span className="text-body text-neutral-08">—</span>
                          )}
                        </AdminTableCell>
                        <AdminTableCell align="right">
                          <AlertDialog
                            open={openDialogId === member.id}
                            onOpenChange={(open) => setOpenDialogId(open ? member.id : null)}
                          >
                            <AlertDialogTrigger asChild>
                              <AdminTableActionButton>
                                <Trash size={16} className="text-red-500" />
                              </AdminTableActionButton>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete team member?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete
                                  "{member.name}" from your team.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <OutlineButton onClick={() => setOpenDialogId(null)}>
                                  Cancel
                                </OutlineButton>
                                <FilledButton
                                  onClick={() => handleDelete(member.id)}
                                  showArrow={false}
                                >
                                  Delete
                                </FilledButton>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </AdminTableCell>
                      </DraggableAdminTableRow>
                    ))}
                  </AdminTableBody>
                </AdminTable>
              </AdminTableContainer>
            </DraggableAdminTableContext>
          ) : (
            <AdminTableEmptyState
              image={emptyStateImage}
              imageAlt="No team members illustration"
              message="No team members yet"
              actionLabel="Add your first member"
              actionIcon={<Plus size={16} />}
              onAction={() => navigate("/admin/team/new")}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default TeamAdmin;
