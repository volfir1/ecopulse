import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Suspense } from 'react';
import { ThemeProvider } from '@emotion/react';
import { AppProvider } from '@context/AppContext';
import { Layout, Loader, theme, SnackbarProvider } from '@shared/index.js';
import { userRoutes, moduleRoutes, adminRoutes, errorRoutes, publicRoutes } from './routes/routes';
import PrivateRoute from './routes/PrivateRoute';
import { AuthProvider } from '@context/AuthContext';
import DevToolbar from '@config/DevToolbar.jsx';

const App = () => {
  // Protected routes array for organization
  const protectedRoutes = [
    // User routes - strictly for users only
    { path: '/dashboard', component: <userRoutes.Dashboard />, roles: ['user'] },
    { path: '/energy-share', component: <userRoutes.EnergySharing />, roles: ['user'] },
    { path: '/help-support', component: <userRoutes.HelpSupport />, roles: ['user'] },
    { path: '/recommendations', component: <userRoutes.Recommendations />, roles: ['user'] },
    { path: '/profile', component: <userRoutes.UserProfile />, roles: ['user'] },
    { path: '/mails', component: <userRoutes.UserMails />, roles: ['user']},
    { path: '/mails/:ticketId', component: <userRoutes.TicketConversation />, roles: ['user'] },
    
    // Module routes - create separate routes for each role
    { path: '/modules/solar', component: <moduleRoutes.Solar />, roles: ['user'] },
    { path: '/modules/wind', component: <moduleRoutes.Wind />, roles: ['user'] },
    { path: '/modules/geothermal', component: <moduleRoutes.Geo />, roles: ['user'] },
    { path: '/modules/hydropower', component: <moduleRoutes.Hydro />, roles: ['user'] },
    { path: '/modules/biomass', component: <moduleRoutes.Biomass />, roles: ['user'] },
    
    // Admin module routes
    { path: '/admin/modules/solar', component: <adminRoutes.SolarAdmin />, roles: ['admin'] },
    { path: '/admin/modules/wind', component: <adminRoutes.WindAdmin/>, roles: ['admin'] },
    { path: '/admin/modules/geothermal', component: <adminRoutes.GeoAdmin />, roles: ['admin'] },
    { path: '/admin/modules/hydropower', component: <adminRoutes.HydroAdmin/>, roles: ['admin'] },
    { path: '/admin/modules/biomass', component: <adminRoutes.BioAdmin />, roles: ['admin'] },
    { path: '/admin/modules/input', component: <adminRoutes.Input />, roles: ['admin'] },
    { path: '/admin/modules/add', component: <adminRoutes.AddRecord />, roles: ['admin'] },

    // Admin routes
    { path: '/admin/dashboard', component: <adminRoutes.Dashboard />, roles: ['admin'] },
    { path: '/admin/analytics', component: <adminRoutes.Analytics />, roles: ['admin'] },
    { path: '/admin/users', component: <adminRoutes.UserManagement />, roles: ['admin'] },
    { path: '/admin/profile', component: <adminRoutes.UserProfile />, roles: ['admin'] },
    // Ticket management routes
    { path: '/admin/tickets', component: <adminRoutes.TicketDashboard />, roles: ['admin'] },
    { path: '/admin/tickets/:id', component: <adminRoutes.AdminDetailView />, roles: ['admin'] },
    { path: '/admin/ticket', component: <adminRoutes.AdminTicket />, roles: ['admin'] },
    { path: '/admin/peer', component: <adminRoutes.Peer />, roles: ['admin'] },
    { path: '/admin/recommendation', component: <adminRoutes.Recommendations />, roles: ['admin'] }
  ];

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <AppProvider>
          <Router>
            <AuthProvider>
              <DevToolbar />
              <Suspense fallback={<Loader />}>
                <Routes>
                  {/* Public routes that don't require authentication */}
                  <Route path="/" element={<publicRoutes.LandingPage />} />
                  <Route path="/login" element={<publicRoutes.Login />} />
                  <Route path="/register" element={<publicRoutes.Register />} />
                  <Route path="/verify-email" element={<publicRoutes.VerifyEmail />} />
                  <Route path="/forgot-password" element={<publicRoutes.ForgotPassword />} />
                  <Route path="/reset-password" element={<publicRoutes.ResetPassword />} />
                  
                  {/* Protected Routes wrapped in Layout */}
                  <Route element={<Layout />}>
                    {protectedRoutes.map(route => (
                      <Route
                        key={route.path}
                        path={route.path}
                        element={
                          <PrivateRoute allowedRoles={route.roles}>
                            {route.component}
                          </PrivateRoute>
                        }
                      />
                    ))}
                  </Route>
                  
                  {/* Error Routes */}
                  <Route path="*" element={<errorRoutes.NotFound />} />
                  <Route path="/404" element={<errorRoutes.NotFound />} />
                </Routes>
              </Suspense>
            </AuthProvider>
          </Router>
        </AppProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;