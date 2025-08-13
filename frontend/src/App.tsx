
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts';
import { ProtectedRoute, PublicRoute, DashboardLayout } from './components';
import { LoginPage, RegisterPage, DashboardPage } from './pages';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes (only accessible when NOT authenticated) */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            } 
          />

          {/* Protected Routes with Dashboard Layout */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="projects" element={<div className="p-6">Projects Page - Coming Soon</div>} />
            <Route path="tasks" element={<div className="p-6">Tasks Page - Coming Soon</div>} />
            <Route path="calendar" element={<div className="p-6">Calendar Page - Coming Soon</div>} />
            <Route path="team/*" element={<div className="p-6">Team Management - Coming Soon</div>} />
            <Route path="companies" element={<div className="p-6">Companies Page - Coming Soon</div>} />
            <Route path="reports" element={<div className="p-6">Reports Page - Coming Soon</div>} />
            <Route path="documents" element={<div className="p-6">Documents Page - Coming Soon</div>} />
            <Route path="settings" element={<div className="p-6">Settings Page - Coming Soon</div>} />
            <Route path="help" element={<div className="p-6">Help & Support - Coming Soon</div>} />
          </Route>

          {/* Catch all - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;