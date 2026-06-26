import { useBlogPosts } from "@/hooks/useBlogPosts";
import { X } from "@phosphor-icons/react";

interface RelatedPostsSelectProps {
  value: string[];
  onChange: (ids: string[]) => void;
  currentPostId?: string;
}

const RelatedPostsSelect = ({ value, onChange, currentPostId }: RelatedPostsSelectProps) => {
  const { data: posts } = useBlogPosts(false);

  const availablePosts = posts?.filter(
    (post) => post.id !== currentPostId && !value.includes(post.id)
  ) ?? [];

  const selectedPosts = posts?.filter((post) => value.includes(post.id)) ?? [];

  const handleAdd = (id: string) => {
    onChange([...value, id]);
  };

  const handleRemove = (id: string) => {
    onChange(value.filter((v) => v !== id));
  };

  return (
    <div className="space-y-4">
      {selectedPosts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedPosts.map((post) => (
            <div
              key={post.id}
              className="flex items-center gap-2 bg-neutral-02 px-3 py-2 rounded-lg"
            >
              <span className="text-body-small text-neutral-11">{post.title}</span>
              <button
                type="button"
                onClick={() => handleRemove(post.id)}
                className="text-neutral-08 hover:text-neutral-12"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {availablePosts.length > 0 && (
        <select
          onChange={(e) => {
            if (e.target.value) {
              handleAdd(e.target.value);
              e.target.value = "";
            }
          }}
          className="w-full p-3 border border-neutral-04 rounded-xl bg-neutral-00 text-body focus:outline-none focus:ring-2 focus:ring-neutral-12"
        >
          <option value="">Select a post to add...</option>
          {availablePosts.map((post) => (
            <option key={post.id} value={post.id}>
              {post.title}
            </option>
          ))}
        </select>
      )}

      {availablePosts.length === 0 && selectedPosts.length === 0 && (
        <p className="text-body text-neutral-08">No other posts available</p>
      )}
    </div>
  );
};

export default RelatedPostsSelect;
