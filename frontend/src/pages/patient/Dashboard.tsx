import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, MessageCircle, Clock, Plus, Search } from "lucide-react";

export default function PatientDashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Here we use isUnauthorizedError for clarity
      const error = new Error("401: Unauthorized");
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      }
    }
  }, [isAuthenticated, isLoading, toast]);

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
          <h1 className="text-2xl font-bold text-gray-900">Patient Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user.name || "Patient"}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link href="/book-appointment">
            <Button className="h-24 flex flex-col items-center justify-center space-y-2 w-full" data-testid="button-book-appointment">
              <Plus className="h-6 w-6" />
              <span>Book Appointment</span>
            </Button>
          </Link>

          <Link href="/find-doctors">
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center space-y-2 w-full"
              data-testid="button-find-doctors"
            >
              <Search className="h-6 w-6" />
              <span>Find Doctors</span>
            </Button>
          </Link>

          <Link href="/health-records">
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center space-y-2 w-full"
              data-testid="button-health-records"
            >
              <FileText className="h-6 w-6" />
              <span>Health Records</span>
            </Button>
          </Link>

          <Link href="/messages">
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center space-y-2 w-full"
              data-testid="button-messages"
            >
              <MessageCircle className="h-6 w-6" />
              <span>Messages</span>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Upcoming Appointments</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming appointments</h3>
                <p className="text-gray-600 mb-4">Schedule your next appointment to get started.</p>
                <Button data-testid="button-schedule-appointment">Schedule Now</Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Medical Records */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Recent Medical Records</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No medical records</h3>
                <p className="text-gray-600 mb-4">Your medical records will appear here after consultations.</p>
                <Button variant="outline" data-testid="button-upload-records">
                  Upload Records
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
