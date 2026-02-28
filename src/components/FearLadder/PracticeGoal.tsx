interface PracticeGoalProps {
  goal: string;
  onGoalChange: (val: string) => void;
}

const PracticeGoal = ({ goal, onGoalChange }: PracticeGoalProps) => {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-serif font-bold text-foreground">Set Your Practice Goal</h2>
        <p className="text-muted-foreground leading-relaxed">
          What fear would you like to practice approaching — step by step?
          <span className="block mt-1 text-xs italic text-primary/70">(Focus on learning to tolerate discomfort, not eliminating fear.)</span>
        </p>
      </div>
      <input
        type="text"
        value={goal}
        onChange={(e) => onGoalChange(e.target.value)}
        placeholder="Fear of dogs, contamination, checking, intrusive thoughts…"
        className="input-premium w-full px-6 py-4 text-base"
        maxLength={200}
      />
      <div className="flex items-center gap-2 px-2">
        <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
        <p className="text-xs text-muted-foreground/70 font-medium">
          Notice what shows up — you don't need to fix it.
        </p>
      </div>
    </section>
  );
};

export default PracticeGoal;
