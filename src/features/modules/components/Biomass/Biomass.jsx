import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Leaf } from 'lucide-react';
import { Card, CardContent, Box, Typography, Button, useTheme } from '@mui/material';
import YearPicker from 'shared/components/datepicker/YearPicker';

const Biomass = () => {
  // Color palette based on #166545
  const colors = {
    primary: '#166545',
    secondary: '#2A8A63',
    tertiary: '#0D4A30',
    accent: '#65A684',
    light: '#C5E1D1',
    background: '#F7FAF8'
  };

  // Generate biomass-appropriate data patterns
  const generationData = Array.from({ length: 100 }, (_, i) => ({
    date: `2024-${String(i).padStart(2, '0')}`,
    value: 0.6 + Math.sin(i * 0.15) * 0.2 + Math.cos(i * 0.1) * 0.15 + Math.random() * 0.15
  }));

  const feedstockData = Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    agricultural: 2800 + Math.sin(i * 0.8) * 500 + Math.random() * 300,
    forestry: 2200 + Math.cos(i * 0.8) * 400 + Math.random() * 250
  }));

  const efficiencyData = Array.from({ length: 6 }, (_, i) => ({
    source: ['Wood', 'Crop', 'Waste', 'Biogas', 'Pellets', 'Other'][i],
    efficiency: 75 + Math.sin(i * 0.7) * 15 + Math.random() * 10,
    output: 2400 + Math.sin(i * 0.6) * 500 + Math.random() * 300
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
          <Leaf color={colors.primary} />
          Biomass Energy Analytics
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
            Feedstock Report
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

      <Card sx={{ mb: 3, boxShadow: '0 4px 6px rgba(22, 101, 69, 0.1)' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color={colors.primary}>
            Biomass Power Generation
          </Typography>
          <Typography variant="h4" gutterBottom sx={{ color: colors.secondary }}>
            3,800 MWh
          </Typography>
          <Typography variant="body2" sx={{ color: colors.tertiary }} gutterBottom>
            Current month projection
          </Typography>
          <Box sx={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={generationData}>
                <defs>
                  <linearGradient id="biomassGradient" x1="0" y1="0" x2="0" y2="1">
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
                  fill="url(#biomassGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
        <Card sx={{ boxShadow: '0 4px 6px rgba(22, 101, 69, 0.1)' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color={colors.primary}>
              Feedstock Consumption
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: colors.secondary }}>
              5,200 tons monthly
            </Typography>
            <Box sx={{ height: 150 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={feedstockData}>
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
                    dataKey="agricultural"
                    name="Agricultural"
                    stroke={colors.primary}
                    strokeWidth={2}
                    dot={{ fill: colors.primary, stroke: colors.primary }}
                  />
                  <Line
                    type="monotone"
                    dataKey="forestry"
                    name="Forestry"
                    stroke={colors.accent}
                    strokeWidth={2}
                    dot={{ fill: colors.accent, stroke: colors.accent }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ boxShadow: '0 4px 6px rgba(22, 101, 69, 0.1)' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color={colors.primary}>
              Source Efficiency
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: colors.secondary }}>
              82.3% conversion rate
            </Typography>
            <Box sx={{ height: 150 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={efficiencyData}>
                  <XAxis dataKey="source" stroke={colors.tertiary} />
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

export default Biomass;