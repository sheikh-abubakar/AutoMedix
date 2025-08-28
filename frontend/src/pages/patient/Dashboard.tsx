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
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Patient Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user.name || "Patient"}</p>
        </div>

        {/* Top Quick Actions with working links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link href="/book-appointment">
            <button className="w-full h-24 rounded-lg border bg-white flex flex-col items-center justify-center space-y-2 font-semibold text-base shadow transition hover:shadow-md">
              <Plus className="h-6 w-6 text-[#3299a8]" />
              <span>Book Appointment</span>
            </button>
          </Link>
          <Link href="/find-doctors">
            <button className="w-full h-24 rounded-lg border bg-white flex flex-col items-center justify-center space-y-2 font-semibold text-base shadow transition hover:shadow-md">
              <Search className="h-6 w-6 text-[#25d7eb]" />
              <span>Find Doctors</span>
            </button>
          </Link>
          <Link href="/health-records">
            <button className="w-full h-24 rounded-lg border bg-white flex flex-col items-center justify-center space-y-2 font-semibold text-base shadow transition hover:shadow-md">
              <FileText className="h-6 w-6 text-[#1cb6c4]" />
              <span>Health Records</span>
            </button>
          </Link>
          <Link href="/messages">
            <button className="w-full h-24 rounded-lg border bg-white flex flex-col items-center justify-center space-y-2 font-semibold text-base shadow transition hover:shadow-md">
              <MessageCircle className="h-6 w-6 text-green-500" />
              <span>Messages</span>
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-[#3299a8]" />
                <span>My Appointments</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-[#3299a8] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Appointments</h3>
                <p className="text-gray-600 mb-4">Here you can view your upcoming appointments.</p>
                <Link href="/appointments">
                  <Button
                    className="bg-[#3299a8] hover:bg-[#217a8a] text-white font-semibold px-6 py-2 rounded-lg shadow"
                    data-testid="button-schedule-appointment"
                  >
                    View
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Medical Records */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-[#3299a8]" />
                <span>Medical Records</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-[#3299a8] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Medical Records</h3>
                <p className="text-gray-600 mb-4">You can upload your medical records here.</p>
                <Link href="/upload-report">
                  <Button
                    className="bg-[#3299a8] hover:bg-[#217a8a] text-white font-semibold px-6 py-2 rounded-lg shadow"
                    data-testid="button-upload-records"
                  >
                    Upload Records
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
