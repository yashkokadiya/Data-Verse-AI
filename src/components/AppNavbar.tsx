import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sparkles, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import ThemeToggle from "@/components/ThemeToggle";
import { setAuthenticated } from "@/components/RequireAuth";

const AppNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuthenticated(false);
    toast({ title: "Logged out", description: "You have been signed out." });
    navigate("/");
  };

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-border/50 glass">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">DataVerse AI</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs font-semibold gradient-primary text-primary-foreground">
            JD
          </AvatarFallback>
        </Avatar>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
};

export default AppNavbar;
