import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Droplets } from 'lucide-react';
import { Card, CardContent, Box, Typography, Button, useTheme } from '@mui/material';
import YearPicker from '@components/datepicker/YearPicker';


const HydroPower = () => {
  // Color palette based on 1C556F
  const colors = {
    primary: '#1C556F',
    secondary: '#2D7DA0',
    tertiary: '#134B66',
    accent: '#68A5C1',
    light: '#B7D4E2',
    background: '#F5F9FB'
  };

  // Generate realistic hydro data with seasonal patterns
  const generationData = Array.from({ length: 100 }, (_, i) => ({
    date: `2024-${String(i).padStart(2, '0')}`,
    value: 0.5 + Math.sin(i * 0.1) * 0.3 + Math.cos(i * 0.05) * 0.2 + Math.random() * 0.2
  }));

  const waterFlowData = Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    flow: 4200 + Math.sin(i * 0.8) * 800 + Math.random() * 400,
    generation: 3800 + Math.sin(i * 0.8) * 600 + Math.random() * 300
  }));

  const turbineEfficiency = Array.from({ length: 8 }, (_, i) => ({
    turbine: `T${i + 1}`,
    efficiency: 85 + Math.sin(i * 0.5) * 10 + Math.random() * 5,
    output: 2800 + Math.sin(i * 0.7) * 400 + Math.random() * 200
  }));

  return (
    <Box sx={{ p: 3, bgcolor: colors.background }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          color: colors.primary 
        }}>
          <Droplets color={colors.primary} />
          Hydropower Energy Dashboard
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <YearPicker />
          <Button 
            variant="outlined" 
            sx={{ 
              borderColor: colors.primary,
              color: colors.primary,
              '&:hover': { borderColor: colors.secondary }
            }}
          >
            Export Data
          </Button>
          <Button 
            variant="contained" 
            sx={{ 
              bgcolor: colors.primary,
              '&:hover': { bgcolor: colors.secondary }
            }}
          >
            Generate Report
          </Button>
        </Box>
      </Box>

      <Card sx={{ mb: 3, boxShadow: '0 4px 6px rgba(28, 85, 111, 0.1)' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color={colors.primary}>
            Power Generation Forecast
          </Typography>
          <Typography variant="h4" gutterBottom sx={{ color: colors.secondary }}>
            5,200 MWh
          </Typography>
          <Typography variant="body2" sx={{ color: colors.tertiary }} gutterBottom>
            Projected for next 30 days
          </Typography>
          <Box sx={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={generationData}>
                <defs>
                  <linearGradient id="hydroGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={colors.primary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: colors.background,
                    borderColor: colors.light
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={colors.primary}
                  fill="url(#hydroGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
        <Card sx={{ boxShadow: '0 4px 6px rgba(28, 85, 111, 0.1)' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color={colors.primary}>
              Water Flow & Generation
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: colors.secondary }}>
              4,100 m³/s average flow
            </Typography>
            <Box sx={{ height: 150 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={waterFlowData}>
                  <XAxis dataKey="day" stroke={colors.tertiary} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: colors.background,
                      borderColor: colors.light
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="flow"
                    stroke={colors.primary}
                    strokeWidth={2}
                    dot={{ fill: colors.primary, stroke: colors.primary }}
                  />
                  <Line
                    type="monotone"
                    dataKey="generation"
                    stroke={colors.accent}
                    strokeWidth={2}
                    dot={{ fill: colors.accent, stroke: colors.accent }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ boxShadow: '0 4px 6px rgba(28, 85, 111, 0.1)' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color={colors.primary}>
              Turbine Performance
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: colors.secondary }}>
              89.4% average efficiency
            </Typography>
            <Box sx={{ height: 150 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={turbineEfficiency}>
                  <XAxis dataKey="turbine" stroke={colors.tertiary} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: colors.background,
                      borderColor: colors.light
                    }}
                  />
                  <Bar
                    dataKey="efficiency"
                    fill={colors.primary}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>    
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default HydroPower;