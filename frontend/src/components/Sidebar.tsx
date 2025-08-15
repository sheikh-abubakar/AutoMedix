import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Calendar, 
  Users, 
  FileText, 
  Video, 
  Settings, 
  LogOut,
  Heart,
  Search,
  UserCheck,
  Shield,
  PillBottle
} from "lucide-react";

const doctorNavItems = [
  { icon: BarChart3, label: "Dashboard", href: "/dashboard", badge: null },
  { icon: Calendar, label: "Appointments", href: "/appointments", badge: 12 },
  { icon: Users, label: "My Patients", href: "/patients", badge: null },
  { icon: FileText, label: "Medical Records", href: "/records", badge: null },
  { icon: PillBottle, label: "Prescriptions", href: "/prescriptions", badge: null },
  { icon: Video, label: "Video Consultations", href: "/consultations", badge: null },
  { icon: BarChart3, label: "Analytics", href: "/analytics", badge: null },
];

const patientNavItems = [
  { icon: BarChart3, label: "Dashboard", href: "/dashboard", badge: null },
  { icon: Search, label: "Find Doctors", href: "/doctors", badge: null },
  { icon: Calendar, label: "My Appointments", href: "/appointments", badge: null },
  { icon: FileText, label: "Health Records", href: "/records", badge: null },
  { icon: PillBottle, label: "Prescriptions", href: "/prescriptions", badge: null },
  { icon: Video, label: "Consultations", href: "/consultations", badge: null },
  { icon: Heart, label: "Wellness", href: "/wellness", badge: null },
];

const adminNavItems = [
  { icon: BarChart3, label: "Dashboard", href: "/dashboard", badge: null },
  { icon: Users, label: "User Management", href: "/users", badge: null },
  { icon: UserCheck, label: "Doctor Approvals", href: "/approvals", badge: 8 },
  { icon: Calendar, label: "Appointments", href: "/appointments", badge: null },
  { icon: Shield, label: "System Health", href: "/system", badge: null },
  { icon: BarChart3, label: "Analytics", href: "/analytics", badge: null },
];

export default function Sidebar() {
  const { user } = useAuth();

  const getNavItems = () => {
    switch (user?.role) {
      case 'doctor':
        return doctorNavItems;
      case 'patient':
        return patientNavItems;
      case 'admin':
        return adminNavItems;
      default:
        return [];
    }
  };

  const getRoleInfo = () => {
    switch (user?.role) {
      case 'doctor':
        return { title: "Doctor Dashboard", badge: "PRO" };
      case 'patient':
        return { title: "Patient Portal", badge: "ACTIVE" };
      case 'admin':
        return { title: "Admin Panel", badge: "ADMIN" };
      default:
        return { title: "Dashboard", badge: null };
    }
  };

  const navItems = getNavItems();
  const roleInfo = getRoleInfo();
 const { logout } = useAuth();

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">{roleInfo.title}</span>
            {roleInfo.badge && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {roleInfo.badge}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item, index) => {
          const isActive = index === 1; // Mock active state for appointments
          
          return (
            <Button
              key={item.href}
              variant={isActive ? "secondary" : "ghost"}
              className={`w-full justify-start space-x-3 h-10 ${
                isActive ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
              data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </Button>
          );
        })}
        
        <div className="border-t border-gray-200 pt-4 mt-4">
          <Button
            variant="ghost"
            className="w-full justify-start space-x-3 h-10 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            data-testid="nav-settings"
          >
            <Settings className="h-5 w-5" />
            <span className="font-medium">Settings</span>
          </Button>
          
          <Button
            variant="ghost"
            onClick={logout}
            className="w-full justify-start space-x-3 h-10 text-gray-700 hover:bg-red-50 hover:text-red-600"
            data-testid="nav-logout"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </Button>
        </div>
      </nav>
    </aside>
  );
}
