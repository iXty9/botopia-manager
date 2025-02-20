
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BotStatusCard from "@/components/BotStatusCard";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if credentials exist
    const dbCredentials = window.sessionStorage.getItem('dbCredentials');
    const discordToken = window.sessionStorage.getItem('discordToken');

    if (!dbCredentials || !discordToken) {
      navigate('/setup');
    }
  }, [navigate]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <BotStatusCard />
      </div>
    </div>
  );
};

export default Dashboard;
