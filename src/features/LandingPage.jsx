import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { elements, Palette } from "@shared/components/ui/colors";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  BarChart,
  CloudSun,
  Wind,
  Droplets,
  Flower,
  Github,
  Linkedin,
  Activity,
  LineChart,
  PieChart,
} from "lucide-react";

// Import your images
// import hydroImage from '../assets/images/landing/hydro.jpg';
// import solarImage from '../assets/images/landing/solar.jpg';
// import windImage from '../assets/images/landing/wind.webp';
import logo from "../assets/images/logo.png";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import AlterModel from "../assets/Alter";

// const carouselData = [
//   {
//     image: hydroImage,
//     title: "Hydro Power Energy",
//     description: "Hydropower energy uses flowing or falling water to generate electricity, making it one of the most widely used renewable energy sources globally.",
//     details: "In the Philippines, hydropower supplies about 10-12% of the country's electricity. With its abundant rivers and high rainfall, the nation hosts significant projects.",
//     color: elements.hydropower
//   },
//   {
//     image: solarImage,
//     title: "Solar Energy",
//     description: "Solar power harnesses the sun's energy to generate clean electricity, providing a sustainable solution for our growing energy needs.",
//     details: "The Philippines has great potential for solar energy with an average of 5.1 kWh/m² per day of solar radiation.",
//     color: elements.solar
//   },
//   {
//     image: windImage,
//     title: "Wind Power",
//     description: "Wind energy captures the natural power of wind through turbines, converting it into renewable electricity.",
//     details: "The Philippines' wind energy sector is growing, with several wind farms contributing to the national power grid.",
//     color: elements.wind
//   }
// ];

const energyTypes = [
  {
    type: "Solar",
    icon: <CloudSun size={32} />,
    color: elements.solar,
    description: "Harnessing the sun's power for sustainable energy"
  },
  {
    type: "Wind",
    icon: <Wind size={32} />,
    color: elements.wind,
    description: "Converting wind power into clean electricity"
  },
  {
    type: "Geothermal",
    icon: <Flower size={32} />,
    color: elements.geothermal,
    description: "Utilizing Earth's heat for renewable energy"
  },
  {
    type: "Hydropower",
    icon: <Droplets size={32} />,
    color: elements.hydropower,
    description: "Generating power from flowing water"
  },
  {
    type: "Biomass",
    icon: <Flower size={32} />,
    color: elements.biomass,
    description: "Converting organic matter into sustainable energy"
  }
];

const features = [
  {
    icon: <Activity size={32} />,
    title: "Real-time Monitoring",
    description: "Track energy production and consumption with instant updates",
  },
  {
    icon: <LineChart size={32} />,
    title: "Advanced Analytics",
    description: "Detailed insights and performance metrics for optimization",
  },
  {
    icon: <PieChart size={32} />,
    title: "Resource Distribution",
    description: "Efficient allocation and management of energy resources",
  },
];

const teamMembers = [
  {
    name: "John Doe",
    role: "Lead Developer",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    bio: "Expert in renewable energy systems and full-stack development",
  },
  {
    name: "Jane Smith",
    role: "Energy Specialist",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    bio: "Specialized in optimizing renewable energy production",
  },
  {
    name: "Mike Johnson",
    role: "Data Analyst",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    bio: "Focused on energy data analysis and forecasting",
  },
];

const lookAtPositions = [
  [0, 2, 5], // Default target
  [5, 1, 0],
  [-5, 1, 0],
  [-10, 2, 7],
  [-5, 2, 10],
  [5, 2, 10],
  [10, 2, 5],
];

const CameraController = ({ targetIndex }) => {
  useFrame(({ clock, camera }) => {
    // Rotating camera effect
    const t = clock.getElapsedTime();
    camera.position.x = -10 * Math.cos(t * 0.2);
    camera.position.z = -30 * Math.sin(t * 0.2);

    // Set camera target dynamically
    const target = lookAtPositions[targetIndex];
    camera.lookAt(...target);
  });

  return null;
};

const LandingPage = () => {
  const [targetIndex, setTargetIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTargetIndex((prev) => (prev + 1) % lookAtPositions.length);
    }, 12000); // Change target every 7 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <Box sx={{ bgcolor: Palette.background.default }}>
      {/* Navbar */}
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.95)",
          boxShadow: "none",
          borderBottom: "1px solid rgba(0,0,0,0.1)",
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            py={1}
          >
            <Link to="/" style={{ textDecoration: "none" }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  component="img"
                  src={logo}
                  alt="EcoPulse Logo"
                  sx={{
                    height: 50, // Adjust this if needed
                    width: "auto",
                    objectFit: "contain",
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 500,
                    color: Palette.primary.main,
                  }}
                >
                  EcoPulse
                </Typography>
              </Stack>
            </Link>

            <Stack direction="row" spacing={4}>
              <Button sx={{ color: "text.primary" }}>ABOUT</Button>
              <Button sx={{ color: "text.primary" }}>CONTACT</Button>
              <Link to="/login">
                <Button sx={{ color: "text.primary" }}>LOGIN</Button>
              </Link>

              <Button
                variant="contained"
                sx={{
                  bgcolor: Palette.primary.main,
                  borderRadius: 6,
                  px: 3,
                  "&:hover": {
                    bgcolor: Palette.hovers.primary,
                  },
                }}
              >
                SIGN UP
              </Button>
            </Stack>
          </Stack>
        </Container>
      </AppBar>

      {/* Hero Carousel Section */}
      <Box sx={{ position: "relative", height: "100vh" }}>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              bgcolor: "rgba(0,0,0,0.3)",
              zIndex: 1,
            },
          }}
        >
          <img
            // src={carouselData[currentSlide].image}
            // alt={carouselData[currentSlide].title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "all 0.5s ease-in-out",
            }}
          />
        </Box>

        <div className="relative w-full h-screen">
          <Canvas
            className="absolute top-0 left-0 w-full h-full"
            camera={{ position: [20, 2, -100], fov: 10 }}
          >
            <CameraController targetIndex={targetIndex} />
            <ambientLight position={[5, 5, 5]} intensity={1} />
            <directionalLight position={[5, 5, 5]} />
            <OrbitControls/>

            <Suspense fallback={null}>
              <AlterModel />
            </Suspense>
          </Canvas>
        </div>
      </Box>

      {/* Energy Types Section */}
      <Box sx={{ py: 12, bgcolor: "white" }}>
        <Container maxWidth="lg">
          <Stack spacing={8}>
            <Typography
              variant="h3"
              textAlign="center"
              color={Palette.text.primary}
              fontWeight={600}
            >
              Energy Sources We Monitor
            </Typography>
            <Grid container spacing={4}>
              {energyTypes.map((energy, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Stack spacing={3} alignItems="center">
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: "50%",
                            bgcolor: `${energy.color}20`,
                            color: energy.color,
                          }}
                        >
                          {energy.icon}
                        </Box>
                        <Typography
                          variant="h5"
                          fontWeight={600}
                          color={Palette.text.primary}
                        >
                          {energy.type}
                        </Typography>
                        <Typography
                          variant="body1"
                          textAlign="center"
                          color={Palette.text.secondary}
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
      <Box sx={{ py: 12, bgcolor: Palette.background.subtle }}>
        <Container maxWidth="lg">
          <Stack spacing={8}>
            <Typography
              variant="h3"
              textAlign="center"
              color={Palette.primary.main}
              fontWeight={600}
            >
              Key Features
            </Typography>
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Stack spacing={3}>
                        <Box
                          sx={{
                            color: Palette.primary.main,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 64,
                            height: 64,
                            borderRadius: "50%",
                            bgcolor: `${Palette.primary.main}15`,
                          }}
                        >
                          {feature.icon}
                        </Box>
                        <Typography
                          variant="h5"
                          fontWeight={600}
                          color={Palette.text.primary}
                        >
                          {feature.title}
                        </Typography>
                        <Typography
                          variant="body1"
                          color={Palette.text.secondary}
                          sx={{ lineHeight: 1.7 }}
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

      {/* Team Section */}
      <Box sx={{ py: 12, bgcolor: "white" }}>
        <Container maxWidth="lg">
          <Stack spacing={8}>
            <Stack spacing={2} alignItems="center">
              <Typography
                variant="h3"
                textAlign="center"
                color={Palette.text.primary}
                fontWeight={600}
              >
                Meet Our Team
              </Typography>
              <Typography
                variant="h6"
                textAlign="center"
                color={Palette.text.secondary}
                maxWidth="600px"
                sx={{ lineHeight: 1.7 }}
              >
                Expert professionals dedicated to revolutionizing renewable
                energy monitoring and analytics
              </Typography>
            </Stack>

            <Grid container spacing={4}>
              {teamMembers.map((member, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Stack spacing={3} alignItems="center">
                        <Box
                          sx={{
                            width: 120,
                            height: 120,
                            borderRadius: "50%",
                            bgcolor: `${Palette.primary.main}15`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "2rem",
                            color: Palette.primary.main,
                            fontWeight: 600,
                            mb: 2,
                          }}
                        >
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </Box>
                        <Stack spacing={1} alignItems="center">
                          <Typography
                            variant="h5"
                            fontWeight={600}
                            color={Palette.text.primary}
                          >
                            {member.name}
                          </Typography>
                          <Typography
                            variant="body1"
                            color={Palette.primary.main}
                            fontWeight={500}
                          >
                            {member.role}
                          </Typography>
                        </Stack>
                        <Typography
                          variant="body2"
                          textAlign="center"
                          color={Palette.text.secondary}
                          sx={{ lineHeight: 1.7 }}
                        >
                          {member.bio}
                        </Typography>
                        <Stack direction="row" spacing={2}>
                          <IconButton
                            component="a"
                            href={member.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              color: Palette.text.secondary,
                              "&:hover": { color: Palette.primary.main },
                            }}
                          >
                            <Github size={20} />
                          </IconButton>
                          <IconButton
                            component="a"
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              color: Palette.text.secondary,
                              "&:hover": { color: Palette.primary.main },
                            }}
                          >
                            <Linkedin size={20} />
                          </IconButton>
                        </Stack>
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
