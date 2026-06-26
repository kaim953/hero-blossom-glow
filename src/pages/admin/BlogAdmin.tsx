import { useNavigate } from "react-router-dom";
import { useBlogPosts, useDeleteBlogPost, useReorderBlogPosts } from "@/hooks/useBlogPosts";
import { useAuth } from "@/hooks/useAuth";
import AdminNavbar from "@/components/AdminNavbar";
import FilledButton from "@/components/FilledButton";
import OutlineButton from "@/components/OutlineButton";
import { Plus, Trash, Eye, EyeSlash } from "@phosphor-icons/react";
import emptyStateImage from "@/assets/Reading_in_Focus.png";
import AdminLabel from "@/components/admin/AdminLabel";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
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

const BlogAdmin = () => {
  const navigate = useNavigate();
  const { data: posts, isLoading } = useBlogPosts(false);
  const deletePost = useDeleteBlogPost();
  const reorderPosts = useReorderBlogPosts();
  const { user } = useAuth();
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    await deletePost.mutateAsync(id);
    setOpenDialogId(null);
  };

  const handleReorder = (newOrder: string[]) => {
    reorderPosts.mutate(newOrder);
  };

  const postIds = posts?.map((p) => p.id) ?? [];

  return (
    <div className="min-h-screen bg-neutral-01">
      <AdminNavbar />

      <main className="admin-page-header section">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-neutral-12 mb-4">Post management</h2>
              <p className="text-body-large text-neutral-10">
                Create and manage your posts. Drag to reorder.
              </p>
            </div>
            <OutlineButton
              onClick={() => navigate("/admin/post/new")}
              icon={<Plus size={16} />}
              className="hidden tablet:flex"
            >
              New post
            </OutlineButton>
          </div>

          {/* Floating action button for mobile */}
          <div className="fixed bottom-6 right-6 z-50 tablet:hidden">
            <OutlineButton
              onClick={() => navigate("/admin/post/new")}
              icon={<Plus size={16} />}
            >
              New post
            </OutlineButton>
          </div>

          {isLoading ? (
            <AdminTableLoading />
          ) : posts && posts.length > 0 ? (
            <DraggableAdminTableContext items={postIds} onReorder={handleReorder}>
              <AdminTableContainer>
                <AdminTable>
                  <AdminTableHeader>
                    <tr>
                      <DragHandleTableHead />
                      <AdminTableHeadImage>Thumbnail</AdminTableHeadImage>
                      <AdminTableHead>Title</AdminTableHead>
                      <AdminTableHead>Author</AdminTableHead>
                      <AdminTableHead>Date</AdminTableHead>
                      <AdminTableHead>Status</AdminTableHead>
                      <AdminTableHead align="right">Actions</AdminTableHead>
                    </tr>
                  </AdminTableHeader>
                  <AdminTableBody>
                    {posts.map((post) => (
                      <DraggableAdminTableRow key={post.id} id={post.id} onClick={() => navigate(`/admin/post/edit/${post.id}`)}>
                        <AdminTableCellImage>
                          {post.thumbnail_url && (
                            <img
                              src={post.thumbnail_url}
                              alt=""
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                        </AdminTableCellImage>
                        <AdminTableCellText>
                          <div className="min-w-0">
                            <p className="text-body font-medium text-neutral-12 truncate">{post.title}</p>
                            <p className="text-body-small text-neutral-08 truncate">/{post.slug}</p>
                          </div>
                        </AdminTableCellText>
                        <AdminTableCellText>
                          <span className="text-body text-neutral-10 truncate block">{post.author?.name || "—"}</span>
                        </AdminTableCellText>
                        <AdminTableCell>
                          <span className="text-body text-neutral-10">
                            {post.published_date && format(new Date(post.published_date), "MMM d, yyyy")}
                          </span>
                        </AdminTableCell>
                        <AdminTableCell>
                          {post.is_published ? (
                            <AdminLabel icon={Eye} className="text-success">Published</AdminLabel>
                          ) : (
                            <AdminLabel icon={EyeSlash}>Draft</AdminLabel>
                          )}
                        </AdminTableCell>
                        <AdminTableCell align="right">
                          <AlertDialog 
                            open={openDialogId === post.id} 
                            onOpenChange={(open) => setOpenDialogId(open ? post.id : null)}
                          >
                            <AlertDialogTrigger asChild>
                              <AdminTableActionButton>
                                <Trash size={16} className="text-red-500" />
                              </AdminTableActionButton>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete post?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the post
                                  "{post.title}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <OutlineButton onClick={() => setOpenDialogId(null)}>
                                  Cancel
                                </OutlineButton>
                                <FilledButton 
                                  onClick={() => handleDelete(post.id)} 
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
              imageAlt="No posts illustration"
              message="No posts yet"
              actionLabel="Create your first post"
              actionIcon={<Plus size={16} />}
              onAction={() => navigate("/admin/post/new")}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default BlogAdmin;
