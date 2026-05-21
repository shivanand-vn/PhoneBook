import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import ErrorBoundary from '../components/ErrorBoundary';

// Lazy Load Pages
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/ResetPassword'));

const Dashboard = lazy(() => import('../pages/Dashboard'));
const Contacts = lazy(() => import('../pages/Contacts'));
const ContactDetails = lazy(() => import('../pages/ContactDetails'));
const Favorites = lazy(() => import('../pages/Favorites'));
const Recent = lazy(() => import('../pages/Recent'));
const Companies = lazy(() => import('../pages/Companies'));
const Tags = lazy(() => import('../pages/Tags'));
const Settings = lazy(() => import('../pages/Settings'));
const Profile = lazy(() => import('../pages/Profile'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Suspense fallback spinner matching dark neon aesthetics
const RouteLoader = () => (
  <div className="w-full min-h-[300px] flex flex-col items-center justify-center gap-md">
    <div className="w-10 h-10 rounded-lg bg-surface-container border border-primary/20 flex items-center justify-center animate-pulse">
      <span className="material-symbols-outlined text-primary text-[24px] animate-spin">progress_activity</span>
    </div>
    <span className="text-xs font-label-md text-on-surface-variant">Accessing secure node...</span>
  </div>
);

const AppRoutes = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          {/* Public Auth Routes (Wrapped under PublicRoute AuthLayout) */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />

          {/* Protected Main Routes (Wrapped under ProtectedRoute DashboardLayout) */}
          <Route
            path="/"
            element={
              <ProtectedRoute title="Analytics Overview">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute title="Analytics Overview">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contacts"
            element={
              <ProtectedRoute title="Contacts Directory">
                <Contacts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contacts/:id"
            element={
              <ProtectedRoute title="Contact Dossier">
                <ContactDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute title="Starred Connections">
                <Favorites />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recent"
            element={
              <ProtectedRoute title="Recent Updates">
                <Recent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/companies"
            element={
              <ProtectedRoute title="Client Organizations">
                <Companies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tags"
            element={
              <ProtectedRoute title="Active Segments">
                <Tags />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute title="System Settings">
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute title="User Account Profile">
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Fallback & Unknown Redirects (within Protected Dashboard Layout or 404 page) */}
          <Route
            path="*"
            element={
              <ProtectedRoute title="Page Not Found">
                <NotFound />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default AppRoutes;
