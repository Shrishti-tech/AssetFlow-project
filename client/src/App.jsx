import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/context/AuthContext";
import { AuthLayout } from "./auth/components/AuthLayout";
import Login from "./auth/pages/Login";
import Signup from "./auth/pages/Signup";
import ForgotPassword from "./auth/pages/ForgotPassword";
import ResetPassword from "./auth/pages/ResetPassword";
import ProtectedRoute from "./auth/routes/ProtectedRoute";
import Dashboard from "./dashboard/Dashboard";
import { AssetDetails, AssetDirectory, AssetHistory, AssetProvider, EditAsset, RegisterAsset } from "./asset";
import BookResource from "./pages/booking/BookResource";
import BookingHistory from "./pages/booking/BookingHistory";
import BookingCalendar from "./pages/booking/BookingCalendar";
import RaiseRequest from "./pages/maintenance/RaiseRequest";
import MaintenanceList from "./pages/maintenance/MaintenanceList";
import MaintenanceDetails from "./pages/maintenance/MaintenanceDetails";
import TechnicianAssignment from "./pages/maintenance/TechnicianAssignment";
import MaintenanceHistory from "./pages/maintenance/MaintenanceHistory";
import AllocateAsset from "./pages/allocation/AllocateAsset";
import TransferAsset from "./pages/allocation/TransferAsset";
import AllocationList from "./pages/allocation/AllocationList";
import AllocationHistory from "./pages/allocation/AllocationHistory";
import ReturnAsset from "./pages/allocation/ReturnAsset";
import ReportsDashboard from "./pages/reports/ReportsDashboard";
import AssetUtilization from "./pages/reports/AssetUtilization";
import DepartmentReport from "./pages/reports/DepartmentReport";
import BookingHeatmap from "./pages/reports/BookingHeatmap";
import MaintenanceReport from "./pages/reports/MaintenanceReport";
import ExportReport from "./pages/reports/ExportReport";
import AuditCycle from "./pages/audit/AuditCycle";
import AssignAuditor from "./pages/audit/AssignAuditor";
import AuditVerification from "./pages/audit/AuditVerification";
import DiscrepancyReport from "./pages/audit/DiscrepancyReport";
import AuditHistory from "./pages/audit/AuditHistory";
import Profile from "./pages/profile/Profile";
import NotificationCenter from "./pages/notifications/NotificationCenter";
import ActivityLogs from "./pages/notifications/ActivityLogs";
import ReminderCenter from "./pages/notifications/ReminderCenter";
import { OrganizationSetup } from "./organization";
import HelpSupport from "./help/HelpSupport";
import "./styles.css";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AssetProvider>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Route>
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/assets" element={<ProtectedRoute><AssetDirectory /></ProtectedRoute>} />
          <Route path="/assets/new" element={<ProtectedRoute><RegisterAsset /></ProtectedRoute>} />
          <Route path="/assets/:id" element={<ProtectedRoute><AssetDetails /></ProtectedRoute>} />
          <Route path="/assets/:id/history" element={<ProtectedRoute><AssetHistory /></ProtectedRoute>} />
          <Route path="/assets/:id/edit" element={<ProtectedRoute><EditAsset /></ProtectedRoute>} />
          <Route path="/bookings" element={<ProtectedRoute><BookingCalendar /></ProtectedRoute>} />
          <Route path="/bookings/history" element={<ProtectedRoute><BookingHistory /></ProtectedRoute>} />
          <Route path="/bookings/calendar" element={<ProtectedRoute><BookingCalendar /></ProtectedRoute>} />
          <Route path="/bookings/new" element={<ProtectedRoute><BookResource /></ProtectedRoute>} />
          <Route path="/maintenance" element={<ProtectedRoute><MaintenanceList /></ProtectedRoute>} />
          <Route path="/maintenance/new" element={<ProtectedRoute><RaiseRequest /></ProtectedRoute>} />
          <Route path="/maintenance/history" element={<ProtectedRoute><MaintenanceHistory /></ProtectedRoute>} />
          <Route path="/maintenance/:id" element={<ProtectedRoute><MaintenanceDetails /></ProtectedRoute>} />
          <Route path="/maintenance/:id/assign" element={<ProtectedRoute><TechnicianAssignment /></ProtectedRoute>} />
          <Route path="/allocation" element={<ProtectedRoute><AllocateAsset /></ProtectedRoute>} />
          <Route path="/allocations" element={<ProtectedRoute><AllocationList /></ProtectedRoute>} />
          <Route path="/allocations/history" element={<ProtectedRoute><AllocationHistory /></ProtectedRoute>} />
          <Route path="/returns" element={<ProtectedRoute><ReturnAsset /></ProtectedRoute>} />
          <Route path="/transfers" element={<ProtectedRoute><TransferAsset /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><ReportsDashboard /></ProtectedRoute>} />
          <Route path="/reports/assets" element={<ProtectedRoute><AssetUtilization /></ProtectedRoute>} />
          <Route path="/reports/departments" element={<ProtectedRoute><DepartmentReport /></ProtectedRoute>} />
          <Route path="/reports/bookings" element={<ProtectedRoute><BookingHeatmap /></ProtectedRoute>} />
          <Route path="/reports/maintenance" element={<ProtectedRoute><MaintenanceReport /></ProtectedRoute>} />
          <Route path="/reports/export" element={<ProtectedRoute><ExportReport /></ProtectedRoute>} />
          <Route path="/audits" element={<ProtectedRoute><AuditCycle /></ProtectedRoute>} />
          <Route path="/audits/history" element={<ProtectedRoute><AuditHistory /></ProtectedRoute>} />
          <Route path="/audits/:id/assign" element={<ProtectedRoute><AssignAuditor /></ProtectedRoute>} />
          <Route path="/audits/:id/verify" element={<ProtectedRoute><AuditVerification /></ProtectedRoute>} />
          <Route path="/audits/:id/report" element={<ProtectedRoute><DiscrepancyReport /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><NotificationCenter /></ProtectedRoute>} />
          <Route path="/activity" element={<ProtectedRoute><ActivityLogs /></ProtectedRoute>} />
          <Route path="/reminders" element={<ProtectedRoute><ReminderCenter /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/organization" element={<ProtectedRoute><OrganizationSetup /></ProtectedRoute>} />
          <Route path="/help" element={<ProtectedRoute><HelpSupport /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        </AssetProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
