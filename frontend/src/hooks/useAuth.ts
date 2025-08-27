import { useState } from "react";
import axios from "axios";
import { useLocation } from "wouter";

export interface User {
  _id: string;
  name?: string;
  email?: string;
  profileImageUrl?: string;
  role?: "patient" | "doctor" | "admin";
  status?: string;
  age?: number;
  gender?: string;
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
  const _id = localStorage.getItem("_id") || "";
  const age = localStorage.getItem("age");      
  const gender = localStorage.getItem("gender"); 
  if (!token || !role || !_id) return null;
  return {
    _id,
    role,
    profileImageUrl,
    name,
    status,
    age: age ? Number(age) : undefined,
    gender: gender || undefined,
  };
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
    localStorage.setItem("_id", userData._id || "");
    if (userData.age !== undefined) localStorage.setItem("age", userData.age.toString());
    if (userData.gender !== undefined) localStorage.setItem("gender", userData.gender);
  };

  // Login
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });

      const userData = {
        _id: res.data._id,
        role: res.data.role,
        email: res.data.email,
        profileImageUrl: res.data.profileImageUrl,
        name: res.data.name,
        token: res.data.token,
        status: res.data.status,
        age: res.data.age,
        gender: res.data.gender,
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
        throw err;
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
        _id: res.data._id,
        role: res.data.role,
        email: res.data.email,
        profileImageUrl: res.data.profileImageUrl,
        name: res.data.name,
        token: res.data.token,
        status: res.data.status,
        age: res.data.age,
        gender: res.data.gender,
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
    localStorage.removeItem("_id");
    localStorage.removeItem("age");
    localStorage.removeItem("gender");
    setUser(null);
    setLocation("/");
  };

  return { user, isLoading, isAuthenticated: !!user, login, signup, logout, authError };
}