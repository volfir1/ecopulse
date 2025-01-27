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
              </Route>
             
            </Routes>
            </Suspense>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;