import { Github } from "lucide-react";
import Image from "next/image";

const AddRepo = () => {
  return (
    <div
      className="group relative px-6 py-6 flex flex-row justify-between items-center rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/80 hover:border-purple-500/50 cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-purple-500/10 backdrop-blur-sm"
    >
      <div className="flex flex-row justify-center items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
          <Github className="h-6 w-6" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-zinc-100 group-hover:text-white transition-colors">
              Import from GitHub
            </h2>
            <span className="flex items-center gap-1 rounded bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-medium text-purple-400 border border-purple-500/20">
              Git
            </span>
          </div>
          <p className="text-sm text-zinc-400 max-w-[240px] mt-0.5">
            Open repositories straight into your in-browser WebContainer sandbox
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden opacity-80 group-hover:opacity-100 transition-opacity">
        <Image
          src={"/github.svg"}
          alt="Open GitHub repository"
          width={120}
          height={120}
          className="transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    </div>
  );
};

export default AddRepo;
