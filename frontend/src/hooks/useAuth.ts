import { useState } from "react";
import axios from "axios";
import { useLocation } from "wouter";

export interface UserProfile {
  id: string;
}

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
  const [, setLocation] = useLocation();

  // Get user from localStorage
  const getUserFromLocalStorage = (): User | null => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role") as User["role"];
    if (!token || !role) return null;
    return {
      id: "",
      role,
      // You can add more fields if you store them
    };
  };

  const [user, setUser] = useState<User | null>(getUserFromLocalStorage());
  const [isLoading, setIsLoading] = useState(false);

  // Login function
const login = async (email: string, password: string) => {
  setIsLoading(true);
  const res = await axios.post(
    "http://localhost:5000/api/auth/login", 
    { email, password },
    { headers: { "Content-Type": "application/json" } }
  );
  localStorage.setItem("token", res.data.token);
  localStorage.setItem("role", res.data.role);
  setUser({ id: res.data._id, role: res.data.role });
  setIsLoading(false);
  if (res.data.role === "doctor") setLocation("/doctor/dashboard");
  else if (res.data.role === "admin") setLocation("/admin/dashboard");
  else setLocation("/patient/dashboard");
};


  // Signup function
  const signup = async (email: string, password: string, name: string, role: string) => {
    setIsLoading(true);
    const res = await axios.post("http://localhost:5000/api/auth/register", { email, password, name, role });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.role);
    setUser({ id: res.data._id, role: res.data.role });
    setIsLoading(false);
    if (res.data.role === "doctor") setLocation("/doctor/dashboard");
    else if (res.data.role === "admin") setLocation("/admin/dashboard");
    else setLocation("/patient/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setLocation("/"); // Redirect to landing page
  };


  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
  };
}// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import { useLocation } from "wouter";

// export interface UserProfile {
//   id: string;
// }

// export interface User {
//   id: string;
//   firstName?: string;
//   lastName?: string;
//   email?: string;
//   profileImageUrl?: string;
//   role?: "patient" | "doctor" | "admin";
//   profile?: UserProfile;
// }

// export function useAuth() {
//   const [, setLocation] = useLocation();

//   const { data: user, isLoading } = useQuery<User | null>({
//     queryKey: ["/api/auth/user"],
//     retry: false,
//   });

//   // Login function
//   const login = async (email: string, password: string) => {
//     const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
//     localStorage.setItem("token", res.data.token);
//     localStorage.setItem("role", res.data.role);

//     if (res.data.role === "doctor") setLocation("/doctor/dashboard");
//     else if (res.data.role === "admin") setLocation("/admin/dashboard");
//     else setLocation("/patient/dashboard");
//   };

//   // Signup function
//   const signup = async (email: string, password: string, name: string, role: string) => {
//     const res = await axios.post("http://localhost:5000/api/auth/register", { email, password, name, role });
//     localStorage.setItem("token", res.data.token);
//     localStorage.setItem("role", res.data.role);

//     if (res.data.role === "doctor") setLocation("/doctor/dashboard");
//     else if (res.data.role === "admin") setLocation("/admin/dashboard");
//     else setLocation("/patient/dashboard");
//   };

//   return {
//     user,
//     isLoading,
//     isAuthenticated: !!user,
//     login,
//     signup,
//   };
// }

// ####################################################

// import { useQuery } from "@tanstack/react-query";

// export interface UserProfile {
//   id: string;
// }

// // Define your user shape for AutoMedix
// export interface User {
//   id: string;
//   firstName?: string;
//   lastName?: string;
//   email?: string;
//   profileImageUrl?: string;
//   role?: "patient" | "doctor" | "admin";
//   profile?: UserProfile;
// }

// export function useAuth() {
//   const { data: user, isLoading } = useQuery<User | null>({
//     queryKey: ["/api/auth/user"],
//     retry: false,
//   });

//   return {
//     user,
//     isLoading,
//     isAuthenticated: !!user
//   };
// }
