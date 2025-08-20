import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Bell, Heart, ChevronDown } from "lucide-react";


export default function Navbar() {
  const { user } = useAuth();
  const { logout } = useAuth();

  // const handleLogout = () => {
  //   window.location.href = "/api/logout";
  // };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-gray-900">AutoMedix</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative"
              data-testid="button-notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </Button>
            
            <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded-lg p-2">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-300"></div>
              )}
              <span className="text-sm font-medium text-gray-700" data-testid="text-user-name">
                {user?.name ? user.name : 'User'}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
            <div>
              <Button onClick={logout}>Logout</Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
