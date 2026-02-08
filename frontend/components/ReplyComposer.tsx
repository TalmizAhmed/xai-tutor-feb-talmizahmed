"use client";

import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import {
  Clock,
  Paperclip,
  Smile,
  LayoutTemplate,
  MoreHorizontal,
  Maximize2,
  X,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createEmail, revalidateEmails } from "@/lib/api";
import type { Email } from "@/lib/types";

interface ReplyComposerProps {
  emailId: number | null;
  fullSize?: boolean;
}

export function ReplyComposer({ emailId, fullSize = false }: ReplyComposerProps) {
  const { mutate } = useSWRConfig();
  const { data: email } = useSWR<Email>(
    emailId ? `/emails/${emailId}` : null
  );

  const defaultRecipient = email?.sender_name ?? "";
  const defaultRecipientEmail = email?.sender_email ?? "";

  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function handleSend() {
    if (!body.trim()) return;

    setIsSending(true);
    try {
      await createEmail({
        sender_name: "Richard Brown",
        sender_email: "richard.brown@business.com",
        recipient: defaultRecipient || "recipient@example.com",
        subject: email ? `Re: ${email.subject}` : "New Message",
        body: body.trim(),
      });
      revalidateEmails(mutate);
      setBody("");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="border-t border-gray-200">
      {/* Composer header */}
      <div className="flex items-center justify-between px-6 py-2 border-b border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>To:</span>
          {defaultRecipient ? (
            <span className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-sm text-gray-700">
              {defaultRecipient}
              <ChevronDown className="h-3 w-3 text-gray-400" />
            </span>
          ) : (
            <span className="text-gray-400">Select recipient...</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button className="rounded p-1 text-gray-400 hover:bg-gray-100">
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
          <button className="rounded p-1 text-gray-400 hover:bg-gray-100">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-3">
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={
            defaultRecipient
              ? `Reply to ${defaultRecipient}...`
              : "Write your message..."
          }
          className={`resize-none border-0 p-0 text-sm shadow-none focus-visible:ring-0 ${
            fullSize ? "min-h-[300px]" : "min-h-[120px]"
          }`}
        />
      </div>

      <Separator />

      {/* Footer: Send Now + action icons in one tight cluster (per implementation.jpeg) */}
      <div className="flex items-center gap-1 px-6 py-3">
        <Button
          onClick={handleSend}
          disabled={isSending || !body.trim()}
          className="h-8 gap-1.5 bg-gray-900 text-white hover:bg-gray-800"
        >
          Send Now
          <Clock className="h-3.5 w-3.5" />
        </Button>

        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                <Paperclip className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Attach file</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                <Smile className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Emoji</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                <LayoutTemplate className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Template</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>More options</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
