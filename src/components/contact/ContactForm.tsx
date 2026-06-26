import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import FilledButton from "@/components/FilledButton";
import { supabase } from "@/integrations/supabase/client";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Please enter a valid email").max(255, "Email must be less than 255 characters"),
  message: z.string().trim().min(1, "Message is required").max(2000, "Message must be less than 2000 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactForm = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Client-side validation
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof ContactFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("send-contact-email", {
        body: result.data,
      });

      if (error) {
        throw new Error(error.message || "Failed to send message");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClassName = "w-full h-[44px] bg-neutral-00/5 rounded-[20px] px-4 text-body text-neutral-00 placeholder:text-neutral-00/60 border border-transparent outline-none focus:border-main transition-colors";
  const labelClassName = "text-body text-neutral-00 block mb-2";
  const errorClassName = "text-body-small text-red-400 mt-1";

  return (
    <form 
      onSubmit={handleSubmit}
      className="bg-overlay-01 rounded-[24px] p-6 desktop:p-8 flex flex-col gap-5 w-full"
    >
      {/* Name Field */}
      <div>
        <label htmlFor="contact-name" className={labelClassName}>
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your name"
          className={inputClassName}
          maxLength={100}
        />
        {errors.name && <p className={errorClassName}>{errors.name}</p>}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="contact-email" className={labelClassName}>
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your@email.com"
          className={inputClassName}
          maxLength={255}
        />
        {errors.email && <p className={errorClassName}>{errors.email}</p>}
      </div>

      {/* Message Field */}
      <div>
        <label htmlFor="contact-message" className={labelClassName}>
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="How can we help you?"
          className={`${inputClassName} h-auto min-h-[120px] py-3 resize-none`}
          maxLength={2000}
        />
        {errors.message && <p className={errorClassName}>{errors.message}</p>}
      </div>

      {/* Submit Button */}
      <div className="mt-2">
        <FilledButton 
          type="submit" 
          variant="filled-main" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Submit"}
        </FilledButton>
      </div>
    </form>
  );
};

export default ContactForm;
