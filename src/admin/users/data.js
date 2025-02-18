export const userManagementData = {
    statistics: {
      totalUsers: '1,245',
      activeUsers: '1,180',
      newUsers: '65',
      verifiedUsers: '1,150'
    },
    usersList: [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'residential',
        status: 'active',
        lastActive: '2024-02-19T10:30:00',
        energyUsage: '320 kWh',
        dateJoined: '2024-01-15',
        verified: true
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        role: 'commercial',
        status: 'inactive',
        lastActive: '2024-02-18T15:45:00',
        energyUsage: '850 kWh',
        dateJoined: '2024-01-20',
        verified: true
      }
      // ... more user data
    ],
    userActivity: [
      { date: '2024-02-19', newUsers: 12, activeUsers: 980, totalLogins: 1500 },
      { date: '2024-02-18', newUsers: 15, activeUsers: 965, totalLogins: 1450 },
      { date: '2024-02-17', newUsers: 8, activeUsers: 950, totalLogins: 1400 }
      // ... more activity data
    ],
    roles: ['residential', 'commercial', 'industrial', 'admin'],
    statuses: ['active', 'inactive', 'suspended', 'pending']
  };