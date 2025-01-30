import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Thermometer } from 'lucide-react';
import { Card, CardContent, Box, Typography, Button, useTheme } from '@mui/material';
import YearPicker from 'shared/components/datepicker/YearPicker';

const Geothermal = () => {
  // Color palette based on #FF7F7F with complementary colors
  const colors = {
    primary: '#FF7F7F',
    secondary: '#FF9999',
    tertiary: '#CC6666',
    accent: '#FFB3B3',
    light: '#FFE5E5',
    background: '#FFF9F9'
  };

  // Generate geothermal-specific data patterns (more stable than other renewables)
  const generationData = Array.from({ length: 100 }, (_, i) => ({
    date: `2024-${String(i).padStart(2, '0')}`,
    value: 0.8 + Math.sin(i * 0.08) * 0.1 + Math.random() * 0.1 // Very stable output
  }));

  const temperatureData = Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    surface: 150 + Math.sin(i * 0.5) * 10 + Math.random() * 5,
    deep: 280 + Math.sin(i * 0.3) * 5 + Math.random() * 3
  }));

  const wellPerformance = Array.from({ length: 6 }, (_, i) => ({
    well: `Well-${i + 1}`,
    pressure: 85 + Math.sin(i * 0.7) * 10 + Math.random() * 5,
    output: 2600 + Math.sin(i * 0.6) * 300 + Math.random() * 200
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
          <Thermometer color={colors.primary} />
          Geothermal Energy Analytics
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
            Well Report
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

      <Card sx={{ mb: 3, boxShadow: '0 4px 6px rgba(255, 127, 127, 0.1)' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color={colors.primary}>
            Geothermal Power Generation
          </Typography>
          <Typography variant="h4" gutterBottom sx={{ color: colors.secondary }}>
            6,200 MWh
          </Typography>
          <Typography variant="body2" sx={{ color: colors.tertiary }} gutterBottom>
            Stable baseline generation
          </Typography>
          <Box sx={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={generationData}>
                <defs>
                  <linearGradient id="geothermalGradient" x1="0" y1="0" x2="0" y2="1">
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
                  fill="url(#geothermalGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
        <Card sx={{ boxShadow: '0 4px 6px rgba(255, 127, 127, 0.1)' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color={colors.primary}>
              Temperature Monitoring
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: colors.secondary }}>
              280°C at depth
            </Typography>
            <Box sx={{ height: 150 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={temperatureData}>
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
                    dataKey="surface"
                    name="Surface Temp"
                    stroke={colors.primary}
                    strokeWidth={2}
                    dot={{ fill: colors.primary, stroke: colors.primary }}
                  />
                  <Line
                    type="monotone"
                    dataKey="deep"
                    name="Deep Well Temp"
                    stroke={colors.accent}
                    strokeWidth={2}
                    dot={{ fill: colors.accent, stroke: colors.accent }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ boxShadow: '0 4px 6px rgba(255, 127, 127, 0.1)' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color={colors.primary}>
              Well Performance
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: colors.secondary }}>
              87.5% efficiency rating
            </Typography>
            <Box sx={{ height: 150 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wellPerformance}>
                  <XAxis dataKey="well" stroke={colors.tertiary} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: colors.background,
                      borderColor: colors.light
                    }}
                  />
                  <Bar
                    dataKey="pressure"
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

export default Geothermal;