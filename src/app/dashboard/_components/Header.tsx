'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Search, Moon, Sun, MessageSquare, LogOut } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { signOut } from '@/utils/auth-client';
import { SidebarTrigger } from '@/components/ui/sidebar';

type HeaderProps = {
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string;
    imageUrl: string;
  };
  projectName: string;
};

export default function Header({
  user,
  projectName,
}: HeaderProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [searchVal, setSearchVal] = useState(searchParams.get('q') || '');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { theme, setTheme, setAiChatOpen, aiChatOpen } = useChatStore();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleAIChat = () => {
    setAiChatOpen(!aiChatOpen);
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (val: string) => {
    setSearchVal(val);
    const params = new URLSearchParams(searchParams.toString());
    if (val.trim()) {
      params.set('q', val);
    } else {
      params.delete('q');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <header className="h-16 border-b border-border flex items-center px-4 md:px-6 bg-background text-foreground shrink-0 transition-colors gap-3 justify-between">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="flex text-muted-foreground hover:text-foreground [&_svg]:size-5" />
      </div>

      <div className="flex-1 max-w-lg mx-auto relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          ref={searchInputRef}
          placeholder="Search mail, events, people..."
          value={searchVal}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full bg-background border border-border rounded-xl py-1.5 pl-10 pr-12 text-sm text-foreground placeholder-muted-foreground shadow-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
        />
        <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground border border-border bg-background px-1.5 py-0.5 rounded shadow-sm select-none">
          ⌘K
        </kbd>
      </div>

      <div className="flex items-center space-x-2 text-muted-foreground">
        <button
          onClick={toggleAIChat}
          className="p-2 rounded-lg transition-all duration-200 cursor-pointer hover:bg-accent/10 hover:text-accent flex items-center justify-center relative group"
          title="Open AI Chat"
        >
          <MessageSquare className="h-4.5 w-4.5" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full " />
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-accent/10 rounded-lg transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
          title={theme === 'dark' ? 'Activate Light Mode' : 'Activate Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="h-4.5 w-4.5 text-amber-400" /> : <Moon className="h-4.5 w-4.5" />}
        </button>

        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center justify-center h-8 w-8 rounded-full bg-accent/10 text-accent hover:bg-accent/20 transition-colors cursor-pointer overflow-hidden"
            title={user.email}
          >
            {user.imageUrl ? (
              <img src={user.imageUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs font-bold">
                {user.firstName?.[0] || user.email[0]?.toUpperCase() || 'U'}
              </span>
            )}
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50 ">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold text-foreground truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
              <div className="p-1">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/5 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
