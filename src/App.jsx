import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import EventList from './pages/EventList';
import EventDetails from './pages/EventDetails';
import Registration from './pages/Registration';
import RegistrationSuccess from './pages/RegistrationSuccess';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ManageEvents from './pages/ManageEvents';
import CreateEvent from './pages/CreateEvent';
import EventManagement from './pages/EventManagement';
import Registrations from './pages/Registrations';
import Attendance from './pages/Attendance';

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Public Student Routes */}
            <Route path="/" element={<Navigate to="/events" replace />} />
            <Route path="/events" element={<EventList />} />
            <Route path="/events/:eventId" element={<EventDetails />} />
            <Route path="/events/:eventId/register" element={<Registration />} />
            <Route path="/registration-success" element={<RegistrationSuccess />} />

            {/* Admin Login */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/events"
              element={
                <ProtectedRoute>
                  <ManageEvents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/events/create"
              element={
                <ProtectedRoute>
                  <CreateEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/events/:eventId"
              element={
                <ProtectedRoute>
                  <EventManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/events/:eventId/edit"
              element={
                <ProtectedRoute>
                  <CreateEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/registrations"
              element={
                <ProtectedRoute>
                  <Registrations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/attendance"
              element={
                <ProtectedRoute>
                  <Attendance />
                </ProtectedRoute>
              }
            />

            {/* Catch-all 404 redirect */}
            <Route path="*" element={<Navigate to="/events" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
