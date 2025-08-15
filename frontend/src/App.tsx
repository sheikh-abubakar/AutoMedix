import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import DoctorDashboard from "@/pages/doctor/Dashboard";
import PatientDashboard from "@/pages/patient/Dashboard";
import AdminDashboard from "@/pages/admin/Dashboard";
import FindDoctors from "@/pages/patient/FindDoctors";
import BookAppointment from "@/pages/patient/BookAppointment";
import HealthRecords from "@/pages/patient/HealthRecords";
import Messages from "@/pages/patient/Messages";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/doctor/dashboard" component={DoctorDashboard} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/patient/dashboard" component={PatientDashboard} />
      <Route path="/find-doctors" component={FindDoctors} />
      <Route path="/book-appointment" component={BookAppointment} />
      <Route path="/health-records" component={HealthRecords} />
      <Route path="/messages" component={Messages} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
// import { Switch, Route } from "wouter";
// import { queryClient } from "./lib/queryClient";
// import { QueryClientProvider } from "@tanstack/react-query";
// import { Toaster } from "@/components/ui/toaster";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { useAuth } from "@/hooks/useAuth";
// import NotFound from "@/pages/not-found";
// import Landing from "@/pages/Landing";
// import Home from "@/pages/Home";
// import DoctorDashboard from "@/pages/doctor/Dashboard";
// import PatientDashboard from "@/pages/patient/Dashboard";
// import AdminDashboard from "@/pages/admin/Dashboard";
// import FindDoctors from "@/pages/patient/FindDoctors";
// import BookAppointment from "@/pages/patient/BookAppointment";
// import HealthRecords from "@/pages/patient/HealthRecords";
// import Messages from "@/pages/patient/Messages";

// function Router() {
//   const { isAuthenticated, isLoading, user } = useAuth();

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <Switch>
//       {!isAuthenticated ? (
//         <Route path="/" component={Landing} />
//       ) : (
//         <>
//           <Route path="/" component={Home} />
//           <Route path="/dashboard">
//             {user?.role === 'doctor' && <DoctorDashboard />}
//             {user?.role === 'patient' && <PatientDashboard />}
//             {user?.role === 'admin' && <AdminDashboard />}   
//           </Route>
//           <Route path="/find-doctors" component={FindDoctors} />
//           <Route path="/book-appointment" component={BookAppointment} />
//           <Route path="/health-records" component={HealthRecords} />
//           <Route path="/messages" component={Messages} />
//         </>
//       )}
//       <Route component={NotFound} />
//     </Switch>
//   );
// }

// function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <TooltipProvider>
//         <Toaster />
//         <Router />
//       </TooltipProvider>
//     </QueryClientProvider>
//   );
// }

// export default App;
