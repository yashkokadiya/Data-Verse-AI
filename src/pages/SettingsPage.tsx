import { useState } from "react";
import { Settings, User, Palette, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import GradientButton from "@/components/GradientButton";
import { toast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const [name, setName] = useState("Demo User");
  const [email, setEmail] = useState("demo@dataverse.ai");

  const handleSave = () => {
    toast({ title: "Settings saved", description: "Your preferences have been updated." });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 glow-primary">
          <Settings className="w-6 h-6 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Settings</h1>
        <p className="text-muted-foreground">Manage your profile and preferences</p>
      </div>

      {/* Profile */}
      <div className="p-6 rounded-xl bg-card border border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <User className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">Profile</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl bg-muted/30 border-border/50 h-11" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl bg-muted/30 border-border/50 h-11" />
          </div>
        </div>
      </div>

      {/* Theme */}
      <div className="p-6 rounded-xl bg-card border border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <Palette className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">Appearance</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground">Dark Theme</p>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </div>
          <div className="w-11 h-6 rounded-full gradient-primary flex items-center px-0.5">
            <div className="w-5 h-5 rounded-full bg-primary-foreground ml-auto" />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="p-6 rounded-xl bg-card border border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">Notifications</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground">Processing Alerts</p>
            <p className="text-xs text-muted-foreground">Get notified when data cleaning completes</p>
          </div>
          <div className="w-11 h-6 rounded-full bg-muted/50 flex items-center px-0.5">
            <div className="w-5 h-5 rounded-full bg-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <GradientButton onClick={handleSave}>Save Changes</GradientButton>
      </div>
    </div>
  );
};

export default SettingsPage;
