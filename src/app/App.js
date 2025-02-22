import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Suspense } from 'react';
import { ThemeProvider } from '@emotion/react';
import { AppProvider } from '@context/AppContext';
import { Layout, Loader, theme, SnackbarProvider } from '@shared/index.js';
import { userRoutes, moduleRoutes, adminRoutes, errorRoutes } from './routes/routes';
import LandingPage from '../features/LandingPage';
import { Login, Register } from '@features/index';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider> {/* Add SnackbarProvider here */}
        <AppProvider>
          <Router>
            <Suspense fallback={<Loader />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes with Layout */}
                <Route element={<Layout />}>
                  {/* User Routes */}
                  <Route path="/dashboard" element={<userRoutes.Dashboard />} />
                  <Route path="/energy-share" element={<userRoutes.EnergySharing />} />
                  <Route path="/help-support" element={<userRoutes.HelpSupport />} />
                  <Route path="/recommendations" element={<userRoutes.Recommendations />} />
                  <Route path="/profile" element={<userRoutes.UserProfile />} />

                  {/* Module Routes */}
                  <Route path="/modules/solar" element={<moduleRoutes.Solar />} />
                  <Route path="/modules/wind" element={<moduleRoutes.Wind />} />
                  <Route path="/modules/geothermal" element={<moduleRoutes.Geo />} />
                  <Route path="/modules/hydropower" element={<moduleRoutes.Hydro />} />
                  <Route path="/modules/biomass" element={<moduleRoutes.Biomass />} />

                  {/* Admin Routes */}
                  <Route path="/admin/dashboard" element={<adminRoutes.Dashboard />} />
                  <Route path="/admin/analytics" element={<adminRoutes.Analytics />} />
                  <Route path="/admin/users" element={<adminRoutes.UserManagement />} />
                </Route>

                {/* Error Routes */}
                <Route path="*" element={<errorRoutes.NotFound />} />
                <Route path="/404" element={<errorRoutes.NotFound />} />
              </Routes>
            </Suspense>
          </Router>
        </AppProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;