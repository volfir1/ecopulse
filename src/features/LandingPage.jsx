  // LandingPage.jsx
  import React from "react";
  import { Link } from "react-router-dom";
  import { 
    Box, 
    Container, 
    Stack, 
    Typography, 
    Button, 
    Card, 
    CardContent, 
    Grid, 
    IconButton, 
    AppBar 
  } from "@mui/material";
  import { 
    CloudSun, 
    Wind, 
    Flower, 
    Droplets, 
    Github, 
    Linkedin, 
    Activity, 
    LineChart, 
    PieChart, 
    BarChart, 
    Users 
  } from "lucide-react";
  import { Canvas, useFrame } from "@react-three/fiber";
  import { OrbitControls } from "@react-three/drei";
  import { Suspense } from "react";
  import AlterModel from "../assets/Alter";
  import { useCameraTarget, useEnergySelection,usePageNavigation,useModelAnimation } from "./landingHooks";
  import { landingPageStyles } from "./landingStyles";
  import { energyTypes } from "./landingFuntions";
  import CameraController from "./CameraController";
  import InteractiveModel from "./InteractiveModel";
  // Temporary logo placeholder - replace with your actual logo path
  const logoPlaceholder = "EP";

  // Features array
  const features = [
    {
      icon: <Activity size={32} />,
      title: "Real-time Monitoring",
      description: "Track energy production and consumption patterns with instant updates and alerts for optimal performance."
    },
    {
      icon: <LineChart size={32} />,
      title: "Advanced Analytics",
      description: "Leverage sophisticated data analysis tools to gain insights into your energy usage and identify optimization opportunities."
    },
    {
      icon: <BarChart size={32} />,
      title: "Performance Metrics",
      description: "Monitor key performance indicators and track progress towards your sustainability goals."
    },
    {
      icon: <Users size={32} />,
      title: "Team Collaboration",
      description: "Enable seamless collaboration among team members with shared dashboards and reports."
    }
  ];

  // Team members array
  const teamMembers = [
    {
      name: "Dr. Sarah Chen",
      role: "Lead Energy Scientist",
      bio: "Expert in renewable energy systems with 10+ years of research experience",
      github: "https://github.com",
      linkedin: "https://linkedin.com"
    },
    {
      name: "Michael Rodriguez",
      role: "Senior Developer",
      bio: "Full-stack developer specializing in real-time monitoring systems",
      github: "https://github.com",
      linkedin: "https://linkedin.com"
    },
    {
      name: "Emma Wilson",
      role: "Data Analyst",
      bio: "Specialist in energy data analysis and predictive modeling",
      github: "https://github.com",
      linkedin: "https://linkedin.com"
    }
  ];

  const LandingPage = () => {
    const { targetIndex, currentTarget } = useCameraTarget();  
    const { 
      selectedEnergy, 
      isAnimating, 
      handleEnergySelect, 
      resetSelection,
      setIsAnimating  // Add this
    } = useEnergySelection();
    const handleNavigation = usePageNavigation();
    const { animationState, startAnimation, stopAnimation } = useModelAnimation();
  
    const handleModelClick = (energyType) => {
      handleEnergySelect(energyType);
      startAnimation();
    };
  
    const handleAnimationComplete = () => {
      stopAnimation();
      setIsAnimating(false);
    };
    
    return (
      <Box sx={landingPageStyles.mainContainer}>
        {/* Navbar Section */}
        <AppBar position="fixed" sx={landingPageStyles.navbar.appBar}>
          <Container maxWidth="lg">
            <Stack direction="row" justifyContent="space-between" alignItems="center" py={1}>
              <Link to="/" style={{ textDecoration: "none" }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Typography variant="h5" sx={landingPageStyles.navbar.title}>
                    {logoPlaceholder}
                  </Typography>
                  <Typography sx={landingPageStyles.navbar.title}>
                    EcoPulse
                  </Typography>
                </Stack>
              </Link>

              <Stack direction="row" spacing={4}>
                <Button sx={landingPageStyles.navbar.button}>ABOUT</Button>
                <Button sx={landingPageStyles.navbar.button}>CONTACT</Button>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <Button sx={landingPageStyles.navbar.button}>LOGIN</Button>
                </Link>
                <Link to="/signup" style={{ textDecoration: 'none' }}>
                  <Button sx={landingPageStyles.navbar.signUpButton}>
                    SIGN UP
                  </Button>
                </Link>
              </Stack>
            </Stack>
          </Container>
        </AppBar>

        {/* Hero Section with 3D Model */}
        <Box sx={landingPageStyles.hero.container}>
          <div className="relative w-full h-screen">
            <Canvas camera={{ position: [20, 2, -100], fov: 45 }}>
              <CameraController 
                selectedEnergy={selectedEnergy}
                isAnimating={isAnimating}
                onAnimationComplete={handleAnimationComplete}
              />
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              <OrbitControls enabled={!isAnimating} />
              
              <Suspense fallback={null}>
                <InteractiveModel 
                  selectedEnergy={selectedEnergy}
                  onEnergySelect={handleModelClick}
                />
              </Suspense>
            </Canvas>
          </div>
        </Box>

        {/* Energy Types Section */}
        <Box sx={landingPageStyles.energyTypes.section}>
          <Container maxWidth="lg">
            <Stack spacing={8}>
              <Stack spacing={2} alignItems="center">
                <Typography sx={landingPageStyles.energyTypes.title}>
                  Energy Sources We Monitor
                </Typography>
                <Typography sx={landingPageStyles.energyTypes.subtitle}>
                  Comprehensive monitoring and analysis of various renewable energy sources
                </Typography>
              </Stack>
              <Grid container spacing={4}>
                {energyTypes.map((energy, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card 
                      sx={landingPageStyles.energyTypes.card}
                      onClick={() => handleEnergySelect(energy.type)}
                    >
                      <CardContent sx={{ p: 4 }}>
                        <Stack spacing={3} alignItems="center">
                          <Box sx={landingPageStyles.energyTypes.iconContainer(energy.color)}>
                            {energy.icon}
                          </Box>
                          <Typography sx={landingPageStyles.energyTypes.typeTitle}>
                            {energy.type}
                          </Typography>
                          <Typography sx={landingPageStyles.energyTypes.description}>
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
        <Box sx={landingPageStyles.features.section}>
          <Container maxWidth="lg">
            <Stack spacing={8}>
              <Stack spacing={2} alignItems="center">
                <Typography sx={landingPageStyles.features.title}>
                  Key Features
                </Typography>
                <Typography sx={landingPageStyles.features.subtitle}>
                  Powerful tools to monitor and optimize your renewable energy systems
                </Typography>
              </Stack>
              <Grid container spacing={4}>
                {features.map((feature, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card sx={landingPageStyles.features.card}>
                      <CardContent sx={{ p: 4 }}>
                        <Stack spacing={3} alignItems="center">
                          <Box sx={landingPageStyles.features.iconContainer}>
                            {feature.icon}
                          </Box>
                          <Typography sx={landingPageStyles.features.featureTitle}>
                            {feature.title}
                          </Typography>
                          <Typography sx={landingPageStyles.features.description}>
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
        <Box sx={landingPageStyles.team.section}>
          <Container maxWidth="lg">
            <Stack spacing={8}>
              <Stack spacing={2} alignItems="center">
                <Typography sx={landingPageStyles.team.title}>
                  Meet Our Team
                </Typography>
                <Typography sx={landingPageStyles.team.subtitle}>
                  Expert professionals dedicated to revolutionizing renewable energy monitoring
                </Typography>
              </Stack>
              <Grid container spacing={4}>
                {teamMembers.map((member, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card sx={landingPageStyles.team.card}>
                      <CardContent sx={{ p: 4 }}>
                        <Stack spacing={3} alignItems="center">
                          <Box sx={landingPageStyles.team.avatarContainer}>
                            {member.name.split(" ").map(n => n[0]).join("")}
                          </Box>
                          <Stack spacing={1} alignItems="center">
                            <Typography sx={landingPageStyles.team.memberName}>
                              {member.name}
                            </Typography>
                            <Typography sx={landingPageStyles.team.memberRole}>
                              {member.role}
                            </Typography>
                          </Stack>
                          <Typography sx={landingPageStyles.team.memberBio}>
                            {member.bio}
                          </Typography>
                          <Stack direction="row" spacing={2}>
                            <IconButton
                              component="a"
                              href={member.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={landingPageStyles.team.socialButton}
                            >
                              <Github size={20} />
                            </IconButton>
                            <IconButton
                              component="a"
                              href={member.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={landingPageStyles.team.socialButton}
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

  // Camera controller component




  export default LandingPage;