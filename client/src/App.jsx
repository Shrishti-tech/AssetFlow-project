import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/context/AuthContext";
import { AuthLayout } from "./auth/components/AuthLayout";
import Login from "./auth/pages/Login";
import Signup from "./auth/pages/Signup";
import ForgotPassword from "./auth/pages/ForgotPassword";
import ResetPassword from "./auth/pages/ResetPassword";
import ProtectedRoute from "./auth/routes/ProtectedRoute";
import Dashboard from "./dashboard/Dashboard";
import AssetList from "./assets/AssetList";
import AddAsset from "./assets/AddAsset";
import BookResource from "./pages/booking/BookResource";
import BookingHistory from "./pages/booking/BookingHistory";
import RaiseRequest from "./pages/maintenance/RaiseRequest";
import MaintenanceList from "./pages/maintenance/MaintenanceList";
import AllocateAsset from "./pages/allocation/AllocateAsset";
import TransferAsset from "./pages/allocation/TransferAsset";
import AllocationList from "./pages/allocation/AllocationList";
import AllocationHistory from "./pages/allocation/AllocationHistory";
import ReturnAsset from "./pages/allocation/ReturnAsset";
import Analytics from "./pages/reports/Analytics";
import Profile from "./pages/profile/Profile";
import "./styles.css";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Route>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assets"
            element={
              <ProtectedRoute>
                <AssetList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assets/new"
            element={
              <ProtectedRoute>
                <AddAsset />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <BookingHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings/new"
            element={
              <ProtectedRoute>
                <BookResource />
              </ProtectedRoute>
            }
          />
          <Route
            path="/maintenance"
            element={
              <ProtectedRoute>
                <MaintenanceList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/maintenance/new"
            element={
              <ProtectedRoute>
                <RaiseRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/allocation"
            element={
              <ProtectedRoute>
                <AllocateAsset />
              </ProtectedRoute>
            }
          />
          <Route
            path="/allocations"
            element={
              <ProtectedRoute>
                <AllocationList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/allocations/history"
            element={
              <ProtectedRoute>
                <AllocationHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/returns"
            element={
              <ProtectedRoute>
                <ReturnAsset />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transfers"
            element={
              <ProtectedRoute>
                <TransferAsset />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
