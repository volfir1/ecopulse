import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Wind } from 'lucide-react';
import { Card, CardContent, Box, Typography, Button, useTheme } from '@mui/material';
import YearPicker from '@components/datepicker/YearPicker';

const WindEnergy = () => {
  // Color palette based on #38BDF8
  const colors = {
    primary: '#38BDF8',
    secondary: '#60CAFC',
    tertiary: '#2B8FC0',
    accent: '#93DDFF',
    light: '#E0F4FF',
    background: '#F8FCFF'
  };

  // Generate wind-specific data patterns (more variable than other renewables)
  const generationData = Array.from({ length: 100 }, (_, i) => ({
    date: `2024-${String(i).padStart(2, '0')}`,
    value: 0.4 + Math.sin(i * 0.2) * 0.3 + Math.cos(i * 0.1) * 0.2 + Math.random() * 0.3
  }));

  const windSpeedData = Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    speed: 15 + Math.sin(i * 0.8) * 5 + Math.random() * 3,
    power: 3500 + Math.sin(i * 0.8) * 800 + Math.random() * 500
  }));

  const turbinePerformance = Array.from({ length: 6 }, (_, i) => ({
    turbine: `T${i + 1}`,
    efficiency: 92 + Math.sin(i * 0.7) * 5 + Math.random() * 3,
    output: 2200 + Math.sin(i * 0.6) * 400 + Math.random() * 200
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
          <Wind color={colors.primary} />
          Wind Energy Analytics
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
            Turbine Report
          </Button>
          <Button 
            variant="contained" 
            sx={{ 
              bgcolor: colors.primary,
              '&:hover': { bgcolor: colors.secondary }
            }}
          >
            Download Summary
          </Button>
        </Box>
      </Box>

      <Card sx={{ mb: 3, boxShadow: '0 4px 6px rgba(56, 189, 248, 0.1)' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color={colors.primary}>
            Wind Power Generation
          </Typography>
          <Typography variant="h4" gutterBottom sx={{ color: colors.secondary }}>
            4,800 MWh
          </Typography>
          <Typography variant="body2" sx={{ color: colors.tertiary }} gutterBottom>
            Variable generation forecast
          </Typography>
          <Box sx={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={generationData}>
                <defs>
                  <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
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
                  fill="url(#windGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
        <Card sx={{ boxShadow: '0 4px 6px rgba(56, 189, 248, 0.1)' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color={colors.primary}>
              Wind Speed & Power
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: colors.secondary }}>
              15.8 m/s average
            </Typography>
            <Box sx={{ height: 150 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={windSpeedData}>
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
                    dataKey="speed"
                    name="Wind Speed"
                    stroke={colors.primary}
                    strokeWidth={2}
                    dot={{ fill: colors.primary, stroke: colors.primary }}
                  />
                  <Line
                    type="monotone"
                    dataKey="power"
                    name="Power Output"
                    stroke={colors.accent}
                    strokeWidth={2}
                    dot={{ fill: colors.accent, stroke: colors.accent }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ boxShadow: '0 4px 6px rgba(56, 189, 248, 0.1)' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color={colors.primary}>
              Turbine Performance
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: colors.secondary }}>
              92.5% efficiency rating
            </Typography>
            <Box sx={{ height: 150 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={turbinePerformance}>
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

export default WindEnergy;