"use client";

import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Attachment } from "@/lib/types";

interface AttachmentCardProps {
  attachment: Attachment;
}

export function AttachmentCard({ attachment }: AttachmentCardProps) {
  return (
    <Card className="flex items-center gap-3 px-4 py-3 w-fit">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
        <FileText className="h-5 w-5 text-orange-500" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-800">
          {attachment.name}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>{attachment.size}</span>
          <span>·</span>
          <a
            href={attachment.url}
            className="font-medium text-green-600 hover:underline"
          >
            Download
          </a>
        </div>
      </div>
    </Card>
  );
}
