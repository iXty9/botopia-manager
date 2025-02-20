
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DatabaseConfigForm } from "@/components/setup/DatabaseConfigForm";
import { DiscordConfigForm } from "@/components/setup/DiscordConfigForm";
import { initializeDatabase, type DatabaseCredentials } from "@/services/database";

const Setup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<DatabaseCredentials>({
    dbHost: "192.168.1.69",
    dbPort: "5452",
    dbName: "bot_manager",
    dbUser: "bot_sys",
    dbPassword: "",
    discordToken: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Starting setup process...');
      await initializeDatabase(formData);
      
      // Store credentials in session storage
      console.log('Storing credentials in session storage...');
      window.sessionStorage.setItem('dbCredentials', JSON.stringify({
        host: formData.dbHost,
        port: formData.dbPort,
        database: formData.dbName,
        user: formData.dbUser,
        password: formData.dbPassword,
      }));
      window.sessionStorage.setItem('discordToken', formData.discordToken);
      
      toast.success("Setup completed successfully!");
      console.log('Setup completed successfully, navigating to dashboard...');
      navigate('/dashboard');
    } catch (error) {
      console.error('Setup error:', error);
      if (error instanceof Error) {
        toast.error(`Setup failed: ${error.message}`);
      } else {
        toast.error("Failed to complete setup. Please check your credentials and try again.");
      }
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
          <DatabaseConfigForm
            formData={formData}
            onChange={setFormData}
            isLoading={isLoading}
          />
          <DiscordConfigForm
            formData={formData}
            onChange={setFormData}
            isLoading={isLoading}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Setting up..." : "Complete Setup"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Setup;
