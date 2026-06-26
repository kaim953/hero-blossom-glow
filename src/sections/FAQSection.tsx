import SectionHeader from "@/components/SectionHeader";
import OutlineButton from "@/components/OutlineButton";
import FAQ from "@/components/faq/FAQ";

const faqData = [
  { 
    question: "What types of companies do you work with?", 
    answer: "We partner with startups, small businesses, and growing teams across industries. Whether you're in tech, retail, or services, our solutions adapt to your unique challenges and goals." 
  },
  { 
    question: "How long does it take to see results?", 
    answer: "Most clients begin seeing measurable improvements within the first 4-6 weeks. However, timelines vary based on your specific goals and the complexity of implementation." 
  },
  { 
    question: "Can Grovia integrate with our existing tools?", 
    answer: "Yes! Grovia seamlessly integrates with popular tools like Slack, Salesforce, HubSpot, and many more. Our team will help ensure a smooth connection with your current workflow." 
  },
  { 
    question: "Do you offer one-time consultations or ongoing support?", 
    answer: "We offer both. Whether you need a single strategic session or prefer continuous partnership, we have flexible plans to match your needs and budget." 
  },
  { 
    question: "What does onboarding look like?", 
    answer: "Our onboarding process is designed to be quick and painless. You'll be assigned a dedicated success manager who will guide you through setup, training, and launch within 2 weeks." 
  }
];

const FAQSection = () => {
  return (
    <div className="section">
      <div className="container">
        <div className="flex flex-col gap-10 desktop:flex-row desktop:gap-0 desktop:justify-between">
          {/* FAQ Header */}
          <div className="w-full max-w-[600px] desktop:w-[33%]">
            <SectionHeader
              title="Your questions, answered"
              subtitle="Get quick answers to the most common questions about our platform and services."
              align="left"
              maxWidth="100%"
            />
            <OutlineButton href="/#contact-section" className="mt-5">
              Contact us
            </OutlineButton>
          </div>

          {/* FAQ List */}
          <div className="w-full desktop:w-[58%] bg-bg-02 rounded-[24px] p-2 flex flex-col gap-2">
            {faqData.map((faq, index) => (
              <FAQ
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
