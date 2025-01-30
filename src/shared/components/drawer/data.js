import { AppIcon } from '../icons';

export const NAVIGATION = [
  {
    kind: 'header',
    segment: 'header-main', // Added unique segment
    title: 'Main items',
  },
  {
    kind: 'item',
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <AppIcon name="dashboard" color="solar" />,
    path: '/dashboard' // Good - has path
  },
  {
    kind: 'divider',
    segment: 'divider-1' // Added unique segment
  },
  {
    kind: 'header',
    segment: 'header-analytics', // Added unique segment
    title: 'Analytics',
  },
  {
    kind: 'item',
    segment: 'reports',
    title: 'Modules',
    icon: <AppIcon name="modules" />,
    path: '/modules', // Added parent path
    children: [
      {
        kind: 'item',
        segment: 'reports-solar', // Made unique
        title: 'Solar',
        icon: <AppIcon name="solar" />,
        path: '/modules/solar' // Added path
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
    path: '/energy-share'
  },
  {
    kind: 'item',
    segment: 'recommendations',
    title: 'Recommendations',
    icon: <AppIcon name="recommendation" />,  
    path: '/recommendations'
  },
  {
    kind: 'item',
    segment: 'help-support',
    title: 'Help & Support',
    icon: <AppIcon name="help" />,
    path: '/help-support'
  },
];