// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { lazy, Suspense } from 'react';
import LandingPage from '../features/LandingPage';
import { ThemeProvider } from '@emotion/react';
import { AppProvider } from '@context/AppContext';
import { Login, Register } from '@features';  
import {Layout, Loader, theme} from '@shared/index.js'

// Lazy Loading Pages
const Dashboard = lazy(() => import('../features/dashboard/components/Index'));
const EnergySharing = lazy(() => import('../features/energy-sharing/components/Dashboard'));
const Solar = lazy(() => import('@modules/Solar/Solar'));
const Wind = lazy(() => import('@modules/Wind/Wind'));
const Geo = lazy(() => import('@modules/Geo/Geothermal'));
const Hydro = lazy(() => import('@modules/Hydro/Hydropower'));
const Biomass = lazy(() => import('@modules/Biomass/Biomass'));
const Recommendations = lazy(() => import('@features/recommendations/components/Dashboard'));
// const Login = lazy(()=> import(''))

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppProvider>
        <Router>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<div>About Page</div>} />
              <Route path="/contact" element={<div>Contact Page</div>} />
              <Route path="/signup" element={<div>Signup Page</div>} />

              {/* Layout for authenticated routes */}
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/energy-share" element={<EnergySharing />} />
                <Route path="/modules/solar" element={<Solar />} />
                <Route path="/modules/wind" element={<Wind />} />
                <Route path="/modules/geothermal" element={<Geo />} />
                <Route path="/modules/hydropower" element={<Hydro />} />
                <Route path="/modules/biomass" element={<Biomass />} />
                <Route path="/recommendations" element={<Recommendations />} />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
