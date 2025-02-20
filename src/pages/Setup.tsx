
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Setup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    dbHost: "192.168.1.69",
    dbPort: "5452",
    dbName: "bot_manager",
    dbUser: "bot_sys",
    dbPassword: "",
    discordToken: "",
  });

  const initializeDatabase = async (credentials: typeof formData) => {
    const schemaResponse = await fetch('https://raw.githubusercontent.com/your-repo/bot-manager/main/src/schema.sql');
    const schemaSQL = await schemaResponse.text();
    
    const response = await fetch(`http://${credentials.dbHost}:${credentials.dbPort}/init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        host: credentials.dbHost,
        port: credentials.dbPort,
        database: credentials.dbName,
        user: credentials.dbUser,
        password: credentials.dbPassword,
        schema: schemaSQL,
        botToken: credentials.discordToken
      })
    });

    if (!response.ok) {
      throw new Error('Failed to initialize database');
    }

    const data = await response.json();
    return data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Initialize database and create bot entry
      await initializeDatabase(formData);
      
      // Store credentials in session storage
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
      console.error('Setup error:', error);
      toast.error("Failed to complete setup. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
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
                disabled={isLoading}
              />
              <Input
                placeholder="Port"
                value={formData.dbPort}
                onChange={(e) => setFormData({ ...formData, dbPort: e.target.value })}
                required
                disabled={isLoading}
              />
              <Input
                placeholder="Database Name"
                value={formData.dbName}
                onChange={(e) => setFormData({ ...formData, dbName: e.target.value })}
                required
                disabled={isLoading}
              />
              <Input
                placeholder="Username"
                value={formData.dbUser}
                onChange={(e) => setFormData({ ...formData, dbUser: e.target.value })}
                required
                disabled={isLoading}
              />
              <Input
                type="password"
                placeholder="Password"
                value={formData.dbPassword}
                onChange={(e) => setFormData({ ...formData, dbPassword: e.target.value })}
                required
                disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Setting up..." : "Complete Setup"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Setup;
