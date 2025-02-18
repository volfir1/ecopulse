import { AppIcon } from '../ui/icons';

export const USER_NAVIGATION = [
  {
    kind: 'header',
    segment: 'header-main',
    title: 'Main items',
  },
  {
    kind: 'item',
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <AppIcon name="dashboard" color="solar" />,
    path: '/dashboard',
  },
  {
    kind: 'divider',
    segment: 'divider-user',
  },
  {
    kind: 'header',
    segment: 'header-analytics',
    title: 'Analytics',
  },
  {
    kind: 'item',
    segment: 'reports',
    title: 'Modules',
    icon: <AppIcon name="modules" />,
    path: '/modules',
    children: [
      {
        kind: 'item',
        segment: 'reports-solar',
        title: 'Solar',
        icon: <AppIcon name="solar" />,
        path: '/modules/solar'
      },
      {
        kind: 'item',
        segment: 'reports-wind',
        title: 'Wind',
        icon: <AppIcon name="wind" />,
        path: '/modules/wind'
      },
      {
        kind: 'item',
        segment: 'reports-geothermal',
        title: 'Geothermal',
        icon: <AppIcon name="geothermal" />,
        path: '/modules/geothermal'
      },
      {
        kind: 'item',
        segment: 'reports-hydropower',
        title: 'Hydropower',
        icon: <AppIcon name="hydropower"/>,
        path: '/modules/hydropower'
      },
      {
        kind: 'item',
        segment: 'reports-biomass',
        title: 'Biomass',
        icon: <AppIcon name="biomass" />,
        path: '/modules/biomass'
      },
    ],
  },
  {
    kind: 'item',
    segment: 'energy-share',
    title: 'Energy Sharing',
    icon: <AppIcon name="energyshare" />,
    path: '/energy-share',
  },
  {
    kind: 'item',
    segment: 'recommendations',
    title: 'Recommendations',
    icon: <AppIcon name="recommendation" />,  
    path: '/recommendations',
  },
  {
    kind: 'item',
    segment: 'help-support',
    title: 'Help & Support',
    icon: <AppIcon name="help" />,
    path: '/help-support',
  },
];

export const ADMIN_NAVIGATION = [
  {
    kind: 'divider',
    segment: 'divider-admin',
  },
  {
    kind: 'header',
    segment: 'header-admin',
    title: 'Admin Panel',
  },
  {
    kind: 'item',
    segment: 'modules',
    title: 'Modules',
    icon: <AppIcon name="modules" />,
    path: '/admin/modules',
    children: [
      {
        kind: 'item',
        segment: 'modules-solar',
        title: 'Solar',
        icon: <AppIcon name="solar" />,
        path: '/admin/modules/solar',
      },
      {
        kind: 'item',
        segment: 'modules-wind',
        title: 'Wind',
        icon: <AppIcon name="wind" />,
        path: '/admin/modules/wind',
      },
      {
        kind: 'item',
        segment: 'modules-geothermal',
        title: 'Geothermal',
        icon: <AppIcon name="geothermal" />,
        path: '/admin/modules/geothermal',
      },
      {
        kind: 'item',
        segment: 'modules-hydropower',
        title: 'Hydropower',
        icon: <AppIcon name="hydropower" />,
        path: '/admin/modules/hydropower',
      },
      {
        kind: 'item',
        segment: 'modules-biomass',
        title: 'Biomass',
        icon: <AppIcon name="biomass" />,
        path: '/admin/modules/biomass',
      },
    ],
  },
  {
    kind: 'item',
    segment: 'admin-analytics',
    title: 'Admin Analytics',
    icon: <AppIcon name="analytics" />,
    path: '/admin/analytics',
  },
];