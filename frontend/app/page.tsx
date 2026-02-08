"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { EmailList } from "@/components/EmailList";
import { EmailDetail } from "@/components/EmailDetail";
import { ReplyComposer } from "@/components/ReplyComposer";

export default function Home() {
  const [selectedEmailId, setSelectedEmailId] = useState<number | null>(2); // default to Jane Doe's email
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNewComposer, setShowNewComposer] = useState(false);

  function handleSelectEmail(id: number) {
    setSelectedEmailId(id);
    setShowNewComposer(false);
  }

  function handleNewMessage() {
    setSelectedEmailId(null);
    setShowNewComposer(true);
  }

  function handleToggleCollapse() {
    setIsCollapsed((prev) => !prev);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Left sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header onNewMessage={handleNewMessage} />

        {/* Content: email list + detail/composer */}
        <div className="flex flex-1 overflow-hidden">
          {/* Email list panel */}
          <EmailList
            selectedEmailId={selectedEmailId}
            onSelectEmail={handleSelectEmail}
          />

          {/* Right panel: detail + composer */}
          <div className="flex flex-1 flex-col overflow-hidden border-l border-gray-200">
            {selectedEmailId && !showNewComposer ? (
              <>
                <EmailDetail
                  emailId={selectedEmailId}
                  onDelete={() => setSelectedEmailId(null)}
                />
                <ReplyComposer emailId={selectedEmailId} />
              </>
            ) : showNewComposer ? (
              <div className="flex flex-1 flex-col overflow-y-auto">
                <ReplyComposer emailId={null} fullSize />
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center text-gray-400">
                Select an email to read
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
