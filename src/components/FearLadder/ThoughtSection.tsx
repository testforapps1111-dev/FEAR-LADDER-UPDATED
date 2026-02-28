import { Info } from "lucide-react";
import { useState } from "react";

interface ThoughtSectionProps {
  thought: string;
  onThoughtChange: (val: string) => void;
}

const ThoughtSection = ({ thought, onThoughtChange }: ThoughtSectionProps) => {
  const [showTip, setShowTip] = useState(false);

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-serif font-bold text-foreground">Thought / Expected Fear</h2>
        <p className="text-muted-foreground leading-relaxed">
          What thought, image, or urge do you expect might show up while working on this?
          <span className="block mt-1 text-xs italic text-primary/70">(Just name it. You don't need to solve or change it.)</span>
        </p>
      </div>

      <div className="relative group">
        <input
          type="text"
          value={thought}
          onChange={(e) => onThoughtChange(e.target.value)}
          placeholder={`"The dog might bite me"`}
          className="input-premium w-full px-6 py-4 pr-14 text-base"
          maxLength={200}
        />
        <button
          type="button"
          onClick={() => setShowTip(!showTip)}
          className={`absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${showTip ? "bg-primary text-white" : "text-muted-foreground/40 hover:bg-primary/10 hover:text-primary"
            }`}
          aria-label="Show reassurance"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {showTip && (
        <div className="bg-primary/5 text-primary border border-primary/10 text-sm rounded-2xl px-6 py-4 leading-relaxed animate-in slide-in-from-top-2 duration-300">
          <p className="font-medium">💡 Therapeutic Insight</p>
          <p className="mt-1 opacity-80">Having a thought doesn't make it true or important. Naming it is an act of courage, not agreement.</p>
        </div>
      )}
    </section>
  );
};

export default ThoughtSection;
