'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Menu,
  ChevronDown,
  User,
  KeyRound,
  LogOut,
} from 'lucide-react';
import { navItems } from '@/lib/nav';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isItemActive = (href: string) => {
    if (href === '/jobs') {
      return pathname === '/jobs' || pathname.startsWith('/jobs/') || pathname === '/';
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 h-16 w-full bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] transition-shadow duration-200',
        isScrolled ? 'shadow-xs' : 'shadow-none'
      )}
    >
      <div className="mx-auto flex h-full w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side: Mobile Menu + Logo + Desktop Nav */}
        <div className="flex items-center gap-3 lg:gap-8 min-w-0">
          {/* Mobile Navigation Sheet Trigger */}
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-9 w-9 text-[#0F172A] hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 sm:w-80 p-0 flex flex-col">
              <SheetHeader className="p-4 border-b border-[#CBD5E1] flex flex-row items-center justify-between text-left">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] rounded-lg"
                >
                  <Image
                    src="/logo.png"
                    alt="Webethics Logo"
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-lg object-cover shadow-xs"
                    priority
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-base tracking-tight text-[#0F172A]">
                      Webethics
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-[#334155]">
                      Intelligence Portal
                    </span>
                  </div>
                </Link>
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              </SheetHeader>

              {/* Mobile Drawer Links */}
              <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isItemActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileNavOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]',
                        active
                          ? 'bg-[#EFF6FF] text-[#2563eb] border-l-3 border-[#2563eb] pl-2.5'
                          : 'text-[#000000] hover:bg-[#F3F4F6] hover:text-[#000000]'
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-4 w-4 shrink-0',
                          active ? 'text-[#2563eb]' : 'text-black'
                        )}
                      />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]"
          >
            <Image
              src="/logo.svg"
              alt="Webethics Logo"
              width={140}
              height={36}
              className=""
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]',
                    active
                      ? 'bg-[#EFF6FF] text-[#2563eb] after:absolute after:bottom-0 after:left-2 after:right-2 after:h-[2px] after:bg-[#2563eb]'
                      : 'text-[#000000] hover:bg-[#F3F4F6] hover:text-[#000000]'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-4 w-4 shrink-0',
                      active ? 'text-[#2563eb]' : 'text-black'
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Side: Logged-in User Trigger & Dropdown */}
        <div className="flex items-center shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2.5 h-10 px-2 sm:px-2.5 rounded-lg hover:bg-[#F3F4F6] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:outline-none cursor-pointer"
                aria-label="User account menu"
              >
                <Avatar className="h-8 w-8 border border-[#BFDBFE]">
                  <AvatarFallback className="bg-[#DBEAFE] text-[#2563eb] text-xs font-bold">
                    HV
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm text-[#0F172A]">
                  Harsh Vardhan
                </span>
                <ChevronDown className="hidden sm:inline h-4 w-4 text-black" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-[260px] p-1.5"
            >
              {/* Header section */}
              <div className="flex items-center gap-2.5 p-2 rounded-md bg-[#F9FAFB] border border-[#E5E7EB] mb-1">
                <Avatar className="h-8 w-8 border border-[#BFDBFE] shrink-0">
                  <AvatarFallback className="bg-[#DBEAFE] text-[#2563eb] text-xs font-bold">
                    HV
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-[#0F172A] truncate">
                    Harsh Vardhan
                  </span>
                  <span
                    className="text-[11px] text-[#334155] truncate font-mono"
                    title="info.webethics@gmail.com"
                  >
                    info.webethics@gmail.com
                  </span>
                  <span className="text-[10px] text-black tracking-tight mt-0.5">
                    Internal Corporate Access
                  </span>
                </div>
              </div>

              {/* Account Settings */}
              <DropdownMenuItem asChild>
                <Link
                  href="/settings"
                  className="flex items-center gap-2.5 cursor-pointer text-sm text-[#000000]"
                >
                  <User className="h-4 w-4 text-black" />
                  <span>Account Settings</span>
                </Link>
              </DropdownMenuItem>

              {/* Change Password */}
              <DropdownMenuItem asChild>
                <Link
                  href="/settings?tab=password"
                  className="flex items-center gap-2.5 cursor-pointer text-sm text-[#000000]"
                >
                  <KeyRound className="h-4 w-4 text-black" />
                  <span>Change Password</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Log Out */}
              <DropdownMenuItem
                className="gap-2.5 cursor-pointer text-sm text-[#DC2626] focus:text-[#DC2626] focus:bg-red-50"
                onClick={() => alert('Log out clicked')}
              >
                <LogOut className="h-4 w-4 text-[#DC2626]" />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
