"use client";

import { MessageCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { AppSidebar } from "@/components/AppSidebar";
import { ChatFlowCanvas } from "@/components/ChatFlowCanvas";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function ChatPage() {
  const params = useParams();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="h-screen flex flex-col overflow-hidden">
        <header
          className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0"
          data-component="CHAT_SPACE_HEADER"
        >
          <div className="flex items-center space-x-3">
            <SidebarTrigger />
            <div className="w-8 h-8 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-lg flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900 tracking-tight">
              Flow Chat
            </span>
          </div>
        </header>

        <main
          data-component="CHAT_SPACE_BODY"
          className="flex-1 relative w-full min-h-0"
        >
          <ChatFlowCanvas />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
