'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Shield,
  FileText,
  Database,
  Tag,
  FolderKanban,
  Bot,
  KeyRound,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type SettingsTab =
  | 'password'
  | 'profile'
  | 'users'
  | 'prompt'
  | 'examples'
  | 'keywords'
  | 'case-studies'
  | 'claude'
  | 'chatgpt';

interface SidebarSection {
  title: string;
  items: {
    id: SettingsTab;
    label: string;
    icon: React.ElementType;
  }[];
}

const settingsSections: SidebarSection[] = [
  {
    title: 'Admin',
    items: [
      { id: 'users', label: 'User Management', icon: Shield },
    ],
  },
  {
    title: 'Upwork Setting',
    items: [
      { id: 'prompt', label: 'System Prompt', icon: FileText },
      { id: 'examples', label: 'Prompt Examples', icon: Database },
      { id: 'keywords', label: 'Keywords', icon: Tag },
      { id: 'case-studies', label: 'Case Studies', icon: FolderKanban },
    ],
  },
  {
    title: 'AI Key Settings',
    items: [
      { id: 'claude', label: 'Claude Settings', icon: Bot },
      { id: 'chatgpt', label: 'ChatGPT Settings', icon: Bot },
    ],
  },
  {
    title: 'Account Settings',
    items: [
      { id: 'password', label: 'Password Change', icon: KeyRound },
    ],
  },
];

const tabMetadata: Record<
  SettingsTab,
  {
    title: string;
    subtitle: string;
    description: string;
    icon: React.ElementType;
  }
> = {
  users: {
    title: 'User Management',
    subtitle: 'Manage team member access, roles, and administrative permissions',
    description:
      'Team member invitations, role-based access control (RBAC), and user permission logs will be available here soon.',
    icon: Shield,
  },
  prompt: {
    title: 'System Prompt',
    subtitle: 'Configure core AI prompt instructions and automated evaluation logic',
    description:
      'Custom LLM prompt templates, dynamic variable tokens, and live output previews will be available here soon.',
    icon: FileText,
  },
  examples: {
    title: 'Prompt Examples',
    subtitle: 'Manage few-shot examples for client evaluation and proposal generation',
    description:
      'Few-shot training sets, high-scoring proposal benchmarks, and sample job scoring pairs will be available here soon.',
    icon: Database,
  },
  keywords: {
    title: 'Keywords',
    subtitle: 'Manage positive search filters and negative exclusion keywords',
    description:
      'Target technology keyword triggers, negative exclusion filters, and automated scrapers will be available here soon.',
    icon: Tag,
  },
  'case-studies': {
    title: 'Case Studies',
    subtitle: 'Portfolio projects and case study references for proposal generation',
    description:
      'Company portfolio references, client case study cards, and metric benchmarks will be available here soon.',
    icon: FolderKanban,
  },
  claude: {
    title: 'Claude Settings',
    subtitle: 'Configure Anthropic Claude API keys and model parameters',
    description:
      'Claude 3.7 Sonnet configuration, custom Anthropic API keys, and parameter tuning will be available here soon.',
    icon: Bot,
  },
  chatgpt: {
    title: 'ChatGPT Settings',
    subtitle: 'Configure OpenAI ChatGPT API keys and reasoning parameters',
    description:
      'GPT-5 configuration, custom OpenAI API keys, and reasoning effort controls will be available here soon.',
    icon: Bot,
  },
  password: {
    title: 'Password Change',
    subtitle: 'Manage your account credentials, password, and security preferences',
    description:
      'Password update controls, credential verification, and two-factor authentication (2FA) will be available here soon.',
    icon: KeyRound,
  },
  profile: {
    title: 'Password Change',
    subtitle: 'Manage your account credentials, password, and security preferences',
    description:
      'Password update controls, credential verification, and two-factor authentication (2FA) will be available here soon.',
    icon: KeyRound,
  },
};

function SettingsContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const initialTab: SettingsTab =
    (tabParam as SettingsTab) || 'password';
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);

  useEffect(() => {
    const currentTab = searchParams.get('tab');
    if (currentTab === 'password' || currentTab === 'profile') {
      setActiveTab('password');
    } else if (currentTab) {
      setActiveTab(currentTab as SettingsTab);
    }
  }, [searchParams]);

  const currentInfo = tabMetadata[activeTab] || tabMetadata.password;
  const IconComponent = currentInfo.icon;

  return (
    <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-12 min-h-[calc(100vh-8rem)]">
      {/* Left Settings Sidebar (Width: 260px desktop) */}
      <aside className="w-full lg:w-64 xl:w-72 shrink-0 lg:border-r lg:border-[#CBD5E1] lg:pr-8 space-y-6 self-start">
        {settingsSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="px-3 text-[11px] font-bold text-[#334155] uppercase tracking-wider mb-1.5">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  activeTab === item.id ||
                  (item.id === 'password' && activeTab === 'profile');
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left cursor-pointer',
                      isActive
                        ? 'bg-[#EFF6FF] text-[#2563eb] border-l-3 border-[#2563eb] pl-2.5'
                        : 'text-[#000000] hover:bg-slate-50 hover:text-[#0F172A]'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-4 w-4 shrink-0 transition-colors',
                        isActive ? 'text-[#2563eb]' : 'text-black'
                      )}
                    />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </aside>

      {/* Main Content Area - Simple Coming Soon View */}
      <div className="flex-1 min-w-0 lg:pl-2 xl:pl-4 py-1">
        <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
          <div>
            <h1 className="text-xl font-medium tracking-tight text-black">
              {currentInfo.title}
            </h1>
            <p className="text-sm text-[#334155] font-medium mt-1">
              {currentInfo.subtitle}
            </p>
          </div>

          <div className="rounded-xl border border-[#CBD5E1] bg-white shadow-xs p-12 sm:p-16 text-center">
            <div className="flex flex-col items-center justify-center max-w-md mx-auto space-y-4">
              <div className="h-14 w-14 rounded-full bg-[#EFF6FF] text-[#2563eb] border border-[#BFDBFE] flex items-center justify-center">
                <IconComponent className="h-7 w-7 text-[#2563eb]" />
              </div>
              <h2 className="text-lg font-bold text-[#0F172A]">
                {currentInfo.title} Coming Soon
              </h2>
              <p className="text-sm text-[#334155] font-medium leading-relaxed">
                {currentInfo.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#2563eb] border-t-transparent" />
          </div>
        }
      >
        <SettingsContent />
      </Suspense>
    </div>
  );
}
