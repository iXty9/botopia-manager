
import { ServerIcon } from "lucide-react";

export function StatusBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 glass-panel p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="status-indicator bg-green-500">
            <span className="status-indicator bg-green-500" />
          </span>
          <span className="text-sm font-medium">Connected</span>
        </div>
        <div className="flex items-center space-x-2">
          <ServerIcon className="h-5 w-5 text-discord" />
          <span className="text-sm font-medium">5 Servers Active</span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-muted-foreground">Last update: Just now</span>
      </div>
    </div>
  );
}
