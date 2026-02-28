import { GripVertical, Eye } from "lucide-react";

export interface LadderStep {
  id: string;
  situation: string;
  anxiety: number;
}

interface LadderBuilderProps {
  steps: LadderStep[];
  onStepsChange: (steps: LadderStep[]) => void;
  onShowExample: () => void;
}

const LadderBuilder = ({ steps, onStepsChange, onShowExample }: LadderBuilderProps) => {
  const updateStep = (id: string, field: keyof LadderStep, value: string | number) => {
    onStepsChange(steps.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const moveStep = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= steps.length) return;
    const newSteps = [...steps];
    [newSteps[index], newSteps[newIndex]] = [newSteps[newIndex], newSteps[index]];
    onStepsChange(newSteps);
  };

  const getAnxietyColor = (val: number) => {
    if (val <= 30) return "bg-therapy-low text-therapy-progress-done";
    if (val <= 60) return "bg-therapy-mid text-foreground/70";
    return "bg-therapy-high text-foreground/70";
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-serif font-bold text-foreground">Build Your Practice Ladder</h2>
          <p className="text-muted-foreground leading-relaxed">
            Arrange situations from least uncomfortable to most uncomfortable.
          </p>
        </div>
        <button
          onClick={onShowExample}
          className="premium-button flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 px-5 py-2.5 rounded-full"
        >
          <Eye className="w-4 h-4" />
          See Example Ladder
        </button>
      </div>

      <div className="relative pl-10">
        {/* Ladder line */}
        <div className="absolute left-3 top-4 bottom-4 w-1 bg-gradient-to-b from-primary/10 via-primary/40 to-primary/10 rounded-full" />

        <div className="space-y-6">
          {steps.map((step, idx) => (
            <div key={step.id} className="relative">
              {/* Ladder rung dot */}
              <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-4 border-background bg-primary shadow-lg z-10 transition-transform hover:scale-125" />

              <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6 group transition-all hover:shadow-premium">
                <div className="flex items-start gap-2">
                  <div className="flex flex-col gap-0.5 pt-1">
                    <button
                      type="button"
                      onClick={() => moveStep(idx, "up")}
                      disabled={idx === 0}
                      className="text-muted-foreground/40 hover:text-muted-foreground disabled:opacity-20 transition-colors"
                      aria-label="Move up"
                    >
                      <GripVertical className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground/50 w-6">
                        {idx + 1}.
                      </span>
                      <input
                        type="text"
                        value={step.situation}
                        onChange={(e) => updateStep(step.id, "situation", e.target.value)}
                        placeholder={
                          idx === 0
                            ? "Touching a public door handle"
                            : idx === 1
                              ? "Shaking hands with a stranger"
                              : idx === 2
                                ? "Using a public washroom"
                                : "Describe the situation…"
                        }
                        className="flex-1 bg-transparent text-lg font-medium text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
                        maxLength={200}
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground/60 w-16">Anxiety</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="10"
                        value={step.anxiety}
                        onChange={(e) => updateStep(step.id, "anxiety", Number(e.target.value))}
                        className="flex-1 h-1.5 accent-primary cursor-pointer"
                      />
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${getAnxietyColor(step.anxiety)}`}
                      >
                        {step.anxiety}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default LadderBuilder;
