"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
    Loader2,
    Send,
    User,
    Copy,
    CornerDownLeft,
    FileCode,
    X,
    Sparkles,
    RefreshCw,
    Settings,
    Brain,
    Search,
    Download,
    Trash2,
    Cpu,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import {
    TooltipProvider,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import "katex/dist/katex.min.css";
import Image from "next/image";

interface ChatMessage {
    role: "user" | "assistant";
    content: string;
    id: string;
    timestamp: Date;
    tokens?: number;
    model?: string;
}

export interface AIChatActiveFile {
    filename: string;
    content: string;
    fileExtension?: string;
}

interface AIChatSidePanelProps {
    isOpen: boolean;
    onClose: () => void;
    activeFile?: AIChatActiveFile | null;
    onInsertCode?: (code: string) => void;
    onApplyFile?: (newContent: string) => void;
}

const MessageHeader: React.FC<{
    model?: string;
    tokens?: number;
}> = ({ model, tokens }) => {
    return (
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                <span className="text-xs font-semibold text-zinc-300">
                    AI Assistant
                </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
                {model && (
                    <span className="font-mono text-[11px] bg-zinc-800/80 px-1.5 py-0.5 rounded text-zinc-400 border border-zinc-700/50">
                        {model}
                    </span>
                )}
                {tokens && <span>{tokens} tokens</span>}
            </div>
        </div>
    );
};

export const AIChatSidePanel: React.FC<AIChatSidePanelProps> = ({
    isOpen,
    onClose,
    activeFile,
    onInsertCode,
    onApplyFile,
}) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [autoSave, setAutoSave] = useState(true);
    const [streamResponse, setStreamResponse] = useState(true);
    const [model, setModel] = useState<string>("openai/gpt-oss-120b");

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            scrollToBottom();
        }, 100);
        return () => clearTimeout(timeoutId);
    }, [messages, isLoading]);

    const handleSendMessage = async (e?: React.FormEvent, directPrompt?: string) => {
        if (e) e.preventDefault();
        const promptToSend = (directPrompt !== undefined ? directPrompt : input).trim();
        if (!promptToSend || isLoading) return;

        const newMessage: ChatMessage = {
            role: "user",
            content: promptToSend,
            timestamp: new Date(),
            id: Date.now().toString(),
        };

        setMessages((prev) => [...prev, newMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: promptToSend,
                    history: messages.slice(-10).map((msg) => ({
                        role: msg.role,
                        content: msg.content,
                    })),
                    stream: streamResponse,
                    model,
                    activeFile: activeFile
                        ? {
                            filename: activeFile.filename,
                            content: activeFile.content,
                            language: activeFile.fileExtension,
                        }
                        : undefined,
                }),
            });

            if (response.ok) {
                const data = await response.json();

                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content: data.response,
                        timestamp: new Date(),
                        id: (Date.now() + 1).toString(),
                        tokens: data.tokens,
                        model: data.model || model,
                    },
                ]);
            } else {
                const errData = await response.json().catch(() => ({}));
                const errMessage =
                    errData.details ||
                    errData.error ||
                    "Sorry, I encountered an error while processing your request. Please try again.";

                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content: `⚠️ ${errMessage}`,
                        timestamp: new Date(),
                        id: (Date.now() + 1).toString(),
                    },
                ]);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "I'm having trouble connecting right now. Please check your internet connection and try again.",
                    timestamp: new Date(),
                    id: (Date.now() + 1).toString(),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const exportChat = () => {
        const chatData = {
            messages,
            timestamp: new Date().toISOString(),
        };
        const blob = new Blob([JSON.stringify(chatData, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ai-chat-${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const filteredMessages = messages.filter((msg) => {
        if (!searchTerm.trim()) return true;
        return msg.content.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <TooltipProvider>
            <>
                {/* Backdrop */}
                <div
                    className={cn(
                        "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300",
                        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    )}
                    onClick={onClose}
                />

                {/* Side Panel */}
                <div
                    className={cn(
                        "fixed right-0 top-0 h-full w-full max-w-5xl bg-zinc-950 border-l border-zinc-800 z-50 flex flex-col transition-transform duration-300 ease-out shadow-2xl",
                        isOpen ? "translate-x-0" : "translate-x-full"
                    )}
                >
                    {/* Header */}
                    <div className="shrink-0 border-b border-zinc-800 bg-zinc-900/90 backdrop-blur-md">
                        <div className="flex items-center justify-between px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="relative w-9 h-9 border border-indigo-500/30 rounded-xl bg-indigo-500/10 flex items-center justify-center shadow-xs">
                                    <Image src={"/logo.svg"} alt="Logo" width={22} height={22} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-1.5">
                                            AI Assistant
                                        </h2>
                                        {activeFile ? (
                                            <span className="flex items-center gap-1 rounded-md bg-indigo-500/10 px-2 py-0.5 text-[11px] font-medium text-indigo-400 border border-indigo-500/25">
                                                <FileCode className="h-3 w-3" /> {activeFile.filename}
                                            </span>
                                        ) : (
                                            <span className="rounded-md bg-zinc-800/80 px-2 py-0.5 text-[11px] text-zinc-500 border border-zinc-700/50">
                                                No active file
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-zinc-400 mt-0.5">
                                        {activeFile
                                            ? `Full editor context loaded • Ready to write, review & edit`
                                            : "Open a file in the editor to provide direct context"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                                            title="Settings"
                                        >
                                            <Settings className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-zinc-800 text-zinc-200">
                                        <DropdownMenuCheckboxItem
                                            checked={autoSave}
                                            onCheckedChange={setAutoSave}
                                        >
                                            Auto-save conversations
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem
                                            checked={streamResponse}
                                            onCheckedChange={setStreamResponse}
                                        >
                                            Stream responses
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuSeparator className="bg-zinc-800" />
                                        <DropdownMenuItem onClick={exportChat} className="cursor-pointer">
                                            <Download className="h-4 w-4 mr-2" />
                                            Export Chat (JSON)
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => setMessages([])}
                                            className="text-red-400 hover:text-red-300 cursor-pointer"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Clear All Messages
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onClose}
                                    className="h-8 w-8 p-0 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                                    title="Close Assistant"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Unified Single Action / Filter Bar */}
                        <div className="px-6 pb-3 pt-1 flex items-center justify-between gap-4 border-t border-zinc-800/60">
                            <div className="flex items-center gap-2 text-xs text-zinc-400">
                                <Cpu className="h-3.5 w-3.5 text-indigo-400" />
                                <span className="text-zinc-500 font-medium">Model:</span>
                                <select
                                    value={model}
                                    onChange={(e) => setModel(e.target.value)}
                                    className="bg-zinc-900 border border-zinc-800 rounded-md px-2.5 py-1 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                                >
                                    <option value="openai/gpt-oss-120b">GPT OSS 120B (Deep Coding & Long Files)</option>
                                    <option value="openai/gpt-oss-20b">GPT OSS 20B (Balanced & Fast)</option>
                                    <option value="qwen/qwen3.8-27b">Qwen 3.8 27B (Concise Answers)</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                                    <Input
                                        placeholder="Search chat..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-8 h-7 w-36 sm:w-44 bg-zinc-900/60 border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 rounded-md"
                                    />
                                </div>
                                {messages.length > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setMessages([])}
                                        className="h-7 px-2 text-xs text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition"
                                    >
                                        Clear
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto bg-zinc-950">
                        <div className="p-6 space-y-6">
                            {filteredMessages.length === 0 && !isLoading && (
                                <div className="text-center text-zinc-500 py-12 max-w-xl mx-auto">
                                    <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/10">
                                        <Sparkles className="h-7 w-7 text-indigo-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2 text-zinc-200">
                                        How can I help you code today?
                                    </h3>
                                    <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed mb-6">
                                        Ask questions, review bugs, optimize performance, or generate code. The assistant has direct access to your current open file.
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                                        {[
                                            "Explain what this file does step by step",
                                            "Review this code for bugs & edge cases",
                                            "Optimize performance and clean up logic",
                                            "Add defensive error handling & checks",
                                            "Generate TypeScript types and interfaces",
                                            "Write unit tests for this component",
                                        ].map((suggestion) => (
                                            <button
                                                key={suggestion}
                                                type="button"
                                                onClick={() => {
                                                    setInput(suggestion);
                                                    handleSendMessage(undefined, suggestion);
                                                }}
                                                className="p-3 bg-zinc-900/70 hover:bg-zinc-800/80 border border-zinc-800/80 hover:border-indigo-500/40 rounded-xl text-xs text-zinc-300 hover:text-white transition-all text-left flex items-center gap-2 group cursor-pointer shadow-xs"
                                            >
                                                <Sparkles className="h-3.5 w-3.5 text-indigo-400/70 group-hover:text-indigo-400 shrink-0" />
                                                <span className="truncate">{suggestion}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {filteredMessages.map((msg) => (
                                <div key={msg.id} className="space-y-4">
                                    <div
                                        className={cn(
                                            "flex items-start gap-4 group",
                                            msg.role === "user" ? "justify-end" : "justify-start"
                                        )}
                                    >
                                        {msg.role === "assistant" && (
                                            <div className="relative w-9 h-9 border border-indigo-500/30 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                                <Brain className="h-5 w-5 text-indigo-400" />
                                            </div>
                                        )}

                                        <div
                                            className={cn(
                                                "max-w-[85%] rounded-xl shadow-sm",
                                                msg.role === "user"
                                                    ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-4 rounded-br-xs"
                                                    : "bg-zinc-900/80 backdrop-blur-sm text-zinc-100 p-5 rounded-bl-xs border border-zinc-800/60"
                                            )}
                                        >
                                            {msg.role === "assistant" && (
                                                <MessageHeader
                                                    model={msg.model}
                                                    tokens={msg.tokens}
                                                />
                                            )}

                                            <div className="prose prose-invert prose-sm max-w-none">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm, remarkMath]}
                                                    rehypePlugins={[rehypeKatex]}
                                                    components={{
                                                        code: ({ children, className, ...props }: any) => {
                                                            const match = /language-(\w+)/.exec(className || "");
                                                            const isInline = !match && !String(children).includes("\n");
                                                            if (isInline) {
                                                                return (
                                                                    <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-xs text-indigo-300 font-mono" {...props}>
                                                                        {children}
                                                                    </code>
                                                                );
                                                            }
                                                            const codeString = String(children).replace(/\n$/, "");
                                                            return (
                                                                <div className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden my-4 shadow-sm not-prose">
                                                                    <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900/90 border-b border-zinc-800 text-xs text-zinc-400">
                                                                        <span className="font-mono text-[11px] text-zinc-300 font-semibold uppercase">
                                                                            {match ? match[1] : "code"}
                                                                        </span>
                                                                        <div className="flex items-center gap-1.5">
                                                                            {onInsertCode && (
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => onInsertCode(codeString)}
                                                                                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 transition text-[11px] font-medium cursor-pointer"
                                                                                    title="Insert code at current editor cursor"
                                                                                >
                                                                                    <CornerDownLeft className="h-3 w-3" />
                                                                                    Insert at Cursor
                                                                                </button>
                                                                            )}
                                                                            {onApplyFile && (
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => onApplyFile(codeString)}
                                                                                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition text-[11px] font-medium cursor-pointer"
                                                                                    title="Replace current file with this code"
                                                                                >
                                                                                    <FileCode className="h-3 w-3" />
                                                                                    Apply to File
                                                                                </button>
                                                                            )}
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    navigator.clipboard.writeText(codeString);
                                                                                    toast.success("Copied code to clipboard");
                                                                                }}
                                                                                className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition text-[11px] cursor-pointer"
                                                                                title="Copy code"
                                                                            >
                                                                                <Copy className="h-3 w-3" />
                                                                                Copy
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                    <pre className="p-3 text-sm text-zinc-100 overflow-x-auto font-mono bg-zinc-950">
                                                                        <code className={className} {...props}>{children}</code>
                                                                    </pre>
                                                                </div>
                                                            );
                                                        },
                                                    }}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>
                                            </div>

                                            {/* Message actions */}
                                            <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-800/40">
                                                <div className="text-[11px] text-zinc-500">
                                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(msg.content);
                                                            toast.success("Copied message");
                                                        }}
                                                        className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-200"
                                                        title="Copy message"
                                                    >
                                                        <Copy className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setInput(msg.content)}
                                                        className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-200"
                                                        title="Use as prompt"
                                                    >
                                                        <RefreshCw className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        {msg.role === "user" && (
                                            <Avatar className="h-9 w-9 border border-indigo-400/30 bg-indigo-950 shrink-0 mt-0.5">
                                                <AvatarFallback className="bg-indigo-900 text-indigo-200">
                                                    <User className="h-4 w-4" />
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex items-start gap-4 justify-start">
                                    <div className="relative w-9 h-9 border border-indigo-500/30 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <Brain className="h-5 w-5 text-indigo-400 animate-pulse" />
                                    </div>
                                    <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/50 p-4 rounded-xl rounded-bl-xs flex items-center gap-3">
                                        <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
                                        <span className="text-sm text-zinc-300">
                                            Analyzing code and preparing response...
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} className="h-1" />
                        </div>
                    </div>

                    {/* Input Form */}
                    <form
                        onSubmit={(e) => handleSendMessage(e)}
                        className="shrink-0 p-4 border-t border-zinc-800 bg-zinc-900/90 backdrop-blur-md"
                    >
                        <div className="flex items-end gap-3">
                            <div className="flex-1 relative">
                                <Textarea
                                    placeholder="Ask anything about your code, request changes, or paste code to analyze... (⌘↵ to send)"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                                            handleSendMessage(e as any);
                                        }
                                    }}
                                    disabled={isLoading}
                                    className="min-h-[46px] max-h-36 bg-zinc-950 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:ring-indigo-500/20 resize-none pr-16 text-sm"
                                    rows={1}
                                />
                                <div className="absolute right-3 bottom-3 flex items-center gap-2">
                                    <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] text-zinc-500 bg-zinc-900 border border-zinc-800 rounded font-mono">
                                        ⌘↵
                                    </kbd>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="h-11 px-4 bg-indigo-600 hover:bg-indigo-500 text-white border-0 shadow-md shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </>
        </TooltipProvider>
    );
};
