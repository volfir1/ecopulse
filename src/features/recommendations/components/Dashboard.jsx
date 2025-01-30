import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  useTheme,
  alpha,
  Grid,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Download,
  Save,
  TrendingUp,
  Sun,
  Wind,
  Droplets,
  Battery,
  LineChart,
  Info,
  MapPin
} from 'lucide-react';

const EnergyRecommendations = () => {
  const theme = useTheme();

  // Mock data - replace with real data
  const cityData = {
    city: "Taguig City",
    period: "2024-2026 Analysis",
    budget: "₱300000",
    year: "2025",
    location: {
      coordinates: "14.5176° N, 121.0509° E",
      solarPotential: "High",
      windPotential: "Moderate",
      hydroPotential: "Available (Nearby Rivers)"
    }
  };

  const projections = [
    {
      year: 2024,
      title: "Add 500 kWh solar capacity",
      progress: 30,
      details: [
        "Install rooftop solar panels",
        "Set up monitoring systems",
        "Train maintenance staff"
      ]
    },
    {
      year: 2025,
      title: "Implement hydro connection",
      progress: 60,
      details: [
        "Connect to local water system",
        "Install micro-hydro generators",
        "Upgrade grid infrastructure"
      ]
    },
    {
      year: 2026,
      title: "Smart grid integration",
      progress: 90,
      details: [
        "Deploy smart meters",
        "Implement AI-based management",
        "Enable demand response"
      ]
    }
  ];

  const costBenefits = [
    {
      label: "Initial Investment",
      value: "₱15M",
      icon: <Battery size={20} />,
      description: "Total upfront costs including equipment and installation"
    },
    {
      label: "ROI Timeline",
      value: "3.5 years",
      icon: <TrendingUp size={20} />,
      description: "Expected period to recover investment through savings"
    },
    {
      label: "Monthly Savings",
      value: "₱350,000",
      icon: <LineChart size={20} />,
      description: "Projected monthly reduction in energy costs"
    },
    {
      label: "Gov't Incentives",
      value: "₱2.5M",
      icon: <Sun size={20} />,
      description: "Available government subsidies and tax benefits"
    }
  ];

  const energyPotential = [
    {
      type: "Solar",
      potential: "High",
      icon: <Sun size={24} />,
      color: theme.palette.warning.main,
      details: "Average 5.5 kWh/m²/day"
    },
    {
      type: "Wind",
      potential: "Moderate",
      icon: <Wind size={24} />,
      color: theme.palette.info.main,
      details: "Average speed 12 km/h"
    },
    {
      type: "Hydro",
      potential: "Available",
      icon: <Droplets size={24} />,
      color: theme.palette.primary.main,
      details: "2 viable water sources"
    }
  ];

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        mb: 4 
      }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Energy Recommendations
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle1" color="text.secondary">
              {cityData.city} • {cityData.period}
            </Typography>
            <Tooltip title={cityData.location.coordinates}>
              <IconButton size="small">
                <MapPin size={16} />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
            <Chip 
              label={`Budget: ${cityData.budget}`}
              size="small"
              color="primary"
              variant="outlined"
            />
            <Chip 
              label={`Year: ${cityData.year}`}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            startIcon={<Save size={18} />}
            variant="outlined"
            color="primary"
            sx={{ borderRadius: 2 }}
          >
            Save Report
          </Button>
          <Button
            startIcon={<Download size={18} />}
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2 }}
          >
            Download PDF
          </Button>
        </Box>
      </Box>

      {/* Energy Potential Cards */}
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Renewable Energy Potential
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {energyPotential.map((energy) => (
          <Grid item xs={12} md={4} key={energy.type}>
            <Card sx={{ 
              height: '100%',
              borderRadius: 3,
              boxShadow: `0 0 20px ${alpha(theme.palette.common.black, 0.05)}`,
              '&:hover': {
                boxShadow: `0 0 25px ${alpha(theme.palette.common.black, 0.1)}`,
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: 2, 
                    backgroundColor: alpha(energy.color, 0.1),
                    color: energy.color
                  }}>
                    {energy.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {energy.type}
                    </Typography>
                    <Typography color="text.secondary">
                      Potential: {energy.potential}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2">
                  {energy.details}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Future Projections */}
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Future Projections (2024-2026)
      </Typography>
      <Card sx={{ 
        mb: 4, 
        borderRadius: 3,
        boxShadow: `0 0 20px ${alpha(theme.palette.common.black, 0.05)}`
      }}>
        <CardContent>
          <Grid container spacing={4}>
            {projections.map((proj) => (
              <Grid item xs={12} md={4} key={proj.year}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight={600}>
                    {proj.year}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    {proj.title}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={proj.progress}
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      mb: 2
                    }} 
                  />
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    {proj.details.map((detail, index) => (
                      <Typography 
                        component="li" 
                        variant="body2" 
                        color="text.secondary"
                        key={index}
                        sx={{ mb: 0.5 }}
                      >
                        {detail}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Cost-Benefit Analysis */}
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Cost-Benefit Analysis
      </Typography>
      <Grid container spacing={3}>
        {costBenefits.map((item) => (
          <Grid item xs={12} md={3} key={item.label}>
            <Card sx={{ 
              height: '100%',
              borderRadius: 3,
              boxShadow: `0 0 20px ${alpha(theme.palette.common.black, 0.05)}`,
              '&:hover': {
                boxShadow: `0 0 25px ${alpha(theme.palette.common.black, 0.1)}`,
              }
            }}>
              <CardContent>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  mb: 1
                }}>
                  {item.icon}
                  <Typography color="text.secondary">
                    {item.label}
                  </Typography>
                  <Tooltip title={item.description}>
                    <Info size={16} style={{ cursor: 'help' }} />
                  </Tooltip>
                </Box>
                <Typography variant="h5" fontWeight={600}>
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default EnergyRecommendations;