import { useState } from "react";
import axios from "axios";
import { useLocation } from "wouter";

export interface User {
  id: string;
  name?: string;
  email?: string;
  profileImageUrl?: string;
  role?: "patient" | "doctor" | "admin";
  status?: string;
}

export function useAuth() {
  const [, setLocation] = useLocation();

  // Load user from localStorage
  const getUserFromLocalStorage = (): User | null => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role") as User["role"];
    const profileImageUrl = localStorage.getItem("profileImageUrl") || undefined;
    const name = localStorage.getItem("name") || undefined;
    const status = localStorage.getItem("status") || undefined;
    if (!token || !role) return null;
    return { id: "", role, profileImageUrl, name, status };
  };

  const [user, setUser] = useState<User | null>(getUserFromLocalStorage());
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Save user data to localStorage
  const saveUserToLocalStorage = (userData: any) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("role", userData.role);
    localStorage.setItem("profileImageUrl", userData.profileImageUrl || "");
    localStorage.setItem("name", userData.name || "");
    localStorage.setItem("status", userData.status || "");
  };

  // Login
  const login = async (email: string, password: string) => {
  setIsLoading(true);
  setAuthError(null);
  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });

    const userData = {
      id: res.data._id,
      role: res.data.role,
      email: res.data.email,
      profileImageUrl: res.data.profileImageUrl,
      name: res.data.name,
      token: res.data.token,
      status: res.data.status,
    };

    setUser(userData);
    saveUserToLocalStorage(userData);
    setIsLoading(false);

    if (res.data.role === "doctor") {
      if (res.data.status === "approved") {
        setLocation("/doctor/dashboard");
      } else {
        setAuthError("Your account is pending admin approval.");
      }
    } else if (res.data.role === "admin") setLocation("/admin/dashboard");
    else setLocation("/patient/dashboard");
  } catch (err: any) {
    setIsLoading(false);
    if (err.response?.status === 403) {
      setAuthError(err.response.data.message);
    } else {
      setAuthError(err.response?.data?.message || "Login failed");
    }
  }
};

  // Signup
 const signup = async (
  email: string,
  password: string,
  name: string,
  role: string,
  profileImageUrl: string,
  extraFields?: any
) => {
  setIsLoading(true);
  setAuthError(null);
  try {
    const res = await axios.post("http://localhost:5000/api/auth/register", {
      email,
      password,
      name,
      role,
      profileImageUrl,
      ...extraFields,
    });

    const userData = {
      id: res.data._id,
      role: res.data.role,
      email: res.data.email,
      profileImageUrl: res.data.profileImageUrl,
      name: res.data.name,
      token: res.data.token,
      status: res.data.status,
    };

    setUser(userData);
    saveUserToLocalStorage(userData);
    setIsLoading(false);

    if (res.data.role === "doctor") {
      if (res.data.status === "approved") {
        setLocation("/doctor/dashboard");
      } else {
        setAuthError("Your account is pending admin approval.");
      }
    } else if (res.data.role === "admin") setLocation("/admin/dashboard");
    else setLocation("/patient/dashboard");
  } catch (err: any) {
    setIsLoading(false);
    setAuthError(err.response?.data?.message || "Signup failed");
  }
};

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("profileImageUrl");
    localStorage.removeItem("name");
    localStorage.removeItem("status");
    setUser(null);
    setLocation("/");
  };

  return { user, isLoading, isAuthenticated: !!user, login, signup, logout, authError };
}
