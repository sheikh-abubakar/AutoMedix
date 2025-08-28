import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import PendingDoctors from "./PendingDoctors";
import { Users, UserCheck, Calendar, Shield, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import axios from "@/api/axiosClient"; // Add this import

export default function AdminDashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);
  const [showPendingList, setShowPendingList] = useState(false);

  // Real counts from analytics API
  const [stats, setStats] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]); // Add notifications state

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

  // Fetch pending doctors count
  useEffect(() => {
    fetch("http://localhost:5000/api/admin/pending-doctors")
      .then(res => res.json())
      .then(data => setPendingCount(data.length));
  }, []);

  // Fetch analytics stats for real counts
  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/admin/analytics", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        console.log("Dashboard analytics response:", data);
        setStats(data);
      } catch (err) {
        setStats({
          totalUsers: 0,
          totalAppointments: 0,
        });
      }
    }
    fetchStats();
  }, []);

  // Fetch notifications for recent activity
  useEffect(() => {
    async function fetchNotifications() {
      try {
        const adminId = localStorage.getItem("userId") || localStorage.getItem("_id");
        const token = localStorage.getItem("token");
        const res = await axios.get(`/notifications/admin/${adminId}?isRead=false`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(res.data);
      } catch (err) {
        setNotifications([]);
      }
    }
    fetchNotifications();
  }, []);

  if (isLoading || !user || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // 
  const totalUsers = (stats.totalUsers ?? 0) - 1; 
  const totalAppointments = stats.totalAppointments ?? 0;

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Platform management and analytics</p>
        </div>

        {/* Stats Cards - Use Card for consistent sizing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="flex flex-col items-center justify-center py-8 min-h-[180px]">
            <Users className="h-10 w-10 text-blue-500 mb-2" />
            <span className="text-4xl font-bold text-indigo-700">{totalUsers.toLocaleString()}</span>
            <span className="mt-2 text-lg text-gray-700">Total Users</span>
          </Card>
          <Card
            className="flex flex-col items-center justify-center py-8 min-h-[180px] cursor-pointer"
            onClick={() => setShowPendingList(true)}
          >
            <UserCheck className="h-10 w-10 text-yellow-500 mb-2" />
            <span className="text-4xl font-bold text-yellow-700">{pendingCount.toLocaleString()}</span>
            <span className="mt-2 text-lg text-gray-700">Pending Doctor Approvals</span>
          </Card>
          <Card className="flex flex-col items-center justify-center py-8 min-h-[180px]">
            <Calendar className="h-10 w-10 text-green-500 mb-2" />
            <span className="text-4xl font-bold text-green-700">{totalAppointments.toLocaleString()}</span>
            <span className="mt-2 text-lg text-gray-700">Total Appointments</span>
          </Card>
        </div>

        {/* Pending Doctors List Section */}
        {showPendingList && (
          <div className="mb-6">
            <PendingDoctors onClose={() => setShowPendingList(false)} />
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Button 
            variant="outline" 
            className="h-32 min-h-[180px] flex flex-col items-center justify-center space-y-3"
            data-testid="button-manage-users"
          >
            <Users className="h-8 w-8 text-blue-500" />
            <div className="text-center">
              <div className="font-semibold">Manage Users</div>
              <div className="text-sm text-gray-500">View and manage all users</div>
            </div>
          </Button>
          <Link to="/admin/doctor-approvals" className="w-full">
            <Button 
              variant="outline" 
              className="h-32 min-h-[180px] w-full flex flex-col items-center justify-center space-y-3"
              data-testid="button-approve-doctors"
            >
              <UserCheck className="h-8 w-8 text-green-500" />
              <div className="text-center">
                <div className="font-semibold">Approved Doctors</div>
                <div className="text-sm text-gray-500">Review doctor applications</div>
              </div>
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="h-32 min-h-[180px] flex flex-col items-center justify-center space-y-3"
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
                {notifications.slice(0, 5).map((n) => (
                  <div key={n._id} className="flex items-center space-x-4">
                    <div className="bg-indigo-100 p-2 rounded-full">
                      <UserCheck className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{n.message}</p>
                      <p className="text-xs text-gray-500">{n.type}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <div className="text-center text-gray-500 py-4">No recent notifications.</div>
                )}
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
