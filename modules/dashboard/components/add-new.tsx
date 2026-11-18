"use client";

import { Plus, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import TemplateSelectingModal from "./template-selecting-modal";
import { createPlayground } from "../actions";

const AddNewButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: {
    title: string;
    template: "REACT" | "NEXTJS" | "EXPRESS" | "HONO";
    description?: string;
  }) => {
    const res = await createPlayground(data);
    toast.success("Playground created successfully");
    setIsModalOpen(false);
    if (res?.id) {
      router.push(`/playground/${res.id}`);
    }
  };

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="group relative px-6 py-6 flex flex-row justify-between items-center rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/80 hover:border-indigo-500/50 cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-indigo-500/10 backdrop-blur-sm"
      >
        <div className="flex flex-row justify-center items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">
            <Plus className="h-6 w-6 transition-transform duration-300 group-hover:rotate-90" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-zinc-100 group-hover:text-white transition-colors">
                Create New Project
              </h2>
              <span className="flex items-center gap-1 rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-medium text-indigo-400 border border-indigo-500/20">
                <Sparkles className="h-3 w-3" /> Starter
              </span>
            </div>
            <p className="text-sm text-zinc-400 max-w-[240px] mt-0.5">
              Instant Node.js & React containers with AI assistance
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden opacity-80 group-hover:opacity-100 transition-opacity">
          <Image
            src={"/add-new.svg"}
            alt="Create new playground"
            width={120}
            height={120}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>

      <TemplateSelectingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default AddNewButton;
