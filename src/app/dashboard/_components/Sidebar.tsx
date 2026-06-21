'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Mail,
  Calendar as CalendarIcon,
  FileText,
  Send,
  Clock,
  AlertCircle,
  Link2,
  CreditCard,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';

type SidebarProps = {
  projectName: string;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    imageUrl: string;
  };
};

export default function AppSidebar({ projectName, user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const lastSegment = pathname.split('/').pop() || 'inbox';
  const activeTab = (lastSegment === 'draft' || lastSegment === 'drafts') ? 'drafts' : lastSegment;

  const [inboxUnread, setInboxUnread] = useState(0);
  const [draftsTotal, setDraftsTotal] = useState(0);
  const [spamTotal, setSpamTotal] = useState(0);
  const [gmailConnected, setGmailConnected] = useState(false);
  const [calendarConnected, setCalendarConnected] = useState(false);

  useEffect(() => {
    const fetchCounts = async (force: boolean = false) => {
      try {
        const res = await fetch(`/api/labels${force ? '?refresh=true' : ''}`);
        if (res.ok) {
          const data = await res.json();
          setInboxUnread(data.inbox?.unread ?? 0);
          setDraftsTotal(data.drafts?.total ?? 0);
          setSpamTotal(data.spam?.total ?? 0);
          setGmailConnected(data.connections?.gmail ?? false);
          setCalendarConnected(data.connections?.calendar ?? false);
        }
      } catch (err) {
        console.error('Failed to fetch label counts:', err);
      }
    };
    fetchCounts(false);

    const handleRefreshLabels = () => fetchCounts(true);
    window.addEventListener('refresh-labels', handleRefreshLabels);
    return () => window.removeEventListener('refresh-labels', handleRefreshLabels);
  }, []);

  const navigateToTab = (tab: string) => {
    const target = tab === 'drafts' ? 'draft' : tab;
    router.push(`/dashboard/${target}`);
  };

  const navItems = [
    { tab: 'inbox', icon: Mail, label: 'Inbox' },
    { tab: 'drafts', icon: FileText, label: 'Drafts' },
    { tab: 'sent', icon: Send, label: 'Sent' },
    { tab: 'spam', icon: AlertCircle, label: 'Spam' },
    { tab: 'trash', icon: Clock, label: 'Trash' },
    { tab: 'calendar', icon: CalendarIcon, label: 'Calendar' },
  ];

  const settingsItems = [
    { tab: 'integrations', icon: Link2, label: 'Integrations' },
    { tab: 'billing', icon: CreditCard, label: 'Billing' },
  ];

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard/inbox" className="flex items-center gap-2.5">
                <img src="/icon.png" alt="Logo" className="h-6 w-6 shrink-0" />
                <span className="font-bold text-base tracking-tight">{projectName}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(({ tab, icon: Icon, label }) => (
                <SidebarMenuItem key={tab}>
                  <SidebarMenuButton
                    isActive={activeTab === tab}
                    tooltip={label}
                    onClick={() => navigateToTab(tab)}
                  >
                    <Icon className="h-4.5 w-4.5" />
                    <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map(({ tab, icon: Icon, label }) => (
                <SidebarMenuItem key={tab}>
                  <SidebarMenuButton
                    isActive={activeTab === tab}
                    tooltip={label}
                    onClick={() => navigateToTab(tab)}
                  >
                    <Icon className="h-4.5 w-4.5" />
                    <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}
      </SidebarContent>

      <SidebarRail />

      <SidebarFooter className="border-t border-sidebar-border p-3">
        {!isCollapsed ? (
          <div className="space-y-3">
            <div className="rounded-xl bg-sidebar-accent/50 p-2.5 border border-sidebar-border space-y-2">
              <span className="text-[9px] font-bold tracking-wider text-sidebar-foreground/50 uppercase block">Connections</span>
              <div className="flex items-center justify-between text-xs">
                <span className="text-sidebar-foreground/70 font-medium flex items-center">
                  <span className={`w-1.5 h-1.5 rounded-full mr-2 ${gmailConnected ? 'bg-primary' : 'bg-sidebar-foreground/30'}`} />
                  Gmail
                </span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${gmailConnected ? 'bg-primary/15 text-primary' : 'bg-sidebar-accent/50 text-sidebar-foreground/50'}`}>
                  {gmailConnected ? 'Active' : 'Offline'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-sidebar-foreground/70 font-medium flex items-center">
                  <span className={`w-1.5 h-1.5 rounded-full mr-2 ${calendarConnected ? 'bg-primary' : 'bg-sidebar-foreground/30'}`} />
                  Calendar
                </span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${calendarConnected ? 'bg-primary/15 text-primary' : 'bg-sidebar-accent/50 text-sidebar-foreground/50'}`}>
                  {calendarConnected ? 'Active' : 'Offline'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt="Profile" className="h-8 w-8 rounded-full border border-sidebar-border" />
              ) : (
                <div className="h-8 w-8 rounded-full bg-sidebar-accent text-sidebar-accent-foreground font-semibold flex items-center justify-center text-xs">
                  {user?.firstName?.charAt(0) || 'U'}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-sidebar-foreground truncate leading-tight">
                  {user?.firstName || 'User'}
                </p>
                <p className="text-[10px] text-sidebar-foreground/60 truncate leading-none mt-0.5">
                  {user?.email || ''}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-1">
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt="Profile" className="h-7 w-7 rounded-full border border-sidebar-border" />
            ) : (
              <div className="h-7 w-7 rounded-full bg-sidebar-accent text-sidebar-accent-foreground font-semibold flex items-center justify-center text-[10px]">
                {user?.firstName?.charAt(0) || 'U'}
              </div>
            )}
            <div className="flex flex-col items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${gmailConnected ? 'bg-primary' : 'bg-sidebar-foreground/30'}`} />
              <span className={`w-1.5 h-1.5 rounded-full ${calendarConnected ? 'bg-primary' : 'bg-sidebar-foreground/30'}`} style={{ animationDelay: '0.5s' }} />
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
