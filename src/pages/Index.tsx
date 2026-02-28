import { useState, useEffect } from "react";
import { toast } from "sonner";
import PracticeGoal from "@/components/FearLadder/PracticeGoal";
import ThoughtSection from "@/components/FearLadder/ThoughtSection";
import RewardSection from "@/components/FearLadder/RewardSection";
import LadderBuilder from "@/components/FearLadder/LadderBuilder";
import ExampleLadderModal from "@/components/FearLadder/ExampleLadderModal";
import PracticeScreen from "@/components/FearLadder/PracticeScreen";
import CompletionScreen from "@/components/FearLadder/CompletionScreen";
import ProgressPanel from "@/components/FearLadder/ProgressPanel";
import { useFearLadderStorage } from "@/hooks/useFearLadderStorage";

const Index = () => {
  const [showExample, setShowExample] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [userId, setUserId] = useState<string | null>(sessionStorage.getItem("user_id"));

  // ============ HANDSHAKE AUTH PROTOCOL ============
  useEffect(() => {
    const performHandshake = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

      if (token) {
        try {
          // 1. Validate token with MantraCare API
          const response = await fetch("https://api.mantracare.com/user/user-info", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });

          if (response.ok) {
            const userData = await response.json();
            // 2. Store user_id in sessionStorage (Session Isolation)
            // Note: user_id is treated as a BIGINT/string source of truth
            const id = userData.user_id.toString();
            sessionStorage.setItem("user_id", id);
            setUserId(id);

            // 3. Clean URL without refreshing
            const originalUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, originalUrl);

            setIsAuthenticating(false);
          } else {
            throw new Error("Invalid token");
          }
        } catch (error) {
          console.error("Auth Handshake Failed:", error);
          window.location.href = "https://mantracare.com/token"; // External Redirect
        }
      } else {
        // 4. Handle Missing Token
        const existingUser = sessionStorage.getItem("user_id");
        if (existingUser) {
          setUserId(existingUser);
          setIsAuthenticating(false);
        } else {
          // 5. Production Redirect (No token and no session)
          window.location.href = "https://mantracare.com/token";
        }
      }
    };

    performHandshake();
  }, []);

  const {
    data,
    phase,
    completedCount,
    sortedSteps,
    currentStep,
    completedStepIds,
    currentStepAlreadyLogged,
    updateField,
    updateSteps,
    saveSession,
    addLog,
    resetLadder,
    justSaved,
    setJustSaved,
    loading,
  } = useFearLadderStorage(userId);

  if (loading || isAuthenticating) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
        <p className="text-sm text-muted-foreground font-medium animate-pulse text-center max-w-xs">
          Your courage journey continues...
        </p>
      </div>
    );
  }

  const canSave =
    data.goal.trim() !== "" &&
    data.thought.trim() !== "" &&
    data.reward.trim() !== "" &&
    data.steps.some((s) => s.situation.trim() !== "");

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur-xl sticky top-0 z-40 transition-all">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌿</span>
            <span className="text-lg font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              OCD Mantra
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 bg-muted px-2 py-1 rounded-md">
              Fear Ladder Activity
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12 animate-in fade-in duration-700">
        {/* ============ BUILD PHASE ============ */}
        {phase === "build" && (
          <div className="space-y-12">
            {/* Intro */}
            <div className="glass-card rounded-[40px] p-10 md:p-16 shadow-premium relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -ml-24 -mb-24 transition-transform duration-1000 group-hover:scale-110" />

              <div className="relative space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider animate-pulse-soft">
                  Phase 1: Construction
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-8">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white shadow-lg animate-float">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 3v18M18 3v18M6 7h12M6 11h12M6 15h12M6 19h12" />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground tracking-tight leading-tight">
                      Build Your <span className="text-primary italic">Fear Ladder</span>
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                      Start small and gradually move upward. The goal is not to eliminate fear — but to practice staying present with it.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-1 gap-8">
              <div className="glass-card rounded-[32px] p-8 space-y-8">
                <PracticeGoal goal={data.goal} onGoalChange={(v) => updateField("goal", v)} />
                <hr className="border-border/50" />
                <ThoughtSection thought={data.thought} onThoughtChange={(v) => updateField("thought", v)} />
                <hr className="border-border/50" />
                <RewardSection reward={data.reward} onRewardChange={(v) => updateField("reward", v)} />
              </div>

              <div className="glass-card rounded-[32px] p-8">
                <LadderBuilder
                  steps={data.steps}
                  onStepsChange={updateSteps}
                  onShowExample={() => setShowExample(true)}
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-8 flex justify-center">
              <button
                type="button"
                disabled={!canSave}
                onClick={async () => {
                  const result = await saveSession();
                  if (result.success) {
                    toast.success("Your fear ladder is saved!");
                  } else {
                    toast.error("Failed to save. Please try again.");
                  }
                }}
                className="premium-button w-full md:w-auto md:min-w-[300px] py-6 px-12 rounded-full text-lg font-bold bg-primary text-primary-foreground shadow-2xl shadow-primary/30 disabled:opacity-40 disabled:cursor-not-allowed group"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  Save My Fear Ladder
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </div>
          </div>
        )}

        {/* ============ JUST SAVED SUCCESS / REVIEW ============ */}
        {phase !== "build" && justSaved && (
          <div className="space-y-12 py-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="glass-card rounded-[40px] p-12 md:p-20 text-center shadow-premium relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
              <div className="relative space-y-6">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8 animate-bounce">
                  <span className="text-5xl">🌱</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
                  Your Fear Ladder is <span className="text-primary italic">Ready</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-md mx-auto leading-relaxed">
                  We've organized your fears from lowest to highest. This path is designed for gradual success.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 px-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em]">The Therapeutic Path</h3>
              </div>
              <div className="grid gap-4">
                {sortedSteps.map((step, idx) => (
                  <div key={step.id} className="glass-card hover:bg-card/90 transition-all rounded-3xl p-6 flex items-center gap-6 group">
                    <div className="w-12 h-12 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary font-black text-xl transition-colors group-hover:bg-primary group-hover:text-white">
                      {idx + 1}
                    </div>
                    <span className="flex-1 text-lg font-medium text-foreground tracking-tight">{step.situation}</span>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1">Anxiety</span>
                      <span className="text-sm font-black px-4 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {step.anxiety}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setJustSaved(false)}
              className="premium-button w-full py-6 rounded-full text-xl font-bold bg-foreground text-background hover:bg-foreground/90 transition-all shadow-2xl"
            >
              Start Practice (Day 2)
            </button>
          </div>
        )}

        {/* ============ PRACTICE PHASE ============ */}
        {phase === "practice" && !justSaved && currentStep && (
          <div className="space-y-8 max-w-3xl mx-auto">
            <div className="glass-card rounded-[32px] p-8 md:p-12 shadow-premium space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                    Day {completedCount + 2} Practice
                  </h1>
                  <p className="text-muted-foreground">Focus on willingness, not suppression.</p>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/10">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Step {completedCount + 1} of {sortedSteps.length}
                  </span>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-[32px] overflow-hidden">
              <PracticeScreen
                completedCount={completedCount}
                currentStep={currentStep}
                alreadyLogged={currentStepAlreadyLogged}
                onSave={addLog}
              />
            </div>
          </div>
        )}

        {/* ============ COMPLETED PHASE ============ */}
        {phase === "completed" && (
          <div className="max-w-4xl mx-auto">
            <CompletionScreen
              logs={data.logs}
              steps={sortedSteps}
              onStartNew={resetLadder}
              onReviewProgress={() => { }}
            />
          </div>
        )}

        {/* ============ PROGRESS PANEL (always when session exists) ============ */}
        {data.sessionId && sortedSteps.length > 0 && phase !== "completed" && (
          <div className="pt-12">
            <div className="glass-card rounded-[32px] p-8">
              <div className="flex items-center gap-3 mb-8 px-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="20" x2="12" y2="10"></line>
                    <line x1="18" y1="20" x2="18" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="16"></line>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-foreground">Activity Progress</h3>
              </div>
              <ProgressPanel
                steps={sortedSteps}
                completedStepIds={completedStepIds}
                currentStepId={currentStep?.id ?? null}
              />
            </div>
          </div>
        )}

        <div className="text-center pt-12 pb-8">
          <p className="text-sm font-medium text-muted-foreground/60 flex items-center justify-center gap-2">
            Built with care for your therapeutic journey. <span className="animate-float">🌱</span>
          </p>
        </div>
      </main>

      <ExampleLadderModal open={showExample} onClose={() => setShowExample(false)} />
    </div>
  );
};

export default Index;
