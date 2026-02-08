"use client";

import { MoreVertical } from "lucide-react";
import useSWR, { useSWRConfig } from "swr";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmailListItem } from "@/components/EmailListItem";
import { updateEmail, deleteEmail, revalidateEmails } from "@/lib/api";
import type { EmailListEntry, EmailFilter } from "@/lib/types";
import { useState } from "react";

interface EmailListProps {
  selectedEmailId: number | null;
  onSelectEmail: (id: number) => void;
}

export function EmailList({ selectedEmailId, onSelectEmail }: EmailListProps) {
  const [activeTab, setActiveTab] = useState<EmailFilter>("all");
  const { mutate } = useSWRConfig();

  const { data, error, isLoading } = useSWR<{ emails: EmailListEntry[] }>(
    `/emails?filter=${activeTab}`
  );

  const emails = data?.emails ?? [];

  async function handleArchive(id: number) {
    await updateEmail(id, { archived: true });
    revalidateEmails(mutate);
  }

  async function handleDelete(id: number) {
    await deleteEmail(id);
    revalidateEmails(mutate);
  }

  return (
    <div className="flex w-[340px] shrink-0 flex-col border-r border-gray-200">
      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as EmailFilter)}
        >
          <TabsList className="h-8 bg-transparent p-0 gap-0">
            <TabsTrigger
              value="all"
              className="rounded-md px-3 py-1 text-sm data-[state=active]:bg-gray-900 data-[state=active]:text-white"
            >
              All Mails
            </TabsTrigger>
            <TabsTrigger
              value="unread"
              className="rounded-md px-3 py-1 text-sm data-[state=active]:bg-gray-900 data-[state=active]:text-white"
            >
              Unread
            </TabsTrigger>
            <TabsTrigger
              value="archive"
              className="rounded-md px-3 py-1 text-sm data-[state=active]:bg-gray-900 data-[state=active]:text-white"
            >
              Archive
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <button className="rounded p-1 text-gray-400 hover:bg-gray-100">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      {/* Email list */}
      <ScrollArea className="flex-1">
        <TooltipProvider delayDuration={300}>
          {isLoading && (
            <div className="flex items-center justify-center py-12 text-sm text-gray-400">
              Loading...
            </div>
          )}
          {error && (
            <div className="flex items-center justify-center py-12 text-sm text-red-400">
              Failed to load emails
            </div>
          )}
          {!isLoading && !error && emails.length === 0 && (
            <div className="flex items-center justify-center py-12 text-sm text-gray-400">
              No emails found
            </div>
          )}
          {emails.map((email) => (
            <EmailListItem
              key={email.id}
              email={email}
              isSelected={email.id === selectedEmailId}
              onSelect={() => onSelectEmail(email.id)}
              onArchive={() => handleArchive(email.id)}
              onDelete={() => handleDelete(email.id)}
            />
          ))}
        </TooltipProvider>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-gray-200 px-4 py-2 text-xs text-gray-400 text-right">
        1-{emails.length} of 2,312
      </div>
    </div>
  );
}
