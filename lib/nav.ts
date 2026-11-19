import {
  LayoutDashboard,
  Briefcase,
  Mail,
  Share2,
  FileText,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Upwork Jobs',
    href: '/jobs',
    icon: Briefcase,
  },
  {
    label: 'EmailHub',
    href: '/emailhub',
    icon: Mail,
  },
  {
    label: 'LinkedIn AI',
    href: '/linkedin-ai',
    icon: Share2,
  },
  {
    label: 'Pitch Hub',
    href: '/pitch-hub',
    icon: FileText,
  },
];
