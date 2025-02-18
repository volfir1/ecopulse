export const overviewData = {
    totalUsers: {
      count: 2547,
      trend: '+12.5%',
      period: 'vs last month',
      icon: 'users',
      color: 'primary.main'
    },
    activeProjects: {
      count: 24,
      trend: '+3',
      period: 'new this week',
      icon: 'activity',
      color: 'success.main'
    },
    energySavings: {
      count: '₱2.4M',
      trend: '+18.2%',
      period: 'vs last quarter',
      icon: 'trending-up',
      color: 'warning.main'
    }
  };
  
  export const recentActivities = [
    {
      id: 1,
      type: 'project',
      title: 'Solar Installation Phase 2',
      status: 'in-progress',
      timestamp: '2 hours ago',
      details: 'Team deployed 50 new panels'
    },
    {
      id: 2,
      type: 'report',
      title: 'Monthly Energy Report',
      status: 'completed',
      timestamp: '5 hours ago',
      details: 'Generated for all active sites'
    },
    {
      id: 3,
      type: 'alert',
      title: 'System Maintenance',
      status: 'pending',
      timestamp: 'Tomorrow',
      details: 'Scheduled downtime: 2AM-4AM'
    }
  ];
  
  export const performanceMetrics = {
    weeklyGeneration: [
      { day: 'Mon', solar: 420, wind: 380, hydro: 340 },
      { day: 'Tue', solar: 450, wind: 400, hydro: 360 },
      { day: 'Wed', solar: 480, wind: 420, hydro: 350 },
      { day: 'Thu', solar: 460, wind: 390, hydro: 370 },
      { day: 'Fri', solar: 440, wind: 380, hydro: 345 },
      { day: 'Sat', solar: 410, wind: 360, hydro: 330 },
      { day: 'Sun', solar: 390, wind: 340, hydro: 320 }
    ],
    efficiency: {
      solar: 92,
      wind: 88,
      hydro: 95
    }
  };