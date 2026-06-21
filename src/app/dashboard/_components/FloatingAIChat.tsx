'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, ArrowUp, Pause, X,
  History, Plus, MessageSquare, ChevronRight, PanelRightClose,
} from 'lucide-react';
import { useChatStore, ChatMessage } from '@/store/chatStore';
import { motion, AnimatePresence } from 'motion/react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

type FloatingAIChatProps = {
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    imageUrl: string;
  };
  projectName: string;
};

const AgentProgressLoader = () => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 2500);
    const timer2 = setTimeout(() => setStage(2), 5500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const stages = [
    { text: 'Analyzing' },
    { text: 'Processing' },
    { text: 'Completing' },
  ];

  const currentStage = stages[stage] || stages[0];

  return (
    <div className="flex flex-col space-y-2.5 p-4 bg-card border border-border rounded-2xl w-[170px] shadow-sm transition-all duration-300">
      <div className="flex items-center space-x-2.5">
        <div className="h-4 w-4 rounded-full border-2 border-primary/25 border-t-primary animate-spin shrink-0" />
        <span className="text-[11px] font-bold text-muted-foreground select-none flex items-center space-x-1.5">
          <span>{currentStage.text}...</span>
        </span>
      </div>
      <div className="w-full bg-border rounded-full h-1 overflow-hidden">
        <div
          className="bg-primary h-1 rounded-full transition-all duration-500 ease-out"
          style={{ width: stage === 0 ? '30%' : stage === 1 ? '65%' : '90%' }}
        />
      </div>
    </div>
  );
};

function renderLinksAndText(text: string): React.ReactNode[] {
  if (!text) return [];
  const parts: React.ReactNode[] = [];
  let currentIndex = 0;
  const mdLinkRegex = /\[(.*?)\]\((https?:\/\/[^\s)]+)\)/g;
  let match;

  while ((match = mdLinkRegex.exec(text)) !== null) {
    if (match.index > currentIndex) {
      parts.push(...renderRawLinks(text.substring(currentIndex, match.index)));
    }
    const [, linkText, linkUrl] = match;
    parts.push(
      <a key={`md-${match.index}`} href={linkUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
        {linkText}
      </a>
    );
    currentIndex = mdLinkRegex.lastIndex;
  }
  if (currentIndex < text.length) {
    parts.push(...renderRawLinks(text.substring(currentIndex)));
  }
  return parts;
}

function renderRawLinks(text: string): React.ReactNode[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      return (
        <a key={`raw-${index}`} href={part} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all font-semibold inline-block">
          {part}
        </a>
      );
    }
    return part;
  });
}

function formatMessageContent(content: string): React.ReactNode {
  if (!content) return null;
  const lines = content.split('\n');
  return lines.map((line, lineIndex) => {
    const isBulletList = /^\s*[-*]\s+(.*)/.exec(line);
    const renderTextWithMarkdown = (text: string) => {
      const parts: React.ReactNode[] = [];
      let currentIndex = 0;
      const tokenRegex = /(\*\*|\*|`)(.*?)\1/g;
      let match;
      while ((match = tokenRegex.exec(text)) !== null) {
        if (match.index > currentIndex) {
          parts.push(...renderLinksAndText(text.substring(currentIndex, match.index)));
        }
        const [, token, innerText] = match;
        if (token === '**') {
          parts.push(<strong key={match.index} className="font-bold text-foreground">{renderLinksAndText(innerText)}</strong>);
        } else if (token === '*') {
          parts.push(<em key={match.index} className="italic text-foreground/90">{renderLinksAndText(innerText)}</em>);
        } else if (token === '`') {
          parts.push(<code key={match.index} className="bg-background px-1.5 py-0.5 rounded font-mono text-xs text-destructive border border-border break-all">{innerText}</code>);
        }
        currentIndex = tokenRegex.lastIndex;
      }
      if (currentIndex < text.length) {
        parts.push(...renderLinksAndText(text.substring(currentIndex)));
      }
      return parts.length > 0 ? parts : text;
    };

    if (isBulletList) {
      return (
        <ul key={lineIndex} className="list-disc pl-5 my-0.5">
          <li className="text-foreground/80">{renderTextWithMarkdown(isBulletList[1])}</li>
        </ul>
      );
    }
    return (
      <p key={lineIndex} className="min-h-[1.25rem] text-foreground/90 leading-relaxed">
        {renderTextWithMarkdown(line)}
      </p>
    );
  });
}

function Typewriter({ text, speed = 20 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState('');
  useEffect(() => {
    const words = text.split(' ');
    if (words.length === 0) return;
    setDisplayedText(words[0] || '');
    let index = 0;
    const interval = setInterval(() => {
      index++;
      if (index < words.length) {
        setDisplayedText((prev) => prev + ' ' + words[index]);
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return <div className="space-y-1">{formatMessageContent(displayedText)}</div>;
}

function groupMessagesIntoSessions(msgs: ChatMessage[]) {
  if (msgs.length === 0) return [];
  const sortedMsgs = [...msgs].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  const sessions: ChatMessage[][] = [];
  let currentSession: ChatMessage[] = [sortedMsgs[0]];
  for (let i = 1; i < sortedMsgs.length; i++) {
    const prevMsg = sortedMsgs[i - 1];
    const currMsg = sortedMsgs[i];
    const prevTime = new Date(prevMsg.createdAt).getTime();
    const currTime = new Date(currMsg.createdAt).getTime();
    if (currTime - prevTime <= 7200000) {
      currentSession.push(currMsg);
    } else {
      sessions.push(currentSession);
      currentSession = [currMsg];
    }
  }
  if (currentSession.length > 0) sessions.push(currentSession);
  return sessions.reverse();
}

function getSessionTitle(sessionMessages: ChatMessage[]) {
  const firstUserMsg = sessionMessages.find(m => m.role === 'user');
  if (firstUserMsg && firstUserMsg.content.trim()) {
    const text = firstUserMsg.content.trim();
    return text.length > 40 ? text.substring(0, 40) + '...' : text;
  }
  const firstMsg = sessionMessages[0];
  if (firstMsg && firstMsg.content.trim()) {
    const text = firstMsg.content.trim();
    return text.length > 40 ? text.substring(0, 40) + '...' : text;
  }
  return 'Untitled Chat';
}

function getSessionTimeLabel(date: Date) {
  const now = new Date();
  const diffDays = Math.ceil(Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();
  if (isToday) return `Today at ${timeStr}`;
  if (isYesterday) return `Yesterday at ${timeStr}`;
  if (diffDays <= 7) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return `${days[date.getDay()]} at ${timeStr}`;
  }
  return `${date.toLocaleDateString()} at ${timeStr}`;
}

function ChatContent({ user }: { user: FloatingAIChatProps['user'] }) {
  const [activeView, setActiveView] = useState<'chat' | 'history'>('chat');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    historyMessages,
    chatLoading,
    chatInput,
    fetchHistory,
    setMessages,
    sendMessage,
    cancelRequest,
    setChatInput,
    clearPolling,
  } = useChatStore();

  useEffect(() => {
    setMessages([]);
    fetchHistory(user.id);
    return () => clearPolling();
  }, [user.id, fetchHistory, setMessages, clearPolling]);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;
    const threshold = 150;
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
    const lastMessage = messages[messages.length - 1];
    const isLastMessageUser = lastMessage?.role === 'user';
    if (isNearBottom || isLastMessageUser) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, chatLoading]);

  const handleCancel = () => {
    const pendingMsg = [...messages].reverse().find((m) => m.role === 'assistant' && m.status === 'pending');
    if (pendingMsg) cancelRequest(pendingMsg.id);
  };

  const handleSendChat = (text: string) => {
    if (!text.trim()) return;
    sendMessage(
      text,
      user.id,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      new Date().toString(),
      {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        hasGmailConnection: true,
        hasCalendarConnection: true,
      }
    );
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setActiveView('chat');
  };

  const handleToggleHistory = () => {
    if (activeView === 'history') {
      setActiveView('chat');
    } else {
      setActiveView('history');
      fetchHistory(user.id);
    }
  };

  const handleSelectSession = (sessionMsgs: ChatMessage[]) => {
    setMessages(sessionMsgs);
    setActiveView('chat');
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden h-full">
      <div className="h-14 px-5 border-b border-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-bold text-sm text-foreground">
            {activeView === 'history' ? 'Chat History' : 'AI Assistant'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleNewChat}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent/10 hover:text-foreground transition-colors cursor-pointer flex items-center justify-center"
            title="New Chat"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={handleToggleHistory}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center ${
 activeView === 'history'
 ? 'bg-primary/10 text-primary'
 : 'text-muted-foreground hover:bg-accent/10 hover:text-foreground'
 }`}
            title="Chat History"
          >
            <History className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4" style={{ scrollbarGutter: 'stable' }}>
        {activeView === 'history' ? (
          <div className="space-y-2">
            {groupMessagesIntoSessions(historyMessages).length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
                <History className="h-8 w-8 text-primary/40 mb-2" />
                <p className="text-xs">No chat history found.</p>
              </div>
            ) : (
              groupMessagesIntoSessions(historyMessages).map((session, index) => {
                const title = getSessionTitle(session);
                const timeLabel = getSessionTimeLabel(new Date(session[0].createdAt));
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    onClick={() => handleSelectSession(session)}
                    className="p-3 bg-card hover:bg-accent/5 border border-border rounded-xl cursor-pointer transition-all duration-200 group flex items-start gap-3 shadow-sm active:scale-[0.99]"
                  >
                    <MessageSquare className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {title}
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1.5">
                        <span>{timeLabel}</span>
                        <span>•</span>
                        <span>{session.length} message{session.length !== 1 ? 's' : ''}</span>
                      </p>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        ) : (
          <>
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
                <Sparkles className="h-8 w-8 text-primary/40 mb-2" />
                <p className="text-xs">Ask me anything about your emails, drafting answers, or scheduling calendar events!</p>
              </div>
            )}

            {messages.map((msg, index) => {
              const isAssistant = msg.role === 'assistant';
              const isPending = msg.status === 'pending';
              const isCancelled = msg.status === 'cancelled';
              const isFailed = msg.status === 'failed';
              const isLast = index === messages.length - 1;
              const isRecent = new Date().getTime() - new Date(msg.createdAt).getTime() < 12000;

              return (
                <motion.div
                  key={msg.clientKey || msg.id || index}
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25, ease: [0.215, 0.610, 0.355, 1.000] }}
                  className={`flex flex-col space-y-1 max-w-[85%] ${isAssistant ? 'self-start' : 'self-end ml-auto'}`}
                >
                  <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm transition-all duration-200 break-words ${
 isAssistant
 ? isCancelled
 ? 'bg-destructive/10 border border-destructive/20 text-destructive'
 : isFailed
 ? 'bg-destructive/10 border border-destructive/20 text-destructive'
 : 'bg-card border border-border text-foreground'
 : 'bg-primary/10 text-foreground border border-primary/20'
 }`}>
                    {isPending ? (
                      <div className="space-y-2.5">
                        <AgentProgressLoader />
                        {msg.content && (
                          <p className="text-[11px] text-muted-foreground italic pl-1 leading-normal">
                            {msg.content}
                          </p>
                        )}
                      </div>
                    ) : isAssistant && isLast && isRecent ? (
                      <Typewriter text={msg.content || (isFailed ? 'Failed to do that, please try again later.' : '')} />
                    ) : (
                      <div className="font-normal space-y-1">
                        {formatMessageContent(msg.content || (isFailed ? 'Failed to do that, please try again later.' : ''))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </>
        )}
        <div ref={chatEndRef} />
      </div>

      {activeView === 'chat' && (
        <div className="p-4 border-t border-border shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendChat(chatInput);
            }}
            className="relative w-full flex flex-col"
          >
            <textarea
              ref={textareaRef}
              rows={3}
              placeholder="Ask anything..."
              value={chatInput}
              disabled={chatLoading}
              onChange={(e) => {
                setChatInput(e.target.value);
                if (textareaRef.current) {
                  textareaRef.current.style.height = 'auto';
                  textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendChat(chatInput);
                }
              }}
              className="w-full bg-background border border-border rounded-xl py-2.5 pl-4 pr-12 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all shadow-inner resize-none overflow-y-auto"
              style={{ minHeight: '80px', maxHeight: '160px' }}
            />
            {chatLoading ? (
              <button
                type="button"
                onClick={handleCancel}
                className="absolute right-2.5 bottom-2.5 p-1.5 rounded-full bg-destructive hover:bg-destructive/80 text-white transition-all flex items-center justify-center cursor-pointer shadow-sm"
                title="Pause AI Response"
              >
                <Pause className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="absolute right-2.5 bottom-2.5 p-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/80 transition-all flex items-center justify-center cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                title="Send Message"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
}

export default function FloatingAIChat({ user, projectName }: FloatingAIChatProps) {
  const { aiChatOpen, setAiChatOpen } = useChatStore();

  return (
    <>
      <Sheet open={aiChatOpen} onOpenChange={setAiChatOpen}>
        <SheetContent
          side="right"
          className="w-[400px] sm:max-w-[480px] p-0 flex flex-col bg-background border-l border-border"
          showCloseButton={false}
        >
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border shrink-0">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-sm font-bold text-foreground">AI Assistant</SheetTitle>
                <p className="text-[10px] text-muted-foreground">Powered by {projectName}</p>
              </div>
            </div>
            <button
              onClick={() => setAiChatOpen(false)}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent/10 hover:text-foreground transition-colors cursor-pointer flex items-center justify-center"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <ChatContent user={user} />
        </SheetContent>
      </Sheet>

      <button
        onClick={() => setAiChatOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all duration-300 flex items-center justify-center cursor-pointer group active:scale-95"
        title="Open AI Chat"
      >
        <MessageSquare className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
        <span className="absolute inset-0 rounded-full opacity-30 bg-primary" />
      </button>
    </>
  );
}
