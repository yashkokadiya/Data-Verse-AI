import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

const PHRASES = [
  "Analyzing dataset...",
  "Detecting trends...",
  "Generating insights...",
];

const TypingLoop = () => {
  const [text, setText] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = PHRASES[phraseIdx];
    const speed = deleting ? 30 : 65;

    const t = setTimeout(() => {
      if (!deleting) {
        if (charIdx < current.length) {
          setText(current.slice(0, charIdx + 1));
          setCharIdx((i) => i + 1);
        } else {
          setTimeout(() => setDeleting(true), 1100);
        }
      } else {
        if (charIdx > 0) {
          setText(current.slice(0, charIdx - 1));
          setCharIdx((i) => i - 1);
        } else {
          setDeleting(false);
          setPhraseIdx((p) => (p + 1) % PHRASES.length);
        }
      }
    }, speed);

    return () => clearTimeout(t);
  }, [charIdx, deleting, phraseIdx]);

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-primary/20 shadow-sm">
      <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
      <span className="text-sm font-medium text-foreground min-w-[170px] text-left">
        {text}
        <span className="inline-block w-0.5 h-3.5 ml-0.5 bg-primary align-middle animate-pulse" />
      </span>
    </div>
  );
};

export default TypingLoop;
