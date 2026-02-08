"use client";

import { useEffect } from "react";
import useSWR, { useSWRConfig } from "swr";
import {
  MailOpen,
  Archive,
  Forward,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { AttachmentCard } from "@/components/AttachmentCard";
import { updateEmail, deleteEmail, revalidateEmails } from "@/lib/api";
import { getInitials, getAvatarColor } from "@/lib/avatar";
import { formatEmailDateFull } from "@/lib/date";
import type { Email } from "@/lib/types";

interface EmailDetailProps {
  emailId: number;
  onDelete: () => void;
}

export function EmailDetail({ emailId, onDelete }: EmailDetailProps) {
  const { mutate } = useSWRConfig();
  const { data: email, error, isLoading } = useSWR<Email>(
    `/emails/${emailId}`
  );

  // Mark as read on load
  useEffect(() => {
    if (email && !email.is_read) {
      updateEmail(emailId, { is_read: true }).then(() =>
        revalidateEmails(mutate)
      );
    }
  }, [email, emailId, mutate]);

  async function handleArchive() {
    await updateEmail(emailId, { archived: true });
    revalidateEmails(mutate);
  }

  async function handleDeleteEmail() {
    await deleteEmail(emailId);
    revalidateEmails(mutate);
    onDelete();
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
        Loading...
      </div>
    );
  }

  if (error || !email) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-red-400">
        Failed to load email
      </div>
    );
  }

  const initials = getInitials(email.sender_name);
  const avatarColor = getAvatarColor(email.sender_name);

  return (
    <ScrollArea className="flex-1">
      <div className="px-6 py-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback
                style={{ backgroundColor: avatarColor }}
                className="text-sm font-medium text-white"
              >
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  {email.sender_name}
                </span>
                <span className="text-sm text-gray-400">
                  {email.sender_email}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                To: {email.recipient}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <span className="mr-2 text-xs text-gray-500">
              {formatEmailDateFull(email.created_at)}
            </span>
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                    <MailOpen className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Mark as read</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleArchive}
                    className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  >
                    <Archive className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Archive</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                    <Forward className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Forward</TooltipContent>
              </Tooltip>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleArchive}>
                    <Archive className="mr-2 h-3.5 w-3.5" />
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDeleteEmail}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-3.5 w-3.5" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipProvider>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Subject */}
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {email.subject}
        </h2>

        {/* Body */}
        <div className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
          {email.body}
        </div>

        {/* Attachments */}
        {email.attachments.length > 0 && (
          <div className="mt-6 flex flex-col gap-2">
            {email.attachments.map((attachment, i) => (
              <AttachmentCard key={i} attachment={attachment} />
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
