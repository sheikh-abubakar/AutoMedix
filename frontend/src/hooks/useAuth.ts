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

// import { useState } from "react";
// import axios from "axios";
// import { useLocation } from "wouter";   

// export interface UserProfile {
//   id: string;
// }

// export interface User {
//   id: string;
//   name?: string;
//   //lastName?: string;
//   email?: string;
//   profileImageUrl?: string;
//   role?: "patient" | "doctor" | "admin";
// //  profile?: UserProfile;
// }

// export function useAuth() {
//   const [, setLocation] = useLocation();

//   // Get user from localStorage
//   const getUserFromLocalStorage = (): User | null => {
//     const token = localStorage.getItem("token");
//     const role = localStorage.getItem("role") as User["role"];
//     if (!token || !role) return null;
//     return {
//       id: "",
//       role,
//       // You can add more fields if you store them
//     };
//   };

//   const [user, setUser] = useState<User | null>(getUserFromLocalStorage());
//   const [isLoading, setIsLoading] = useState(false);

//   // Login function
// const login = async (email: string, password: string) => {
//   setIsLoading(true);
//   const res = await axios.post(
//     "http://localhost:5000/api/auth/login", 
//     { email, password },
//     { headers: { "Content-Type": "application/json" } }
//   );
//   localStorage.setItem("token", res.data.token);
//   localStorage.setItem("role", res.data.role);
//   setUser({ id: res.data._id, 
//     name: res.data.name,
//     role: res.data.role, 
//     email: res.data.email, 
//     profileImageUrl: res.data.profileImageUrl });
//   setIsLoading(false);
//   if (res.data.role === "doctor") setLocation("/doctor/dashboard");
//   else if (res.data.role === "admin") setLocation("/admin/dashboard");
//   else setLocation("/patient/dashboard");
// };


//   // Signup function
//   const signup = async (email: string, password: string, name: string, role: string, profileImageUrl: string) => {
//     setIsLoading(true);
//     const res = await axios.post("http://localhost:5000/api/auth/register", { email, password, name, role, profileImageUrl });
//     localStorage.setItem("token", res.data.token);
//     localStorage.setItem("role", res.data.role);
//     setUser({ id: res.data._id, 
//       name: res.data.name,
//       role: res.data.role,
//       email: res.data.email,
//       profileImageUrl: res.data.profileImageUrl
//     });
//     console.log("User data after signup:", res.data);
//     setIsLoading(false);
//     if (res.data.role === "doctor") setLocation("/doctor/dashboard");
//     else if (res.data.role === "admin") setLocation("/admin/dashboard");
//     else setLocation("/patient/dashboard");
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     setUser(null);
//     setLocation("/"); // Redirect to landing page
//   };


//   return {
//     user,
//     isLoading,
//     isAuthenticated: !!user,
//     login,
//     signup,
//     logout,
//   };
// }

//############################
// // import { useQuery } from "@tanstack/react-query";
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
