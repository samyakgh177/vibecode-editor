"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  FileText, 
  Loader2,
  Power,
  PowerOff,
} from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import { AIChatSidePanel, type AIChatActiveFile } from "@/modules/ai-chat/components/ai-chat-sidebarpanel";

interface ToggleAIProps {
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
  suggestionLoading: boolean;
  loadingProgress?: number;
  activeFeature?: string;
  activeFile?: AIChatActiveFile | null;
  onInsertCode?: (code: string) => void;
  onApplyFile?: (newContent: string) => void;
  onOpenChat?: () => void;
}

const ToggleAI: React.FC<ToggleAIProps> = ({
  isEnabled,
  onToggle,
  suggestionLoading,
  loadingProgress = 0,
  activeFeature,
  activeFile,
  onInsertCode,
  onApplyFile,
  onOpenChat,
}) => {
  const [internalChatOpen, setInternalChatOpen] = useState(false);

  const handleOpenChat = () => {
    if (onOpenChat) {
      onOpenChat();
    } else {
      setInternalChatOpen(true);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            size="sm" 
            variant={isEnabled ? "default" : "outline"}
            className={cn(
              "relative gap-2 h-8 px-2.5 text-xs font-medium transition-all duration-200",
              isEnabled 
                ? "bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border-zinc-700/60" 
                : "bg-background hover:bg-accent text-zinc-400 border-border",
              suggestionLoading && "opacity-75"
            )}
            onClick={(e) => e.preventDefault()}
          >
            {suggestionLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-400" />
            ) : (
              <Bot className="h-3.5 w-3.5 text-indigo-400" />
            )}
            <span>Inline AI</span>
            {isEnabled ? (
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            ) : (
              <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 bg-zinc-900 border-zinc-800 text-zinc-200">
          <DropdownMenuLabel className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-indigo-400" />
              <span className="text-sm font-medium">Inline Suggestions</span>
            </div>
            <Badge 
              variant="outline" 
              className={cn(
                "text-[10px] px-1.5 py-0.2",
                isEnabled 
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" 
                  : "bg-zinc-800 text-zinc-500 border-zinc-700"
              )}
            >
              {isEnabled ? "Active" : "Paused"}
            </Badge>
          </DropdownMenuLabel>
          
          {suggestionLoading && activeFeature && (
            <div className="px-3 pb-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{activeFeature}</span>
                  <span>{Math.round(loadingProgress)}%</span>
                </div>
                <Progress 
                  value={loadingProgress} 
                  className="h-1.5"
                />
              </div>
            </div>
          )}
          
          <DropdownMenuSeparator className="bg-zinc-800" />
          
          <DropdownMenuItem 
            onClick={() => onToggle(!isEnabled)}
            className="py-2 cursor-pointer hover:bg-zinc-800 focus:bg-zinc-800"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2.5">
                {isEnabled ? (
                  <Power className="h-4 w-4 text-emerald-400" />
                ) : (
                  <PowerOff className="h-4 w-4 text-zinc-500" />
                )}
                <div>
                  <div className="text-xs font-medium">
                    {isEnabled ? "Disable" : "Enable"} Inline AI
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    Ctrl+Space code completions
                  </div>
                </div>
              </div>
              <div className={cn(
                "w-7 h-3.5 rounded-full border transition-all duration-200 relative",
                isEnabled 
                  ? "bg-emerald-600 border-emerald-500" 
                  : "bg-zinc-800 border-zinc-700"
              )}>
                <div className={cn(
                  "w-2.5 h-2.5 rounded-full bg-white transition-all duration-200 absolute top-0.5",
                  isEnabled ? "left-3.5" : "left-0.5"
                )} />
              </div>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-zinc-800" />
          
          <DropdownMenuItem 
            onClick={handleOpenChat}
            className="py-2 cursor-pointer hover:bg-zinc-800 focus:bg-zinc-800"
          >
            <div className="flex items-center gap-2.5 w-full">
              <FileText className="h-4 w-4 text-indigo-400" />
              <div>
                <div className="text-xs font-medium">Open AI Assistant Panel</div>
                <div className="text-[10px] text-zinc-400">
                  Full conversational coding assistant
                </div>
              </div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {!onOpenChat && (
        <AIChatSidePanel
          isOpen={internalChatOpen}
          onClose={() => setInternalChatOpen(false)}
          activeFile={activeFile}
          onInsertCode={onInsertCode}
          onApplyFile={onApplyFile}
        />
      )}
    </>
  );
};

export default ToggleAI;
