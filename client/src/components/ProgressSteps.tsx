import React from "react";
import { Check } from "lucide-react";
import { StepType } from "@/components/QuoteBuilder";

interface ProgressStepsProps {
  currentStep: StepType;
}

const STEPS = [
  { n: 1, label: "Project Details" },
  { n: 2, label: "Extras" },
  { n: 3, label: "Construction" },
  { n: 4, label: "Site" },
  { n: 5, label: "Client" },
  { n: 6, label: "Summary" },
] as const;

export default function ProgressSteps({ currentStep }: ProgressStepsProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {STEPS.map((step, idx) => {
          const done = step.n < currentStep;
          const active = step.n === currentStep;
          const isLast = idx === STEPS.length - 1;
          return (
            <React.Fragment key={step.n}>
              <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    done
                      ? "bg-[#1f3d2b] text-white shadow-sm"
                      : active
                      ? "bg-[#1f3d2b] text-white ring-4 ring-[#1f3d2b]/20 shadow-md"
                      : "bg-gray-100 text-gray-400 border border-gray-200"
                  }`}
                >
                  {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : step.n}
                </div>
                <span
                  className={`text-[10px] font-medium text-center leading-tight max-w-[56px] hidden sm:block ${
                    active ? "text-[#1f3d2b] font-semibold" : done ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div className={`flex-1 h-0.5 mx-1 sm:mx-2 transition-all ${done ? "bg-[#1f3d2b]" : "bg-gray-200"}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
