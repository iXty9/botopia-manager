
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Setup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    dbHost: "192.168.1.69",
    dbPort: "5452",
    dbName: "bot_manager",
    dbUser: "bot_sys",
    dbPassword: "",
    discordToken: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here we would normally test the connection
    // For now, we'll just store in memory and proceed
    try {
      // Store credentials in memory (temporary solution)
      window.sessionStorage.setItem('dbCredentials', JSON.stringify({
        host: formData.dbHost,
        port: formData.dbPort,
        database: formData.dbName,
        user: formData.dbUser,
        password: formData.dbPassword,
      }));
      window.sessionStorage.setItem('discordToken', formData.discordToken);
      
      toast.success("Setup completed successfully!");
      navigate('/dashboard');
    } catch (error) {
      toast.error("Failed to save credentials");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-6 space-y-6 glass-panel">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Discord Bot Manager Setup</h1>
          <p className="text-muted-foreground">Enter your database and Discord credentials to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Database Configuration</h2>
            <div className="space-y-2">
              <Input
                placeholder="Database Host"
                value={formData.dbHost}
                onChange={(e) => setFormData({ ...formData, dbHost: e.target.value })}
                required
              />
              <Input
                placeholder="Port"
                value={formData.dbPort}
                onChange={(e) => setFormData({ ...formData, dbPort: e.target.value })}
                required
              />
              <Input
                placeholder="Database Name"
                value={formData.dbName}
                onChange={(e) => setFormData({ ...formData, dbName: e.target.value })}
                required
              />
              <Input
                placeholder="Username"
                value={formData.dbUser}
                onChange={(e) => setFormData({ ...formData, dbUser: e.target.value })}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={formData.dbPassword}
                onChange={(e) => setFormData({ ...formData, dbPassword: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Discord Configuration</h2>
            <Input
              type="password"
              placeholder="Discord Bot Token"
              value={formData.discordToken}
              onChange={(e) => setFormData({ ...formData, discordToken: e.target.value })}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Complete Setup
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Setup;
