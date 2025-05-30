
"use client"; // Required for useState and client-side interactions

import type { Metadata } from 'next'; // Keep this for static metadata, but the component itself is client-side
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Toaster } from "@/components/ui/toaster";
import { EmployeeProvider } from '@/contexts/employee-context';
import { ChatPanel } from '@/components/chat/chat-panel'; // Import the ChatPanel
import React, { useState } from 'react'; // Import useState

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Note: Metadata export is fine for server components, but RootLayout is now client-side
// export const metadata: Metadata = { 
//   title: 'HR Compass',
//   description: 'Your Human Resources Information Hub',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);

  const toggleChatPanel = () => {
    setIsChatPanelOpen(prev => !prev);
  };

  const closeChatPanel = () => {
    setIsChatPanelOpen(false);
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Metadata can be placed directly in head for client components if needed, or keep static export */}
        <title>HR Compass</title>
        <meta name="description" content="Your Human Resources Information Hub" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <EmployeeProvider>
          <SidebarProvider defaultOpen>
            <AppSidebar toggleChatPanel={toggleChatPanel} />
            <SidebarInset>
              <div className="p-4 md:p-6 min-h-screen">
                {children}
              </div>
            </SidebarInset>
          </SidebarProvider>
          <Toaster />
          <ChatPanel isOpen={isChatPanelOpen} onClose={closeChatPanel} />
        </EmployeeProvider>
      </body>
    </html>
  );
}
