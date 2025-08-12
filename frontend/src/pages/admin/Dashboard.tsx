import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import StatsCard from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Calendar, DollarSign, Shield, Settings } from "lucide-react";

export default function AdminDashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const statsData = [
    {
      title: "Total Users",
      value: "1,247",
      change: "+12%",
      changeText: "from last month",
      icon: Users,
      color: "blue",
    },
    {
      title: "Pending Doctor Approvals",
      value: "8",
      changeText: "Requires attention",
      icon: UserCheck,
      color: "yellow",
    },
    {
      title: "Total Appointments",
      value: "15,394",
      change: "+8.2%",
      changeText: "from last month",
      icon: Calendar,
      color: "green",
    },
    {
      title: "Platform Revenue",
      value: "$847k",
      change: "+15.1%",
      changeText: "from last month",
      icon: DollarSign,
      color: "purple",
    },
  ] as const;

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Platform management and analytics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {statsData.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Button 
            variant="outline" 
            className="h-32 flex flex-col items-center justify-center space-y-3"
            data-testid="button-manage-users"
          >
            <Users className="h-8 w-8 text-blue-500" />
            <div className="text-center">
              <div className="font-semibold">Manage Users</div>
              <div className="text-sm text-gray-500">View and manage all users</div>
            </div>
          </Button>

          <Button 
            variant="outline" 
            className="h-32 flex flex-col items-center justify-center space-y-3"
            data-testid="button-approve-doctors"
          >
            <UserCheck className="h-8 w-8 text-green-500" />
            <div className="text-center">
              <div className="font-semibold">Approve Doctors</div>
              <div className="text-sm text-gray-500">Review doctor applications</div>
            </div>
          </Button>

          <Button 
            variant="outline" 
            className="h-32 flex flex-col items-center justify-center space-y-3"
            data-testid="button-platform-settings"
          >
            <Settings className="h-8 w-8 text-purple-500" />
            <div className="text-center">
              <div className="font-semibold">Platform Settings</div>
              <div className="text-sm text-gray-500">Configure system settings</div>
            </div>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-2 rounded-full">
                    <UserCheck className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New doctor registered</p>
                    <p className="text-xs text-gray-500">Dr. Sarah Johnson - Cardiology</p>
                  </div>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New patient registered</p>
                    <p className="text-xs text-gray-500">John Doe joined the platform</p>
                  </div>
                  <span className="text-xs text-gray-500">4 hours ago</span>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <DollarSign className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Payment processed</p>
                    <p className="text-xs text-gray-500">$150 consultation fee</p>
                  </div>
                  <span className="text-xs text-gray-500">6 hours ago</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>System Health</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Server Status</span>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    Operational
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Database</span>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    Healthy
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Payment Gateway</span>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    Connected
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Email Service</span>
                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                    Degraded
                  </span>
                </div>

                <div className="pt-4 border-t">
                  <Button variant="outline" className="w-full" data-testid="button-system-settings">
                    View System Logs
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
