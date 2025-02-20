
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Power, Repeat } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const BotStatusCard = () => {
  const [status, setStatus] = useState<'online' | 'offline'>('offline');
  const [isLoading, setIsLoading] = useState(false);
  const [botId, setBotId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBotStatus = async () => {
      try {
        const dbCredentials = JSON.parse(sessionStorage.getItem('dbCredentials') || '{}');
        const response = await fetch('https://bot-manager-api.lovable.dev/bot-status', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${dbCredentials.password}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch bot status');
        
        const data = await response.json();
        setStatus(data.status);
        setBotId(data.id);
      } catch (error) {
        console.error('Error fetching bot status:', error);
        toast.error('Failed to fetch bot status');
      }
    };

    fetchBotStatus();
  }, []);

  const toggleStatus = async () => {
    if (!botId) return;
    setIsLoading(true);
    try {
      const dbCredentials = JSON.parse(sessionStorage.getItem('dbCredentials') || '{}');
      const response = await fetch('https://bot-manager-api.lovable.dev/bot-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${dbCredentials.password}`
        },
        body: JSON.stringify({
          botId,
          status: status === 'online' ? 'offline' : 'online'
        })
      });

      if (!response.ok) throw new Error('Failed to update bot status');

      const newStatus = status === 'online' ? 'offline' : 'online';
      setStatus(newStatus);
      toast.success(`Bot ${status === 'online' ? 'stopped' : 'started'} successfully`);
    } catch (error) {
      console.error('Error updating bot status:', error);
      toast.error('Failed to toggle bot status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = async () => {
    if (!botId) return;
    setIsLoading(true);
    try {
      const dbCredentials = JSON.parse(sessionStorage.getItem('dbCredentials') || '{}');
      const response = await fetch('https://bot-manager-api.lovable.dev/bot-restart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${dbCredentials.password}`
        },
        body: JSON.stringify({ botId })
      });

      if (!response.ok) throw new Error('Failed to restart bot');
      
      // Temporarily set status to offline then online to simulate restart
      setStatus('offline');
      setTimeout(() => setStatus('online'), 1000);
      
      toast.success('Bot restarted successfully');
    } catch (error) {
      console.error('Error restarting bot:', error);
      toast.error('Failed to restart bot');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Bot Status</CardTitle>
        <Badge 
          variant={status === 'online' ? 'default' : 'destructive'}
          className="capitalize"
        >
          {status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2">
          <Button
            variant={status === 'online' ? 'destructive' : 'default'}
            size="sm"
            onClick={toggleStatus}
            disabled={isLoading || !botId}
          >
            <Power className="mr-2 h-4 w-4" />
            {status === 'online' ? 'Stop' : 'Start'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRestart}
            disabled={isLoading || status === 'offline' || !botId}
          >
            <Repeat className="mr-2 h-4 w-4" />
            Restart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BotStatusCard;
