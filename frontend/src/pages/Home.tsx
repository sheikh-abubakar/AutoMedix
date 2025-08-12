import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Use fetch directly if apiRequest is typed wrongly
// import { apiRequest } from "@/lib/queryClient";

import DoctorDashboard from "./doctor/Dashboard";
import PatientDashboard from "./patient/Dashboard";
import AdminDashboard from "./admin/Dashboard";

import { UserCheck, Stethoscope, Users, Shield } from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState("");

  const updateRoleMutation = useMutation({
    mutationFn: async (role: string) => {
      // Using fetch directly here with proper typing and headers
      const res = await fetch(`/api/users/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error("Failed to update role");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Role Updated!",
        description: "Your account has been set up successfully. Redirecting to dashboard...",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update role. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleRoleSelection = () => {
    if (!selectedRole) {
      toast({
        title: "Please select a role",
        description: "Choose how you want to use AutoMedix",
        variant: "destructive",
      });
      return;
    }
    updateRoleMutation.mutate(selectedRole);
  };

  if (user?.role === "doctor") {
    return <DoctorDashboard />;
  } else if (user?.role === "patient") {
    return <PatientDashboard />;
  } else if (user?.role === "admin") {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <UserCheck className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Welcome to AutoMedix</CardTitle>
          <p className="text-gray-600 mt-2">Choose your role to get started with our healthcare platform</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              How do you want to use AutoMedix?
            </label>

            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger data-testid="select-user-role">
                <SelectValue placeholder="Select your role..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="patient">
                  <div className="flex items-center space-x-3 py-2">
                    <Users className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium">Patient</div>
                      <div className="text-sm text-gray-500">Book appointments, manage health records</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="doctor">
                  <div className="flex items-center space-x-3 py-2">
                    <Stethoscope className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">Doctor</div>
                      <div className="text-sm text-gray-500">Manage patients, consultations, appointments</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex items-center space-x-3 py-2">
                    <Shield className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-medium">Administrator</div>
                      <div className="text-sm text-gray-500">System management and oversight</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedRole && (
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="pt-4">
                <div className="text-sm">
                  <h4 className="font-medium text-gray-900 mb-2">
                    {selectedRole === "patient" && "As a Patient, you can:"}
                    {selectedRole === "doctor" && "As a Doctor, you can:"}
                    {selectedRole === "admin" && "As an Administrator, you can:"}
                  </h4>
                  <ul className="text-gray-600 space-y-1">
                    {selectedRole === "patient" && (
                      <>
                        <li>• Find and book appointments with doctors</li>
                        <li>• Upload and manage your medical records</li>
                        <li>• Message doctors and receive consultations</li>
                        <li>• Track your health history and appointments</li>
                      </>
                    )}
                    {selectedRole === "doctor" && (
                      <>
                        <li>• Manage your patient appointments</li>
                        <li>• Access patient medical records</li>
                        <li>• Provide consultations and treatment plans</li>
                        <li>• Communicate with patients via messaging</li>
                      </>
                    )}
                    {selectedRole === "admin" && (
                      <>
                        <li>• Manage users and system settings</li>
                        <li>• View platform analytics and reports</li>
                        <li>• Oversee doctor and patient activities</li>
                        <li>• Handle system administration tasks</li>
                      </>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          <Button
            onClick={handleRoleSelection}
            disabled={!selectedRole || updateRoleMutation.isPending}
            className="w-full"
            data-testid="button-confirm-role"
          >
            {updateRoleMutation.isPending ? "Setting up your account..." : "Continue"}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            You can change your role later in your account settings
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
