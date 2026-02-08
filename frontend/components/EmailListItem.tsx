"use client";

import { Archive, Forward, MoreVertical, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials, getAvatarColor } from "@/lib/avatar";
import { formatEmailDate } from "@/lib/date";
import type { EmailListEntry } from "@/lib/types";

interface EmailListItemProps {
  email: EmailListEntry;
  isSelected: boolean;
  onSelect: () => void;
  onArchive: () => void;
  onDelete: () => void;
}

export function EmailListItem({
  email,
  isSelected,
  onSelect,
  onArchive,
  onDelete,
}: EmailListItemProps) {
  const initials = getInitials(email.sender_name);
  const avatarColor = getAvatarColor(email.sender_name);

  return (
    <div
      onClick={onSelect}
      className={`group relative flex cursor-pointer gap-3 border-b border-gray-100 px-4 py-3 transition-colors hover:bg-gray-50 ${
        isSelected ? "bg-blue-50/60 border-l-2 border-l-blue-500" : ""
      }`}
    >
      {/* Avatar */}
      <Avatar className="h-9 w-9 shrink-0">
        <AvatarFallback
          style={{ backgroundColor: avatarColor }}
          className="text-xs font-medium text-white"
        >
          {initials}
        </AvatarFallback>
      </Avatar>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span
            className={`text-sm truncate ${
              !email.is_read ? "font-semibold text-gray-900" : "text-gray-700"
            }`}
          >
            {email.sender_name}
          </span>
          <span className="ml-2 shrink-0 text-xs text-gray-400">
            {formatEmailDate(email.created_at)}
          </span>
        </div>
        <p className="truncate text-sm text-gray-800">{email.subject}</p>
        <p className="truncate text-xs text-gray-400 mt-0.5">
          {email.preview}
        </p>
      </div>

      {/* Unread indicator */}
      {!email.is_read && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-blue-500 group-hover:hidden" />
      )}

      {/* Hover actions */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden items-center gap-0.5 group-hover:flex">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onArchive();
              }}
              className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
            >
              <Archive className="h-3.5 w-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">Archive</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
            >
              <Forward className="h-3.5 w-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">Forward</TooltipContent>
        </Tooltip>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onArchive();
              }}
            >
              <Archive className="mr-2 h-3.5 w-3.5" />
              Archive
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
