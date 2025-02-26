import { AppIcon } from '../ui/icons';

export const USER_NAVIGATION = [
  {
    kind: 'header',
    segment: 'header-modules',
    title: 'Main Menu',
  },
  {
    kind: 'item',
    segment: 'modules',
    title: 'Modules',
    icon: <AppIcon name="modules" />,
    path: '/modules',
    children: [
      {
        kind: 'item',
        segment: 'solar',
        title: 'Solar Energy',
        icon: <AppIcon name="solar" />,
        path: '/modules/solar',
      },
      {
        kind: 'item',
        segment: 'wind',
        title: 'Wind Energy',
        icon: <AppIcon name="wind" />,
        path: '/modules/wind',
      },
      {
        kind: 'item',
        segment: 'geothermal',
        title: 'Geothermal',
        icon: <AppIcon name="geothermal" />,
        path: '/modules/geothermal',
      },
      {
        kind: 'item',
        segment: 'hydropower',
        title: 'Hydropower',
        icon: <AppIcon name="hydropower" />,
        path: '/modules/hydropower',
      },
      {
        kind: 'item',
        segment: 'biomass',
        title: 'Biomass',
        icon: <AppIcon name="biomass" />,
        path: '/modules/biomass',
      },
    ],
  },
  {
    kind: 'divider',
    segment: 'divider-analytics',
  },
  {
    kind: 'header',
    segment: 'header-analytics',
    title: 'Analytics',
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
    kind: 'divider',
    segment: 'divider-support',
  },
  {
    kind: 'header',
    segment: 'header-support',
    title: 'Support',
  },
  {
    kind: 'item',
    segment: 'help-support',
    title: 'Help & Support',
    icon: <AppIcon name="help" />,
    path: '/help-support',
  },
  {
    kind: 'item',
    segment: 'settings',
    title: 'Settings',
    icon: <AppIcon name="settings" />,
    path: '/settings',
  }
];

export const ADMIN_NAVIGATION = [
  {
    kind: 'header',
    segment: 'header-main',
    title: 'Main Menu',
  },
  {
    kind: 'item',
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <AppIcon name="dashboard" />,
    path: '/admin/dashboard',
  },
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
        segment: 'wind',
        title: 'Wind Energy',
        icon: <AppIcon name="wind" />,
        path: '/admin/modules/wind',
      },
      {
        kind: 'item',
        segment: 'geothermal',
        title: 'Geothermal',
        icon: <AppIcon name="geothermal" />,
        path: '/admin/modules/geothermal',
      },
      {
        kind: 'item',
        segment: 'hydropower',
        title: 'Hydropower',
        icon: <AppIcon name="hydropower" />,
        path: '/admin/modules/hydropower',
      },
      {
        kind: 'item',
        segment: 'biomass',
        title: 'Biomass',
        icon: <AppIcon name="biomass" />,
        path: '/admin/modules/biomass',
      },
      
    ],
  },
  {
    kind: 'item',
    segment: 'energy-share',
    title: 'Manage Users',
    icon: <AppIcon name="profile" />,
    path: '/admin/users',
  },
];
