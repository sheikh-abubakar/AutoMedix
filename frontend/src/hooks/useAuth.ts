import { useQuery } from "@tanstack/react-query";

export interface UserProfile {
  id: string;
}

// Define your user shape for AutoMedix
export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  profileImageUrl?: string;
  role?: "patient" | "doctor" | "admin";
  profile?: UserProfile;
}

export function useAuth() {
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user
  };
}
