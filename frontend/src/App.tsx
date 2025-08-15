
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, CompanyProvider, NotificationProvider, ProjectProvider, PlatformProvider, VersionProvider } from './contexts';
import { ProtectedRoute, PublicRoute } from './components';
import { LoginPage, RegisterPage, DashboardPage, CompaniesPage, ProjectsPage, PlatformsPage, VersionsPage } from './pages';

function App() {
  return (
    <AuthProvider>
      <CompanyProvider>
        <ProjectProvider>
          <PlatformProvider>
            <VersionProvider>
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
                  path="/projects" 
                  element={
                    <ProtectedRoute>
                      <ProjectsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/platforms" 
                  element={
                    <ProtectedRoute>
                      <PlatformsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/versions" 
                  element={
                    <ProtectedRoute>
                      <VersionsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/projects/:projectId/platforms" 
                  element={
                    <ProtectedRoute>
                      <PlatformsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/projects/:projectId/platforms/:platformId/versions" 
                  element={
                    <ProtectedRoute>
                      <VersionsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/companies/:companyId/projects" 
                  element={
                    <ProtectedRoute>
                      <Navigate to="/projects" replace />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/companies/:companyId/projects/:projectId/platforms" 
                  element={
                    <ProtectedRoute>
                      <Navigate to="/platforms" replace />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/companies/:companyId/projects/:projectId/versions" 
                  element={
                    <ProtectedRoute>
                      <VersionsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/companies/:companyId/projects/:projectId/platforms/:platformId/versions" 
                  element={
                    <ProtectedRoute>
                      <VersionsPage />
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
            </VersionProvider>
          </PlatformProvider>
        </ProjectProvider>
      </CompanyProvider>
    </AuthProvider>
  );
}

export default App;