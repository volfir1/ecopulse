  import React from 'react';
  import { LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, AreaChart, Area, ResponsiveContainer } from 'recharts';
  import { Sun } from 'lucide-react';
  import { Card, CardContent, Box, Typography, Button } from '@mui/material';
  import YearPicker from 'shared/components/datepicker/YearPicker';

  const SolarEnergy = () => {
    // Color palette based on warm solar colors
    const colors = {
      primary: '#F59E0B',
      secondary: '#FBBF24',
      tertiary: '#D97706',
      accent: '#FCD34D',
      light: '#FEF3C7',
      background: '#FFFBEB'
    };

    // Generate solar-specific data patterns (more regular than wind, with clear day/night cycles)
    const generationData = Array.from({ length: 100 }, (_, i) => ({
      date: `2024-${String(i).padStart(2, '0')}`,
      value: 0.8 * Math.sin((i % 24) * Math.PI / 12) + 0.2 + Math.random() * 0.2
    })).filter(d => d.value > 0);

    const solarIrradianceData = Array.from({ length: 7 }, (_, i) => ({
      day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      irradiance: 800 + Math.sin(i * 0.8) * 200 + Math.random() * 100,
      power: 4200 + Math.sin(i * 0.8) * 800 + Math.random() * 400
    }));

    const panelPerformance = Array.from({ length: 6 }, (_, i) => ({
      array: `A${i + 1}`,
      efficiency: 95 + Math.sin(i * 0.5) * 3 + Math.random() * 2,
      output: 2500 + Math.sin(i * 0.5) * 300 + Math.random() * 200
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
            <Sun color={colors.primary} />
            Solar Energy Analytics
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
              Panel Report
            </Button>
            <Button 
              variant="contained" 
              sx={{ 
                bgcolor: colors.primary,
                '&:hover': { bgcolor: colors.secondary },
                color: 'white'
              }}
            >
              Download Summary
            </Button>
          </Box>
        </Box>

        <Card sx={{ mb: 3, boxShadow: '0 4px 6px rgba(245, 158, 11, 0.1)' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color={colors.primary}>
              Solar Power Generation
            </Typography>
            <Typography variant="h4" gutterBottom sx={{ color: colors.secondary }}>
              5,200 kWh
            </Typography>
            <Typography variant="body2" sx={{ color: colors.tertiary }} gutterBottom>
              Peak sunlight generation forecast
            </Typography>
            <Box sx={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={generationData}>
                  <defs>
                    <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
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
                    fill="url(#solarGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
          <Card sx={{ boxShadow: '0 4px 6px rgba(245, 158, 11, 0.1)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color={colors.primary}>
                Solar Irradiance & Power
              </Typography>
              <Typography variant="h5" gutterBottom sx={{ color: colors.secondary }}>
                850 W/m² average
              </Typography>
              <Box sx={{ height: 150 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={solarIrradianceData}>
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
                      dataKey="irradiance"
                      name="Solar Irradiance"
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

          <Card sx={{ boxShadow: '0 4px 6px rgba(245, 158, 11, 0.1)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color={colors.primary}>
                Panel Array Performance
              </Typography>
              <Typography variant="h5" gutterBottom sx={{ color: colors.secondary }}>
                95.2% efficiency rating
              </Typography>
              <Box sx={{ height: 150 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={panelPerformance}>
                    <XAxis dataKey="array" stroke={colors.tertiary} />
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

  export default SolarEnergy;