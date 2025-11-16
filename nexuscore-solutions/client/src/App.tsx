// import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ROUTES } from './utils/constants';

// Public Pages
import Home from './pages/Home';
import Services from './pages/Services';
import Projects from './pages/Projects';
// import ProjectDetail from './pages/ProjectDetail';
import CaseStudies from './pages/CaseStudies';
// import CaseStudyDetail from './pages/CaseStudyDetail';
import Resources from './pages/Resources';
import About from './pages/About';
import Achievements from './pages/Achievements';
import Contact from './pages/Contact';
// import NewsletterConfirm from './pages/NewsletterConfirm';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageServices from './components/admin/ManageServices';
import ManageProjects from './components/admin/ManageProjects';
import ManageCaseStudies from './components/admin/ManageCaseStudies';
import ManageWhitepapers from './components/admin/ManageWhitepapers';
import ManageTeam from './components/admin/ManageTeam';
import ManageAchievements from './components/admin/ManageAchievements';
import ManageContact from './components/admin/ManageContact';
import ManageNewsletter from './components/admin/ManageNewsletter';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
            <Routes>
              {/* Public Routes */}
              <Route path={ROUTES.HOME} element={<Home />} />
              <Route path={ROUTES.SERVICES} element={<Services />} />
              <Route path={ROUTES.PROJECTS} element={<Projects />} />
              {/* <Route path="/projects/:id" element={<ProjectDetail />} /> */}
              <Route path={ROUTES.CASE_STUDIES} element={<CaseStudies />} />
              {/* <Route path="/case-studies/:id" element={<CaseStudyDetail />} /> */}
              <Route path={ROUTES.RESOURCES} element={<Resources />} />
              <Route path={ROUTES.ABOUT} element={<About />} />
              <Route path={ROUTES.ACHIEVEMENTS} element={<Achievements />} />
              <Route path={ROUTES.CONTACT} element={<Contact />} />
              {/* <Route path="/newsletter/confirm/:token" element={<NewsletterConfirm />} /> */}

              {/* Admin Auth Route */}
              <Route path={ROUTES.ADMIN.LOGIN} element={<AdminLogin />} />

              {/* Protected Admin Routes */}
              <Route
                path={ROUTES.ADMIN.DASHBOARD}
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.ADMIN.SERVICES}
                element={
                  <ProtectedRoute>
                    <ManageServices />
                  </ProtectedRoute>
                }
              />
               <Route
                path={ROUTES.ADMIN.PROJECTS}
                element={
                  <ProtectedRoute>
                    <ManageProjects />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.ADMIN.CASE_STUDIES}
                element={
                  <ProtectedRoute>
                    <ManageCaseStudies />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.ADMIN.WHITEPAPERS}
                element={
                  <ProtectedRoute>
                    <ManageWhitepapers />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.ADMIN.TEAM}
                element={
                  <ProtectedRoute>
                    <ManageTeam />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.ADMIN.ACHIEVEMENTS}
                element={
                  <ProtectedRoute>
                    <ManageAchievements />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.ADMIN.MESSAGES}
                element={
                  <ProtectedRoute>
                    <ManageContact />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.ADMIN.SUBSCRIBERS}
                element={
                  <ProtectedRoute>
                    <ManageNewsletter />
                  </ProtectedRoute>
                }
              />

              {/* 404 Redirect */}
              <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
            </Routes>

            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;