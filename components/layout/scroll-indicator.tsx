import { cn } from "@/lib/utils";

/** "Scroll to Explore" indicator for the hero. */
export function ScrollIndicator({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 text-white/70",
        className,
      )}
    >
      <span className="font-sans text-[0.7rem] uppercase tracking-[0.28em]">
        Scroll to Explore
      </span>
      <span className="relative flex h-11 w-6 justify-center rounded-full border border-white/40">
        <span className="mt-2 h-2 w-1 animate-bounce rounded-full bg-white/80" />
      </span>
    </div>
  );
}
