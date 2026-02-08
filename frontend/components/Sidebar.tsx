"use client";

import {
  LayoutDashboard,
  Bell,
  CheckSquare,
  Calendar,
  Puzzle,
  ShoppingBag,
  Mail,
  Plug,
  Users,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Search,
  Star,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const mainNav = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Bell, label: "Notifications" },
  { icon: CheckSquare, label: "Tasks" },
  { icon: Calendar, label: "Calendar" },
  { icon: Puzzle, label: "Widgets" },
];

const marketingNav = [
  { icon: ShoppingBag, label: "Product" },
  { icon: Mail, label: "Emails", active: true },
  { icon: Plug, label: "Integration" },
  { icon: Users, label: "Contacts" },
];

const favorites = [
  { label: "Opportunity Stages", color: "bg-red-500" },
  { label: "Key Metrics", color: "bg-green-500" },
  { label: "Product Plan", color: "bg-orange-500" },
];

export function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  return (
    <aside
      className={`flex flex-col border-r border-gray-200 bg-gray-50/80 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-[220px]"
      }`}
    >
      {/* Logo + collapse */}
      <div className="flex items-center justify-between px-4 py-4">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-orange-400 text-orange-400" />
            <span className="text-base font-semibold">Cusana</span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="rounded-md p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      <Collapsible open={!isCollapsed} className="flex flex-1 flex-col min-h-0">
        <CollapsibleContent className="flex flex-1 flex-col min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto">
          {/* Search */}
          <div className="px-3 pb-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                className="h-9 pl-8 pr-12 text-sm bg-white"
              />
              <Badge
                variant="secondary"
                className="absolute right-2 top-1.5 px-1.5 py-0.5 text-[10px] font-normal text-gray-400"
              >
                ⌘K
              </Badge>
            </div>
          </div>

          {/* Main nav */}
          <nav className="px-2">
            {mainNav.map((item) => (
              <button
                key={item.label}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </nav>

          <Separator className="my-3" />

          {/* Marketing section */}
          <div className="px-4 pb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
              Marketing
            </span>
          </div>
          <nav className="px-2">
            {marketingNav.map((item) => (
              <button
                key={item.label}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm ${
                  item.active
                    ? "bg-blue-50 font-medium text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </nav>

          <Separator className="my-3" />

          {/* Favorites */}
          <div className="px-4 pb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
              Favorite
            </span>
          </div>
          <nav className="px-2">
            {favorites.map((item) => (
              <button
                key={item.label}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
              >
                <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                {item.label}
              </button>
            ))}
          </nav>

          <Separator className="my-3" />

          {/* Bottom: Settings, Help */}
          <nav className="px-2">
            <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100">
              <Settings className="h-4 w-4" />
              Settings
            </button>
            <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100">
              <HelpCircle className="h-4 w-4" />
              Help & Center
            </button>
          </nav>

          </div>

          <Separator className="my-3 flex-shrink-0" />

          {/* User profile — at bottom of column, minimal padding (per implementation.jpeg) */}
          <div className="mt-auto flex-shrink-0 px-3 pb-2 pt-1">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gray-300 text-xs text-white">
                  RB
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate">
                    Richard Brown
                  </span>
                  <Badge
                    variant="secondary"
                    className="ml-2 h-5 w-5 items-center justify-center rounded-full p-0 text-[10px]"
                  >
                    0
                  </Badge>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <Progress value={62} className="h-1.5" />
              <p className="mt-1 text-[11px] text-gray-400">
                6.2GB of 10GB has been used
              </p>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </aside>
  );
}
