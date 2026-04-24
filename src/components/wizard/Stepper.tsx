import { Check } from "lucide-react";

interface Step {
  id: number;
  label: string;
}

interface StepperProps {
  steps: Step[];
  current: number;
}

export const Stepper = ({ steps, current }: StepperProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto mb-12">
      <div className="flex items-center justify-between relative">
        {/* Background line */}
        <div className="absolute top-5 left-5 right-5 h-[2px] bg-border" />
        {/* Active line */}
        <div
          className="absolute top-5 left-5 h-[2px] bg-gradient-electric transition-all duration-700"
          style={{ width: `calc(${(current / (steps.length - 1)) * 100}% - ${current === steps.length - 1 ? '0px' : '0px'})`, maxWidth: 'calc(100% - 40px)' }}
        />

        {steps.map((step, i) => {
          const isActive = i === current;
          const isDone = i < current;
          return (
            <div key={step.id} className="flex flex-col items-center relative z-10 gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-sm transition-all duration-500 ${
                  isDone
                    ? 'bg-gradient-electric text-primary-foreground shadow-electric'
                    : isActive
                    ? 'bg-card border-2 border-primary text-primary-glow animate-pulse-glow'
                    : 'bg-card border border-border text-muted-foreground'
                }`}
              >
                {isDone ? <Check className="w-5 h-5" strokeWidth={3} /> : step.id}
              </div>
              <div className={`text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-colors ${
                isActive || isDone ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
