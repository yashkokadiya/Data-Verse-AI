import { useState } from "react";
import { Database, CheckCircle2, Loader2 } from "lucide-react";
import GradientButton from "@/components/GradientButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const ConnectDatabasePage = () => {
  const [dbType, setDbType] = useState("postgresql");
  const [host, setHost] = useState("");
  const [port, setPort] = useState("5432");
  const [dbName, setDbName] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!host || !dbName || !user) {
      toast.error("Please fill in all required fields");
      return;
    }
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
      toast.success(`Connected to ${dbName} (simulated)`);
    }, 1400);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 glow-primary">
          <Database className="w-7 h-7 text-primary-foreground" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Connect Database</h1>
        <p className="text-muted-foreground">Connect to your database to import data directly</p>
      </div>

      <form onSubmit={handleConnect} className="rounded-xl bg-card border border-border p-6 space-y-5">
        <div className="space-y-2">
          <Label>Database Type</Label>
          <Select value={dbType} onValueChange={setDbType}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="postgresql">PostgreSQL</SelectItem>
              <SelectItem value="mysql">MySQL</SelectItem>
              <SelectItem value="mongodb">MongoDB</SelectItem>
              <SelectItem value="sqlserver">SQL Server</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2 sm:col-span-2">
            <Label>Host</Label>
            <Input value={host} onChange={(e) => setHost(e.target.value)} placeholder="localhost or db.example.com" />
          </div>
          <div className="space-y-2">
            <Label>Port</Label>
            <Input value={port} onChange={(e) => setPort(e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Database Name</Label>
          <Input value={dbName} onChange={(e) => setDbName(e.target.value)} placeholder="my_database" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Username</Label>
            <Input value={user} onChange={(e) => setUser(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <GradientButton type="submit" size="lg" disabled={connecting}>
            {connecting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Connecting...</>
            ) : connected ? (
              <><CheckCircle2 className="w-4 h-4" /> Connected</>
            ) : (
              <>Connect <Database className="w-4 h-4" /></>
            )}
          </GradientButton>
        </div>
      </form>

      <p className="text-xs text-muted-foreground text-center">
        Connection is simulated for demo purposes. No data leaves your browser.
      </p>
    </div>
  );
};

export default ConnectDatabasePage;
