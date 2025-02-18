import React from 'react';
import { Card, theme, AppIcon } from '@shared/index';
import { IconButton } from '@mui/material';
import { 
  ResponsiveContainer, 
  LineChart, 
  CartesianGrid, 
  XAxis, 
  YAxis,
  Line,
  Tooltip
} from 'recharts';
import { overviewData, recentActivities, performanceMetrics } from './data';

const AdminDashboard = () => {
  const { primary, success, warning, text, background } = theme.palette;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, Administrator</p>
        </div>
        <div className="flex gap-2">
          <IconButton className="hover:bg-gray-100">
            <AppIcon name="notifications" size={20} />
          </IconButton>
          <IconButton className="hover:bg-gray-100">
            <AppIcon name="settings" size={20} />
          </IconButton>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {Object.entries(overviewData).map(([key, data]) => (
          <Card.Base 
            key={key}
            className="hover:shadow-lg transition-all duration-300"
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${data.color}15` }}>
                  <AppIcon name={data.icon} size={24} style={{ color: data.color }} />
                </div>
                <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {data.trend}
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-1">{data.count}</h3>
              <p className="text-gray-600 text-sm">{data.period}</p>
            </div>
          </Card.Base>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <Card.Base className="md:col-span-2">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Weekly Generation</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceMetrics.weeklyGeneration}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="solar" 
                  stroke={warning.main} 
                  strokeWidth={2} 
                />
                <Line 
                  type="monotone" 
                  dataKey="wind" 
                  stroke={primary.main} 
                  strokeWidth={2} 
                />
                <Line 
                  type="monotone" 
                  dataKey="hydro" 
                  stroke={success.main} 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card.Base>

        {/* Recent Activities */}
        <Card.Base className="md:col-span-1">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="p-2 rounded-full bg-gray-100">
                    <AppIcon 
                      name={getActivityIcon(activity.type)} 
                      size={16} 
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{activity.title}</h4>
                    <p className="text-sm text-gray-600">{activity.details}</p>
                    <span className="text-xs text-gray-500">{activity.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card.Base>
      </div>
    </div>
  );
};

// Helper function for activity icons
const getActivityIcon = (type) => {
  switch (type) {
    case 'project': return 'folder';
    case 'report': return 'file-text';
    case 'alert': return 'alert-circle';
    default: return 'circle';
  }
};

export default AdminDashboard;