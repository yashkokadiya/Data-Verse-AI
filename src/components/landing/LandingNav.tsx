import { Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import GradientButton from "@/components/GradientButton";
import ThemeToggle from "@/components/ThemeToggle";

const NAV_LINKS = [
  { label: "Features", id: "features" },
  { label: "How it Works", id: "how" },
  { label: "Try Demo", id: "demo" },
];

const LandingNav = () => {
  const navigate = useNavigate();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="flex items-center justify-between px-6 md:px-12 py-4 glass sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold tracking-tight text-foreground">DataVerse AI</span>
      </div>

      <div className="hidden md:flex items-center gap-1">
        {NAV_LINKS.map((l) => (
          <button
            key={l.id}
            onClick={() => scrollTo(l.id)}
            className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-md"
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="ghost" onClick={() => navigate("/login")} className="text-foreground hover:bg-primary/10">
          Login
        </Button>
        <GradientButton onClick={() => navigate("/signup")}>
          Sign Up <ArrowRight className="w-4 h-4" />
        </GradientButton>
      </div>
    </nav>
  );
};

export default LandingNav;
