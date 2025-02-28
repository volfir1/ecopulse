// Mock data for user management
export const userManagementData = {
  statistics: {
    totalUsers: '9',
    activeUsers: '4',
    newUsers: '9',
    verifiedUsers: '0'
  },
  usersList: [
    {
      id: 1,
      name: 'John leonard',
      email: 'leonard@gmail.com',
      role: 'user',
      status: 'inactive',
      lastActive: '2/26/2025'
    },
    {
      id: 2,
      name: 'user 1',
      email: 'user@gmail.com',
      role: 'user',
      status: 'active',
      lastActive: '2/26/2025'
    },
    {
      id: 3,
      name: 'Lester Sible',
      email: 'lesterpulansible@gmail.com',
      role: 'admin',
      status: 'active',
      lastActive: '2/26/2025'
    },
    {
      id: 4,
      name: 'name1 name2',
      email: 'name@gmail.com',
      role: 'user',
      status: 'inactive',
      lastActive: '2/25/2025'
    },
    {
      id: 5,
      name: 'John a',
      email: 'admin@123.com',
      role: 'admin',
      status: 'active',
      lastActive: '2/26/2025'
    },
    {
      id: 6,
      name: 'John Martins',
      email: 'john1@gmail.com',
      role: 'user',
      status: 'inactive',
      lastActive: '2/25/2025'
    },
    {
      id: 7,
      name: 'John Martin',
      email: 'john@gmail.com',
      role: 'admin',
      status: 'active',
      lastActive: '2/26/2025'
    },
    {
      id: 8,
      name: 'Lester Sible',
      email: 'admin@gmail.com',
      role: 'admin',
      status: 'inactive',
      lastActive: '2/25/2025'
    },

  ],
  activityData: [
    { date: 'Feb 19', totalVisits: 7, activeUsers: 4, newUsers: 2 },
    { date: 'Feb 20', totalVisits: 5, activeUsers: 3, newUsers: 1 },
    { date: 'Feb 21', totalVisits: 6, activeUsers: 4, newUsers: 0 },
    { date: 'Feb 22', totalVisits: 6, activeUsers: 3, newUsers: 2 },
    { date: 'Feb 23', totalVisits: 8, activeUsers: 4, newUsers: 1 },
    { date: 'Feb 24', totalVisits: 10, activeUsers: 4, newUsers: 3 },
    { date: 'Feb 25', totalVisits: 4, activeUsers: 3, newUsers: 0 }
  ],
  roles: ['user', 'admin'],
  statuses: ['active', 'inactive']
};