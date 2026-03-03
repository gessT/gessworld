import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  steps: Array<{ id: string; title: string; description: string }>;
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="mb-6 flex items-center">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-black transition-all duration-300",
                i < currentStep
                  ? "bg-red-600 text-white"
                  : i === currentStep
                  ? "bg-red-600 text-white ring-2 ring-red-500/30"
                  : "bg-white/8 text-white/30"
              )}
            >
              {i < currentStep ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </div>
            <span
              className={cn(
                "hidden text-[10px] uppercase tracking-widest font-bold sm:block whitespace-nowrap",
                i === currentStep ? "text-white" : "text-white/30"
              )}
            >
              {s.title}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "flex-1 h-px mx-2 mb-4 transition-colors duration-300",
                i < currentStep ? "bg-red-600" : "bg-white/8"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
