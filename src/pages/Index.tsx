
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { StatusBar } from "@/components/StatusBar";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-6 pt-20">
          <StatusBar />
          <div className="container mx-auto">
            <div className="space-y-6 animate-fade-in">
              <div className="glass-panel p-6">
                <h1 className="text-3xl font-bold mb-2">Welcome to Discord Bot Manager</h1>
                <p className="text-muted-foreground">Manage your Discord bots with ease.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Quick Stats */}
                <div className="glass-panel p-6 hover-scale">
                  <h3 className="text-lg font-semibold mb-2">Total Messages</h3>
                  <p className="text-3xl font-bold text-discord">1,234</p>
                </div>
                
                <div className="glass-panel p-6 hover-scale">
                  <h3 className="text-lg font-semibold mb-2">Active Users</h3>
                  <p className="text-3xl font-bold text-discord">567</p>
                </div>
                
                <div className="glass-panel p-6 hover-scale">
                  <h3 className="text-lg font-semibold mb-2">Commands Used</h3>
                  <p className="text-3xl font-bold text-discord">890</p>
                </div>
              </div>
              
              {/* Recent Activity */}
              <div className="glass-panel p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                      <div className="flex items-center space-x-4">
                        <div className="h-2 w-2 rounded-full bg-discord" />
                        <span>New command executed</span>
                      </div>
                      <span className="text-sm text-muted-foreground">2 min ago</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
