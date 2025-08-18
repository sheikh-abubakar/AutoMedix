import { useState } from "react";
import axios from "axios";
import { useLocation } from "wouter";

export interface User {
  id: string;
  name?: string;
  email?: string;
  profileImageUrl?: string;
  role?: "patient" | "doctor" | "admin";
}

export function useAuth() {
  const [, setLocation] = useLocation();

  // Load user from localStorage
  const getUserFromLocalStorage = (): User | null => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role") as User["role"];
    const profileImageUrl = localStorage.getItem("profileImageUrl") || undefined;
    const name = localStorage.getItem("name") || undefined;
    if (!token || !role) return null;
    return { id: "", role, profileImageUrl, name };
  };

  const [user, setUser] = useState<User | null>(getUserFromLocalStorage());
  const [isLoading, setIsLoading] = useState(false);

  // Save user data to localStorage
  const saveUserToLocalStorage = (userData: any) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("role", userData.role);
    localStorage.setItem("profileImageUrl", userData.profileImageUrl || "");
    localStorage.setItem("name", userData.name || "");
  };

  // Login
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });

    const userData = {
      id: res.data._id,
      role: res.data.role,
      email: res.data.email,
      profileImageUrl: res.data.profileImageUrl,
      name: res.data.name,
      token: res.data.token,
    };

    setUser(userData);
    saveUserToLocalStorage(userData);
    setIsLoading(false);

    if (res.data.role === "doctor") setLocation("/doctor/dashboard");
    else if (res.data.role === "admin") setLocation("/admin/dashboard");
    else setLocation("/patient/dashboard");
  };

  // Signup
  const signup = async (email: string, password: string, name: string, role: string, profileImageUrl: string) => {
    setIsLoading(true);
    const res = await axios.post("http://localhost:5000/api/auth/register", { email, password, name, role, profileImageUrl });

    const userData = {
      id: res.data._id,
      role: res.data.role,
      email: res.data.email,
      profileImageUrl: res.data.profileImageUrl,
      name: res.data.name,
      token: res.data.token,
    };

    setUser(userData);
    saveUserToLocalStorage(userData);
    setIsLoading(false);

    if (res.data.role === "doctor") setLocation("/doctor/dashboard");
    else if (res.data.role === "admin") setLocation("/admin/dashboard");
    else setLocation("/patient/dashboard");
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("profileImageUrl");
    localStorage.removeItem("name");
    setUser(null);
    setLocation("/");
  };

  return { user, isLoading, isAuthenticated: !!user, login, signup, logout };
}

