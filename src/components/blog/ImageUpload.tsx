import { useState, useRef } from "react";
import { Upload, X, CircleNotch } from "@phosphor-icons/react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
}

const ImageUpload = ({ value, onChange, folder = "thumbnails" }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Please upload an image file", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("blog-images")
        .getPublicUrl(fileName);

      onChange(publicUrl);
    } catch (error) {
      toast({ title: "Upload failed", description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange(null);
  };

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Uploaded"
            className="w-full max-w-[300px] h-auto rounded-xl object-cover border border-neutral-04"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-neutral-12 text-neutral-00 rounded-full hover:bg-neutral-10 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-neutral-04 rounded-xl p-8 text-center cursor-pointer hover:border-neutral-06 transition-colors"
        >
          {isUploading ? (
            <CircleNotch size={32} className="mx-auto animate-spin text-neutral-08" />
          ) : (
            <>
              <Upload size={32} className="mx-auto text-neutral-08 mb-2" />
              <p className="text-body text-neutral-08">Click to upload image</p>
            </>
          )}
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
