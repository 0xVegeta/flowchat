"use client";

import { useState } from "react";
import { MessageSquare, Plus, Home, Search, Settings, Eye, EyeOff, Check } from "lucide-react";
import { useSettingsStore, PROVIDERS, type ProviderId } from "@/store/settingsStore";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Mock data for recent chats
const recentChats = [
  {
    title: "How to improve productivity?",
    id: "chat-1",
    timestamp: "2 hours ago",
  },
  {
    title: "JavaScript best practices",
    id: "chat-2",
    timestamp: "1 day ago",
  },
  {
    title: "Design system guidelines",
    id: "chat-3",
    timestamp: "3 days ago",
  },
];

const navigationItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Search",
    url: "/search",
    icon: Search,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const {
    activeProvider,
    activeModel,
    apiKeys,
    setActiveProvider,
    setActiveModel,
    setApiKey,
  } = useSettingsStore();

  const [showKey, setShowKey] = useState(false);
  const currentKey = apiKeys[activeProvider] ?? "";
  const currentProvider = PROVIDERS.find((p) => p.id === activeProvider);

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <SidebarMenuButton size="lg" className="justify-start">
          <MessageSquare className="w-5 h-5" />
          <span className="font-semibold">Flow Chat</span>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent>
        {/* ─── Provider + Key Config ─────────────────────────── */}
        <SidebarGroup>
          <SidebarGroupLabel>LLM Provider</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2 space-y-2">
              {/* Provider Dropdown */}
              <select
                id="provider-select"
                value={activeProvider}
                onChange={(e) => setActiveProvider(e.target.value as ProviderId)}
                className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {PROVIDERS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>

              {/* Model Input */}
              <input
                id="model-input"
                type="text"
                value={activeModel}
                onChange={(e) => setActiveModel(e.target.value)}
                placeholder={currentProvider?.defaultModel ?? "Model ID"}
                className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />

              {/* API Key Input */}
              <div className="relative">
                <input
                  id="api-key-input"
                  type={showKey ? "text" : "password"}
                  value={currentKey}
                  onChange={(e) => setApiKey(activeProvider, e.target.value)}
                  placeholder={`${currentProvider?.label ?? ""} API key`}
                  className="w-full rounded-md border border-border bg-background px-3 py-1.5 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showKey ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Status indicator */}
              {currentKey && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-500">
                  <Check className="w-3 h-3" />
                  <span>Key saved for {currentProvider?.label}</span>
                </div>
              )}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="justify-start">
                <Plus className="w-4 h-4" />
                <span>New Chat</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {recentChats.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton asChild>
                    <a href={`/c/${chat.id}`}>
                      <MessageSquare className="w-4 h-4" />
                      <div className="flex-1 min-w-0">
                        <div className="truncate">{chat.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {chat.timestamp}
                        </div>
                      </div>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Settings className="w-4 h-4" />
              <span>Account</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
