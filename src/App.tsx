import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/DashboardLayout";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

import FacultyHome from "./pages/faculty/FacultyHome";
import CreateNewsletter from "./pages/faculty/CreateNewsletter";
import ManageNewsletters from "./pages/faculty/ManageNewsletters";
import FacultySubmissions from "./pages/faculty/FacultySubmissions";

import StudentHome from "./pages/student/StudentHome";
import NewsletterArchive from "./pages/student/NewsletterArchive";
import SubmitProject from "./pages/student/SubmitProject";
import MySubmissions from "./pages/student/MySubmissions";

import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Faculty routes */}
            <Route path="/faculty" element={<ProtectedRoute requiredRole="faculty"><DashboardLayout><FacultyHome /></DashboardLayout></ProtectedRoute>} />
            <Route path="/faculty/create" element={<ProtectedRoute requiredRole="faculty"><DashboardLayout><CreateNewsletter /></DashboardLayout></ProtectedRoute>} />
            <Route path="/faculty/newsletters" element={<ProtectedRoute requiredRole="faculty"><DashboardLayout><ManageNewsletters /></DashboardLayout></ProtectedRoute>} />
            <Route path="/faculty/submissions" element={<ProtectedRoute requiredRole="faculty"><DashboardLayout><FacultySubmissions /></DashboardLayout></ProtectedRoute>} />
            <Route path="/faculty/notifications" element={<ProtectedRoute requiredRole="faculty"><DashboardLayout><Notifications /></DashboardLayout></ProtectedRoute>} />
            <Route path="/faculty/profile" element={<ProtectedRoute requiredRole="faculty"><DashboardLayout><Profile /></DashboardLayout></ProtectedRoute>} />

            {/* Student routes */}
            <Route path="/student" element={<ProtectedRoute requiredRole="student"><DashboardLayout><StudentHome /></DashboardLayout></ProtectedRoute>} />
            <Route path="/student/newsletters" element={<ProtectedRoute requiredRole="student"><DashboardLayout><NewsletterArchive /></DashboardLayout></ProtectedRoute>} />
            <Route path="/student/submit" element={<ProtectedRoute requiredRole="student"><DashboardLayout><SubmitProject /></DashboardLayout></ProtectedRoute>} />
            <Route path="/student/submissions" element={<ProtectedRoute requiredRole="student"><DashboardLayout><MySubmissions /></DashboardLayout></ProtectedRoute>} />
            <Route path="/student/notifications" element={<ProtectedRoute requiredRole="student"><DashboardLayout><Notifications /></DashboardLayout></ProtectedRoute>} />
            <Route path="/student/profile" element={<ProtectedRoute requiredRole="student"><DashboardLayout><Profile /></DashboardLayout></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
