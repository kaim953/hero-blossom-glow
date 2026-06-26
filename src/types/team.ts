import { z } from 'zod';

// Zod validation schema for team member form data (display_order managed via drag-and-drop)
export const TeamMemberFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  photo_url: z.string().url("Invalid URL format").nullable().or(z.literal("")),
  position: z.string().min(1, "Position is required").max(100, "Position must be less than 100 characters"),
  social_link: z.string().url("Invalid URL format").nullable().or(z.literal("")),
});

export type TeamMemberFormData = z.infer<typeof TeamMemberFormSchema>;

export interface TeamMember {
  id: string;
  name: string;
  photo_url: string | null;
  position: string;
  social_link: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}
