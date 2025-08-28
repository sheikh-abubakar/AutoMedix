import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import StatsCard from "@/components/StatsCard";
import PatientCard from "@/components/PatientCard";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  Users,
  DollarSign,
  CalendarPlus,
  FileText,
  Video,
  Plus,
  Eye,
  MessageCircle,
  Filter,
  Search
} from "lucide-react";

// Add User type to fix TS error
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  // ...other fields as needed
}

// Appointment type
interface Appointment {
  id?: string;
  _id?: string;
  status: string;
  date: string;
  time: string;
  type: string;
  patient?: {
    name?: string;
    email?: string;
  };
}

export default function DoctorDashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth() as { isAuthenticated: boolean, isLoading: boolean, user: User | null };
  const [appointments, setAppointments] = useState<Appointment[]>([]);

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
    }
  }, [isAuthenticated, isLoading, toast]);

  useEffect(() => {
    if (user && user._id) {
      axios.get(`http://localhost:5000/api/appointments/doctor/${user._id}`).then(res => setAppointments(res.data));
    }
  }, [user]);

  // Today's appointments (filter by today's date)
  const todayDate = new Date().toISOString().split("T")[0];
  const todaysAppointments = appointments.filter(app => app.date === todayDate);

  // Remove Pending Approvals stat
  const statsData = [
    {
      title: "Today's Appointments",
      value: todaysAppointments.length,
      change: "",
      changeText: "",
      icon: Calendar,
      color: "blue",
    },
    {
      title: "Total Appointments",
      value: appointments.length,
      change: "",
      changeText: "",
      icon: Users,
      color: "green",
    },
    {
      title: "Revenue",
      value: "$12.4k",
      change: "+8.2%",
      changeText: "from last month",
      icon: DollarSign,
      color: "purple",
    },
  ] as const;

  // Update Quick Actions links
  const quickActions = [
    {
      title: "Create Prescription",
      icon: FileText,
      color: "green",
      onClick: () => window.location.href = "/doctor/create-prescription",
    },
    {
      title: "View Medical Records",
      icon: FileText,
      color: "purple",
      onClick: () => window.location.href = "/doctor/medical-records",
    },
    {
      title: "Start Video Call",
      icon: Video,
      color: "orange",
      onClick: () => window.location.href = "/doctor/video-consultation",
    },
  ];

  // Get today's date for calendar highlight
  const today = new Date();
  const todayDay = today.getDate();

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Appointments Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your patient appointments and schedule</p>
            </div>
            <Button className="flex items-center space-x-2" data-testid="button-new-appointment">
              <Plus className="h-4 w-4" />
              <span>New Appointment</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {statsData.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Today's Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Today's Schedule</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" data-testid="button-filter">
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" data-testid="button-search">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {todaysAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {todaysAppointments.map((appointment) => (
                      <div
                        key={appointment._id || appointment.id}
                        className="flex items-center gap-4 bg-white rounded-xl shadow px-5 py-4 border border-[#3299a8] hover:shadow-lg transition"
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="h-6 w-6 text-[#3299a8]" />
                          <span className="font-semibold text-lg text-[#3299a8]">
                            {appointment.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-6 w-6 text-[#3299a8]" />
                          <span className="font-medium text-gray-800">
                            {appointment.patient?.name || "Unknown Patient"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments today</h3>
                    <p className="text-gray-600">You don't have any appointments scheduled for today.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Calendar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quickActions.map((action) => (
                    <Button
                      key={action.title}
                      variant="outline"
                      className={`w-full justify-start space-x-3 h-12 
                        ${action.color === 'primary' ? 'border-primary-200 bg-primary-50 hover:bg-primary-100 text-primary-700' :
                          action.color === 'green' ? 'border-green-200 bg-green-50 hover:bg-green-100 text-green-700' :
                          action.color === 'purple' ? 'border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700' :
                          'border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-700'}`}
                      onClick={action.onClick}
                      data-testid={`button-${action.title.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <action.icon className="h-4 w-4" />
                      <span className="font-medium">{action.title}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mini Calendar with today's date highlighted */}
            <Card>
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                    <div key={day} className="p-2 font-medium text-gray-600">{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                  {Array.from({ length: 35 }, (_, i) => {
                    const day = i - 6;
                    const isCurrentMonth = day > 0 && day <= 31;
                    const isToday = day === todayDay;
                    return (
                      <div
                        key={i}
                        className={`p-2 hover:bg-gray-100 rounded cursor-pointer relative
                          ${!isCurrentMonth ? 'text-gray-400' : ''}
                          ${isToday ? 'bg-[#3299a8] text-white font-bold border-2 border-[#217a8a]' : ''}`}
                        data-testid={`calendar-day-${day}`}
                      >
                        {isCurrentMonth ? day : ''}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}