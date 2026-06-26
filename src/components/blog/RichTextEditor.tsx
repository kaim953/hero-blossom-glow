import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { useRef, useState, useEffect, useCallback } from "react";
import { TextB, TextItalic, ListBullets, ListNumbers, Link as LinkIcon, Image as ImageIcon, ArrowCounterClockwise, ArrowClockwise, CircleNotch } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [currentHeading, setCurrentHeading] = useState("paragraph");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const getHeadingValue = useCallback(() => {
    if (!editor) return "paragraph";
    for (let i = 1; i <= 6; i++) {
      if (editor.isActive("heading", { level: i })) return `h${i}`;
    }
    return "paragraph";
  }, [editor]);

  // Subscribe to selection changes to update heading dropdown
  useEffect(() => {
    if (!editor) return;

    const updateHeading = () => {
      setCurrentHeading(getHeadingValue());
    };

    editor.on("selectionUpdate", updateHeading);
    editor.on("transaction", updateHeading);
    updateHeading();

    return () => {
      editor.off("selectionUpdate", updateHeading);
      editor.off("transaction", updateHeading);
    };
  }, [editor, getHeadingValue]);

  // Sync external content changes to editor when form loads existing post data
  useEffect(() => {
    if (editor && content) {
      const currentContent = editor.getHTML();
      const isEditorEmpty = currentContent === "<p></p>" || currentContent === "";
      if (isEditorEmpty && content !== currentContent) {
        editor.commands.setContent(content);
      }
    }
  }, [editor, content]);

  if (!editor) return null;

  const handleHeadingChange = (value: string) => {
    if (value === "paragraph") {
      editor.chain().focus().setParagraph().run();
    } else {
      const level = parseInt(value.replace("h", "")) as 1 | 2 | 3 | 4 | 5 | 6;
      editor.chain().focus().toggleHeading({ level }).run();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Please upload an image file", variant: "destructive" });
      return;
    }

    setIsUploadingImage(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `content/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("blog-images")
        .getPublicUrl(fileName);

      editor.chain().focus().setImage({ src: publicUrl }).run();
    } catch (error) {
      toast({ title: "Upload failed", description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsUploadingImage(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  const isValidLinkUrl = (url: string): boolean => {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:', 'mailto:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  };

  const addLink = () => {
    const url = window.prompt("Enter link URL:");
    if (url) {
      if (!isValidLinkUrl(url)) {
        toast({
          title: "Invalid URL",
          description: "Only http://, https://, and mailto: URLs are allowed.",
          variant: "destructive"
        });
        return;
      }
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  };

  return (
    <div className="border border-neutral-04 rounded-xl overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 border-b border-neutral-04 bg-neutral-01">
        {/* Heading Dropdown */}
        <Select value={currentHeading} onValueChange={handleHeadingChange}>
          <SelectTrigger className="w-[130px] h-8">
            <SelectValue placeholder="Paragraph" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="paragraph">Paragraph</SelectItem>
            <SelectItem value="h1">Heading 1</SelectItem>
            <SelectItem value="h2">Heading 2</SelectItem>
            <SelectItem value="h3">Heading 3</SelectItem>
            <SelectItem value="h4">Heading 4</SelectItem>
            <SelectItem value="h5">Heading 5</SelectItem>
            <SelectItem value="h6">Heading 6</SelectItem>
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-neutral-03" : ""}
        >
          <TextB size={16} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-neutral-03" : ""}
        >
          <TextItalic size={16} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-neutral-03" : ""}
        >
          <ListBullets size={16} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-neutral-03" : ""}
        >
          <ListNumbers size={16} />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={addLink}>
          <LinkIcon size={16} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => imageInputRef.current?.click()}
          disabled={isUploadingImage}
        >
          {isUploadingImage ? (
            <CircleNotch size={16} className="animate-spin" />
          ) : (
            <ImageIcon size={16} />
          )}
        </Button>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <div className="ml-auto flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
          >
            <ArrowCounterClockwise size={16} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
          >
            <ArrowClockwise size={16} />
          </Button>
        </div>
      </div>
      <EditorContent
        editor={editor}
        className="prose prose-neutral max-w-none p-4 min-h-[300px] focus:outline-none 
          [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[280px]
          [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ul]:my-2
          [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_ol]:my-2
          [&_.ProseMirror_li]:my-1
          [&_.ProseMirror_h1]:leading-[1.4em] [&_.ProseMirror_h2]:leading-[1.4em] [&_.ProseMirror_h3]:leading-[1.4em]
          [&_.ProseMirror_h4]:leading-[1.4em] [&_.ProseMirror_h5]:leading-[1.4em] [&_.ProseMirror_h6]:leading-[1.4em]"
      />
    </div>
  );
};

export default RichTextEditor;
