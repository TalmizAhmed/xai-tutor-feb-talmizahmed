"use client";

import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onNewMessage: () => void;
}

export function Header({ onNewMessage }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 px-6 py-3">
      <h1 className="text-xl font-semibold">Emails</h1>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search Email"
            className="h-9 w-56 pl-8 text-sm bg-white"
          />
        </div>
        <Button
          onClick={onNewMessage}
          className="h-9 gap-1.5 bg-gray-900 text-white hover:bg-gray-800"
        >
          <Plus className="h-4 w-4" />
          New Message
        </Button>
      </div>
    </header>
  );
}
