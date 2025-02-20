
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {/* Dashboard content will go here */}
    </div>
  );
};

export default Dashboard;
