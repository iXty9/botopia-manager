
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import schema from '../schema.sql?raw';
import pkg from 'pg';
const { Pool } = pkg;

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
    try {
      console.log('Starting database initialization...');
      console.log('Creating connection pool with credentials:', {
        host: credentials.dbHost,
        port: credentials.dbPort,
        database: credentials.dbName,
        user: credentials.dbUser,
        // password omitted for security
      });

      // Create a connection pool
      const pool = new Pool({
        host: credentials.dbHost,
        port: parseInt(credentials.dbPort),
        database: credentials.dbName,
        user: credentials.dbUser,
        password: credentials.dbPassword,
      });

      // Test connection
      console.log('Testing database connection...');
      await pool.query('SELECT NOW()');
      console.log('Database connection successful!');

      // Execute schema
      console.log('Executing database schema...');
      console.log('Schema SQL:', schema); // Log the schema being executed
      await pool.query(schema);
      console.log('Schema executed successfully!');

      // Get bot info from Discord
      console.log('Fetching bot information from Discord API...');
      const response = await fetch('https://discord.com/api/v10/users/@me', {
        headers: {
          'Authorization': `Bot ${credentials.discordToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Discord API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Failed to fetch bot information from Discord: ${response.status} ${response.statusText}`);
      }

      const botInfo = await response.json();
      console.log('Bot information retrieved:', {
        username: botInfo.username,
        id: botInfo.id
      });

      // Insert bot into database
      console.log('Inserting bot information into database...');
      await pool.query(
        'INSERT INTO bots (name, token, client_id) VALUES ($1, $2, $3)',
        [botInfo.username, credentials.discordToken, botInfo.id]
      );
      console.log('Bot information inserted successfully!');

      await pool.end();
      console.log('Database connection closed.');
      return { success: true };
    } catch (error) {
      console.error('Database initialization error:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack
        });
      }
      throw error;
    }
  };

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
