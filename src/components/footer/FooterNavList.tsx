import HashLink from "@/components/HashLink";
import { ArrowElbowDownRight } from "@phosphor-icons/react";

interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterNavListProps {
  title: string;
  items: NavItem[];
}

const FooterNavList = ({ title, items }: FooterNavListProps) => {
  return (
    <div className="flex flex-col gap-2 desktop:flex-row desktop:items-start desktop:gap-6">
      <div className="hidden tablet:flex items-center gap-2">
        <ArrowElbowDownRight size={16} className="text-neutral-10 hidden desktop:block" />
        <span className="text-body-large text-neutral-10">{title}</span>
      </div>
      <div className="flex flex-col gap-1">
        {items.map((item) => (
          item.external ? (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-body text-neutral-12 hover:text-neutral-10 transition-colors duration-500"
            >
              {item.label}
            </a>
          ) : (
            <HashLink
              key={item.label}
              to={item.href}
              className="text-body text-neutral-12 hover:text-neutral-10 transition-colors duration-500"
            >
              {item.label}
            </HashLink>
          )
        ))}
      </div>
    </div>
  );
};

export default FooterNavList;
