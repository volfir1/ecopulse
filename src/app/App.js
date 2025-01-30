// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, {lazy, Suspense} from 'react';
import LandingPage from '../features/LandingPage';
import Login from 'features/auth/components/login/Login';
import Register from 'features/auth/components/register/Register';
import { ThemeProvider } from '@emotion/react';
import theme from '../shared/components/colors'; 
import {AppProvider} from 'shared/context/AppContext'
import Layout from 'shared/components/Layout';
import Loader from 'shared/components/loaders/Loader';

const Dashboard =  lazy (() => import('../features/dashboard/components/Index'))
const EnergySharing = lazy(()=> import('../features/energy-sharing/components/Dashboard'))
const Solar = lazy(()=>import('features/modules/components/Solar/Solar') )
const Wind = lazy(() =>import('features/modules/components/Wind/Wind'))
const Geo = lazy(()=> import('features/modules/components/Geo/Geothermal') )
const Hydro = lazy(()=> import('features/modules/components/Hydro/Hydropower'))
const Biomass = lazy(()=>import('features/modules/components/Biomass/Biomass'))
const Recommendations = lazy(() => import('features/recommendations/components/Dashboard'))

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

              {/* Layout for authenticated Routes */}
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/energy-share" element={<EnergySharing />} />
                <Route path="/modules/solar" element={<Solar />} />
                <Route path="/modules/wind" element={<Wind />} />
                <Route path="/modules/geothermal" element={<Geo />} />
                <Route path="/modules/geothermal" element={<Geo />} />
                <Route path="/modules/hydropower" element={<Hydro />} />
                <Route path="/modules/biomass" element={<Biomass />} />
                <Route path="/recommendations" element={<Recommendations/>} />
              </Route>
             
            </Routes>
            </Suspense>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;