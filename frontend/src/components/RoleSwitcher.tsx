import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
// Remove unused imports CardHeader, CardTitle
// import { apiRequest } from "@/lib/queryClient";
import { UserCircle, Settings } from "lucide-react";

interface RoleSwitcherProps {
  currentRole: string;
  userId: string;
}

export default function RoleSwitcher({ currentRole, userId }: RoleSwitcherProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState(currentRole);
  const [isOpen, setIsOpen] = useState(false);

  const switchRoleMutation = useMutation({
    mutationFn: async (newRole: string) => {
      // Use fetch with proper headers and options
      const res = await fetch(`/api/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error("Failed to update role");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Role Updated",
        description: "Your role has been successfully updated. Please refresh the page.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setIsOpen(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update role. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleRoleSwitch = () => {
    if (selectedRole === currentRole) {
      toast({
        title: "Same Role",
        description: "You are already in this role.",
        variant: "default",
      });
      return;
    }
    switchRoleMutation.mutate(selectedRole);
  };

  const roles = [
    { value: "patient", label: "Patient", description: "Access patient features like booking appointments and health records" },
    { value: "doctor", label: "Doctor", description: "Manage appointments, patients, and provide consultations" },
    { value: "admin", label: "Administrator", description: "System administration and user management" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" data-testid="button-role-switcher">
          <UserCircle className="h-4 w-4 mr-2" />
          Switch Role
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Switch User Role</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-3">
              Current role: <span className="font-medium capitalize">{currentRole}</span>
            </p>

            <label htmlFor="role-select" className="text-sm font-medium text-gray-700">
              Select new role:
            </label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="mt-1" data-testid="select-new-role">
                <SelectValue placeholder="Choose a role..." />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{role.label}</span>
                      <span className="text-xs text-gray-500">{role.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
              <div className="text-sm">
                <h4 className="font-medium text-blue-900 mb-2">Role Access Guide:</h4>
                <ul className="text-blue-800 space-y-1 text-xs">
                  <li>
                    <strong>Patient:</strong> Book appointments, view records, message doctors
                  </li>
                  <li>
                    <strong>Doctor:</strong> Manage appointments, access patient records, consultations
                  </li>
                  <li>
                    <strong>Admin:</strong> User management, system overview, analytics
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="flex space-x-3 pt-4">
            <Button
              onClick={handleRoleSwitch}
              disabled={switchRoleMutation.isPending || selectedRole === currentRole}
              className="flex-1"
              data-testid="button-confirm-role-switch"
            >
              {switchRoleMutation.isPending ? "Switching..." : "Switch Role"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
              data-testid="button-cancel-role-switch"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
