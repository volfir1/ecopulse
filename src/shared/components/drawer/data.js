
import { AppIcon } from '../icons';


export const NAVIGATION = [
    
    {
        kind: 'header',
        title: 'Main items',
      },
      {
        kind: 'item',
        segment: 'dashboard',
        title: 'Dashboard',
        icon: <AppIcon name="dashboard" color="solar" />,
      },
      {
        kind: 'divider',
      },
      {
        kind: 'header',
        title: 'Analytics',
      },
      {
        kind: 'item',
        segment: 'reports',
        title: 'Modules',
        icon: <AppIcon name="modules" />,
        children: [
          {
            kind: 'item',
            segment: 'solar',
            title: 'Solar ',
            icon: <AppIcon name="solar" />,
   
          },
          {
            kind: 'item',
            segment: 'wind',
            title: 'Wind ',
            icon: <AppIcon name="wind" />,

          },
          {
            kind: 'item',
            segment: 'geothermal',
            title: 'Geothermal ',
            icon: <AppIcon name="geothermal" />,
          },
          {
            kind: 'item',
            segment: 'hydropower',
            title: 'Hydropower ',
            icon: <AppIcon name="hydropower"/>,
          },
          {
            kind: 'item',
            segment: 'biomass',
            title: 'Biomass ',
            icon: <AppIcon name="biomass" />,
          },
        ],
      },
      {
        kind: 'item',
        segment: 'energyshare',
        title: 'Energy Sharing',
        icon: <AppIcon name="energyshare" />,
      },
      {
        kind: 'item',
        segment: 'solution',
        title: 'Recommendations',
        icon: <AppIcon name="recommendation" />,
      },
      {
        kind: 'item',
        segment: 'jelp',
        title: 'Help & Support',
        icon: <AppIcon name="help" />,
      },
]