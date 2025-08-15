
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, CompanyProvider, NotificationProvider, ProjectProvider } from './contexts';
import { ProtectedRoute, PublicRoute } from './components';
import { LoginPage, RegisterPage, DashboardPage, CompaniesPage, ProjectsPage } from './pages';

function App() {
  return (
    <AuthProvider>
      <CompanyProvider>
        <ProjectProvider>
          <NotificationProvider>
          <Router>
            <Routes>
              {/* Public routes */}
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
              
              {/* Protected routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/companies" 
                element={
                  <ProtectedRoute>
                    <CompaniesPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/companies/:companyId/projects" 
                element={
                  <ProtectedRoute>
                    <ProjectsPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Router>
        </NotificationProvider>
        </ProjectProvider>
      </CompanyProvider>
    </AuthProvider>
  );
}

export default App;