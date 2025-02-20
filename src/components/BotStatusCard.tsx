
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Power, Repeat } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const BotStatusCard = () => {
  const [status, setStatus] = useState<'online' | 'offline'>('offline');
  const [isLoading, setIsLoading] = useState(false);

  const toggleStatus = async () => {
    setIsLoading(true);
    try {
      // Here we'll eventually make an API call to actually toggle the bot
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
      setStatus(status === 'online' ? 'offline' : 'online');
      toast.success(`Bot ${status === 'online' ? 'stopped' : 'started'} successfully`);
    } catch (error) {
      toast.error('Failed to toggle bot status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = async () => {
    setIsLoading(true);
    try {
      // Here we'll eventually make an API call to restart the bot
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
      toast.success('Bot restarted successfully');
    } catch (error) {
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
            disabled={isLoading}
          >
            <Power className="mr-2 h-4 w-4" />
            {status === 'online' ? 'Stop' : 'Start'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRestart}
            disabled={isLoading || status === 'offline'}
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
