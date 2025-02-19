import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {theme} from '@shared/index'
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  Stack,
  Typography
} from '@mui/material';
import { 
  ChevronLeft, 
  ChevronRight,
  ArrowRight,
  CloudSun,
  Wind,
  Flower,
  Droplets,
  Github,
  Linkedin,
  Activity,
  LineChart,
  PieChart
} from 'lucide-react';

import logo from '../assets/images/logo.png';
// Data arrays
const carouselData = [
  {
    image: '/assets/images/landing/hydro.jpg',
    title: "Hydro Power Energy",
    description: "Hydropower energy uses flowing or falling water to generate electricity, making it one of the most widely used renewable energy sources globally.",
    details: "In the Philippines, hydropower supplies about 10-12% of the country's electricity. With its abundant rivers and high rainfall, the nation hosts significant projects.",
    color: theme.palette.elements.hydropower
  },
  {
    image: '/assets/images/landing/solar.jpg',
    title: "Solar Energy",
    description: "Solar power harnesses the sun's energy to generate clean electricity, providing a sustainable solution for our growing energy needs.",
    details: "The Philippines has great potential for solar energy with an average of 5.1 kWh/m² per day of solar radiation.",
    color: theme.palette.elements.solar
  },
  {
    image: '/assets/images/landing/wind.webp',
    title: "Wind Power",
    description: "Wind energy captures the natural power of wind through turbines, converting it into renewable electricity.",
    details: "The Philippines' wind energy sector is growing, with several wind farms contributing to the national power grid.",
    color: theme.palette.elements.wind
  }
];

const energyTypes = [
  {
    type: "Solar",
    icon: <CloudSun size={32} />,
    color: theme.palette.elements.solar,
    description: "Harnessing the sun's power for sustainable energy"
  },
  {
    type: "Wind",
    icon: <Wind size={32} />,
    color: theme.palette.elements.wind,
    description: "Converting wind power into clean electricity"
  },
  {
    type: "Geothermal",
    icon: <Flower size={32} />,
    color: theme.palette.elements.geothermal,
    description: "Utilizing Earth's heat for renewable energy"
  },
  {
    type: "Hydropower",
    icon: <Droplets size={32} />,
    color: theme.palette.elements.hydropower,
    description: "Generating power from flowing water"
  },
  {
    type: "Biomass",
    icon: <Flower size={32} />,
    color: theme.palette.elements.biomass,
    description: "Converting organic matter into sustainable energy"
  }
];

const features = [
  {
    icon: <Activity size={32} />,
    title: "Real-time Monitoring",
    description: "Track energy production and consumption with instant updates"
  },
  {
    icon: <LineChart size={32} />,
    title: "Advanced Analytics",
    description: "Detailed insights and performance metrics for optimization"
  },
  {
    icon: <PieChart size={32} />,
    title: "Resource Distribution",
    description: "Efficient allocation and management of energy resources"
  }
];

const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ bgcolor: theme.palette.background.default }}>
      {/* Navbar */}
      <Box 
        component="nav" 
        sx={{ 
          position: 'fixed',
          width: '100%',
          zIndex: 1000,
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          borderBottom: `1px solid ${theme.palette.text.disabled}`,
          py: 2
        }}
      >
        <Container maxWidth="lg">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box 
                  component="img"
                  src={logo}
                  alt="Logo"
                  sx={{ height: 40 }}
                />
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: theme.palette.primary.main,
                    fontWeight: 500
                  }}
                >
                  EcoPulse
                </Typography>
              </Stack>
            </Link>
            
            <Stack direction="row" spacing={3}>
              <Button sx={{ color: theme.palette.text.primary }}>About</Button>
              <Button sx={{ color: theme.palette.text.primary }}>Contact</Button>
              <Button 
                variant="contained"
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.text,
                  '&:hover': {
                    bgcolor: theme.palette.hovers.primary
                  }
                }}
              >
                Get Started
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box 
        sx={{ 
          position: 'relative',
          height: '100vh',
          overflow: 'hidden'
        }}
      >
        {/* Hero Background */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0,0,0,0.4)',
              zIndex: 1
            }
          }}
        >
          <Box
            component="img"
            src={carouselData[currentSlide].image}
            alt={carouselData[currentSlide].title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'all 0.5s ease-in-out'
            }}
          />
        </Box>

        {/* Hero Content */}
        <Container 
          sx={{ 
            position: 'relative',
            zIndex: 2,
            height: '100%',
            pt: 16,
            pb: 8
          }}
        >
          <Grid 
            container 
            spacing={6}
            sx={{ 
              height: '100%',
              alignItems: 'center'
            }}
          >
            <Grid item xs={12} md={6}>
              <Stack spacing={4}>
                <Typography 
                  variant="h1"
                  sx={{
                    color: '#fff',
                    fontSize: { xs: '3rem', md: '4.5rem' },
                    fontWeight: 600,
                    lineHeight: 1.2
                  }}
                >
                  {carouselData[currentSlide].title}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: 'rgba(255,255,255,0.9)',
                    maxWidth: 600
                  }}
                >
                  {carouselData[currentSlide].description}
                </Typography>
                <Button
                  variant="contained"
                  endIcon={<ArrowRight />}
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.text,
                    width: 'fit-content',
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: theme.palette.hovers.primary
                    }
                  }}
                >
                  Learn More
                </Button>
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.98)',
                  borderRadius: 4,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Stack spacing={3}>
                    <Typography 
                      variant="h3"
                      sx={{
                        color: carouselData[currentSlide].color,
                        fontWeight: 600
                      }}
                    >
                      {carouselData[currentSlide].title}
                    </Typography>
                    <Typography 
                      variant="body1"
                      sx={{
                        color: theme.palette.text.primary,
                        fontSize: '1.1rem',
                        lineHeight: 1.7
                      }}
                    >
                      {carouselData[currentSlide].details}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>

        {/* Carousel Navigation */}
        <Stack 
          direction="row" 
          spacing={2}
          sx={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2
          }}
        >
          {carouselData.map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentSlide(index)}
              sx={{
                width: currentSlide === index ? 24 : 8,
                height: 8,
                borderRadius: 4,
                bgcolor: currentSlide === index 
                  ? theme.palette.primary.main 
                  : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: currentSlide === index 
                    ? theme.palette.primary.main 
                    : 'rgba(255,255,255,0.8)'
                }
              }}
            />
          ))}
        </Stack>

        {/* Carousel Controls */}
        <IconButton
          onClick={() => setCurrentSlide((prev) => 
            (prev - 1 + carouselData.length) % carouselData.length
          )}
          sx={{
            position: 'absolute',
            left: { xs: 8, md: 24 },
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#fff',
            bgcolor: 'rgba(255,255,255,0.1)',
            zIndex: 2,
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.2)'
            }
          }}
        >
          <ChevronLeft />
        </IconButton>
        <IconButton
          onClick={() => setCurrentSlide((prev) => 
            (prev + 1) % carouselData.length
          )}
          sx={{
            position: 'absolute',
            right: { xs: 8, md: 24 },
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#fff',
            bgcolor: 'rgba(255,255,255,0.1)',
            zIndex: 2,
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.2)'
            }
          }}
        >
          <ChevronRight />
        </IconButton>
      </Box>

      {/* Energy Types Section */}
      <Box sx={{ py: 12, bgcolor: '#fff' }}>
        <Container>
          <Stack spacing={8}>
            <Typography 
              variant="h3"
              align="center"
              sx={{
                color: theme.palette.text.primary,
                fontWeight: 600
              }}
            >
              Energy Sources We Monitor
            </Typography>
            
            <Grid container spacing={4}>
              {energyTypes.map((energy, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Stack spacing={3} alignItems="center">
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: '50%',
                            bgcolor: `${energy.color}20`,
                            color: energy.color
                          }}
                        >
                          {energy.icon}
                        </Box>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.text.primary
                          }}
                        >
                          {energy.type}
                        </Typography>
                        <Typography
                          variant="body1"
                          align="center"
                          sx={{
                            color: theme.palette.text.secondary
                          }}
                        >
                          {energy.description}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 12, bgcolor: theme.palette.background.subtle }}>
        <Container>
          <Stack spacing={8}>
            <Typography
              variant="h3"
              align="center"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 600
              }}
            >
              Key Features
            </Typography>
            
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Stack spacing={3}>
                        <Box
                          sx={{
                            color: theme.palette.primary.main,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            bgcolor: `${theme.palette.primary.main}15`,
                          }}
                        >
                          {feature.icon}
                        </Box>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.text.primary
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: theme.palette.text.secondary,
                            lineHeight: 1.7
                          }}
                        >
                          {feature.description}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;