import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import ErrorBoundary from '../components/ErrorBoundary';
import PublicLayout from '../layouts/PublicLayout';

// Lazy Load Pages
const Landing = lazy(() => import('../pages/Landing'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/ResetPassword'));
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('../pages/TermsOfService'));

const Dashboard = lazy(() => import('../pages/Dashboard'));
const Contacts = lazy(() => import('../pages/Contacts'));
const ContactDetails = lazy(() => import('../pages/ContactDetails'));
const Favorites = lazy(() => import('../pages/Favorites'));
const Profile = lazy(() => import('../pages/Profile'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Suspense fallback spinner matching dark neon aesthetics
const RouteLoader = () => (
  <div className="w-full min-h-[300px] flex flex-col items-center justify-center gap-md">
    <div className="w-10 h-10 rounded-lg bg-surface-container border border-outline/20 flex items-center justify-center animate-pulse">
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
          {/* Public Landing Page */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <Landing />
              </PublicLayout>
            }
          />

          {/* Legal Pages */}
          <Route
            path="/privacy-policy"
            element={
              <PublicLayout>
                <PrivacyPolicy />
              </PublicLayout>
            }
          />
          <Route
            path="/terms-of-service"
            element={
              <PublicLayout>
                <TermsOfService />
              </PublicLayout>
            }
          />

          {/* Public Auth Routes */}
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

          {/* Protected Main Routes */}
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
            path="/profile"
            element={
              <ProtectedRoute title="User Account Profile">
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Fallback & Unknown Redirects */}
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
