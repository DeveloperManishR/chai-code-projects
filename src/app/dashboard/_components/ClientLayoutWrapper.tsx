'use client';

import React, { useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import Sidebar from './Sidebar';
import Header from './Header';
import FloatingAIChat from './FloatingAIChat';
import { useChatStore } from '@/store/chatStore';
import { motion } from 'motion/react';

type ClientLayoutWrapperProps = {
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    imageUrl: string;
  };
  projectName: string;
  children: React.ReactNode;
};

export default function ClientLayoutWrapper({
  user,
  projectName,
  children,
}: ClientLayoutWrapperProps) {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      useChatStore.getState().setTheme(savedTheme);
    }
  }, []);

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground font-sans antialiased">
          <Sidebar projectName={projectName} user={user} />

          <div className="flex-1 flex flex-col min-w-0 relative">
            <Header user={user} projectName={projectName} />
            <main className="flex-1 overflow-hidden relative">
              <motion.div
                key={typeof children === 'object' && children !== null ? 'page-content' : 'fallback'}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="h-full"
              >
                {children}
              </motion.div>
            </main>
          </div>

          <FloatingAIChat user={user} projectName={projectName} />
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
