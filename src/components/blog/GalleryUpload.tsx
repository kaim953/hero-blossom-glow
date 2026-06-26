import { useState, useRef } from "react";
import { X, CircleNotch, Plus } from "@phosphor-icons/react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GalleryUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

const GalleryUpload = ({ value, onChange }: GalleryUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;

        const fileExt = file.name.split(".").pop();
        const fileName = `gallery/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("blog-images")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("blog-images")
          .getPublicUrl(fileName);

        newUrls.push(publicUrl);
      }

      onChange([...value, ...newUrls]);
    } catch (error) {
      toast({ title: "Upload failed", description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = (index: number) => {
    const newUrls = value.filter((_, i) => i !== index);
    onChange(newUrls);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-4 gap-4">
        {value.map((url, index) => (
          <div key={index} className="relative aspect-square">
            <img
              src={url}
              alt={`Gallery ${index + 1}`}
              className="w-full h-full object-cover rounded-xl border border-neutral-04"
            />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 p-1 bg-neutral-12 text-neutral-00 rounded-full hover:bg-neutral-10 transition-colors"
              >
                <X size={16} />
              </button>
          </div>
        ))}

          <div
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square border-2 border-dashed border-neutral-04 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-neutral-06 transition-colors"
          >
            {isUploading ? (
              <CircleNotch size={32} className="animate-spin text-neutral-08" />
            ) : (
              <>
                <Plus size={32} className="text-neutral-08 mb-2" />
                <p className="text-body text-neutral-08">Add images</p>
              </>
            )}
          </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
};

export default GalleryUpload;
