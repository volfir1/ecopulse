// src/routes/routes.js
import WindAdmin from '@admin/modules/Wind/WindAdmin';
import { lazy } from 'react';

// User Dashboard & Features
export const userRoutes = {
  Dashboard: lazy(() => import('@features/dashboard/components/Index')),
  EnergySharing: lazy(() => import('@features/energy-sharing/components/Dashboard.jsx')),
  HelpSupport: lazy(() => import('@features/help-support/components/help-support')),
  Recommendations: lazy(() => import('@features/recommendations/components/Recommnedation')),
  UserProfile: lazy(() => import('@features/profile/UserProfile'))
};

// Energy Modules
export const moduleRoutes = {
  Solar: lazy(() => import('@modules/Solar/Solar')),
  Wind: lazy(() => import('@modules/Wind/Wind')),
  Geo: lazy(() => import('@modules/Geo/Geothermal')),
  Hydro: lazy(() => import('@modules/Hydro/Hydropower')),
  Biomass: lazy(() => import('@modules/Biomass/Biomass'))
};

// Admin Routes
export const adminRoutes = {
  Dashboard: lazy(() => import('@admin/dashboard/AdminDashboard.jsx')),
  Analytics: lazy(() => import('@admin/analytics/AdminAnalytics')),
  UserManagement: lazy(() => import('@admin/users/UserControl.jsx')),
  SolarAdmin:lazy(() => import('@admin/modules/Solar/SolarAdmin')),
  WindAdmin: lazy (() => import('@admin/modules/Wind/WindAdmin')),
  GeoAdmin: lazy(() => import('@admin/modules/Geo/GeoAdmin')),
  HydroAdmin: lazy(() => import('@admin/modules/Hydro/HydroAdmin')),
  BioAdmin: lazy(() => import('@admin/modules/Bio/BioAdmin'))
};

// Error Pages
export const errorRoutes = {
  NotFound: lazy(() => import('@exceptions/404/404'))
};