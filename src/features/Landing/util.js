import { 
    CloudSun, 
    Wind,
    Flower,
    Droplets,
    Activity,
    LineChart,
    PieChart,
    Users,
    MessageCircle,
    Zap,
    BarChart4,
    Cpu,
    AlertCircle
  } from 'lucide-react';
  
  /**
   * Data for carousel slides
   */
  export const carouselData = [
    {
      image: '/public/carousel/hydro.jpg',
      title: "Hydro Power Energy",
      description: "Hydropower energy uses flowing or falling water to generate electricity, making it one of the most widely used renewable energy sources globally.",
      details: "In the Philippines, hydropower supplies about 10-12% of the country's electricity. With its abundant rivers and high rainfall, the nation hosts significant projects.",
      color: '#3498db'
    },
    {
      image: '/public/carousel/solar.jpg',
      title: "Solar Energy",
      description: "Solar power harnesses the sun's energy to generate clean electricity, providing a sustainable solution for our growing energy needs.",
      details: "The Philippines has great potential for solar energy with an average of 5.1 kWh/m² per day of solar radiation.",
      color: '#f39c12'
    },
    {
      image: '/public/carousel/wind.webp',
      title: "Wind Power",
      description: "Wind energy captures the natural power of wind through turbines, converting it into renewable electricity.",
      details: "The Philippines' wind energy sector is growing, with several wind farms contributing to the national power grid.",
      color: '#2ecc71'
    }
  ];
  
  /**
   * Energy types data
   */
  export const energyTypes = [
    {
      type: "Solar",
      icon: <CloudSun size={32} />,
      color: '#f39c12',
      description: "Harnessing the sun's power for sustainable energy"
    },
    {
      type: "Wind",
      icon: <Wind size={32} />,
      color: '#2ecc71',
      description: "Converting wind power into clean electricity"
    },
    {
      type: "Geothermal",
      icon: <Flower size={32} />,
      color: '#e74c3c',
      description: "Utilizing Earth's heat for renewable energy"
    },
    {
      type: "Hydropower",
      icon: <Droplets size={32} />,
      color: '#3498db',
      description: "Generating power from flowing water"
    },
    {
      type: "Biomass",
      icon: <Flower size={32} />,
      color: '#27ae60',
      description: "Converting organic matter into sustainable energy"
    }
  ];
  
  /**
   * Features data
   */
  export const features = [
    {
      icon: <Activity size={32} />,
      title: "Real-time Monitoring",
      description: "Track energy production and consumption with instant updates and comprehensive dashboards for optimal resource management."
    },
    {
      icon: <LineChart size={32} />,
      title: "Advanced Analytics",
      description: "Gain detailed insights and performance metrics to optimize your renewable energy systems with ML-powered prediction models."
    },
    {
      icon: <PieChart size={32} />,
      title: "Resource Distribution",
      description: "Efficiently allocate and manage energy resources across different systems with intelligent load balancing algorithms."
    },
    {
      icon: <MessageCircle size={32} />,
      title: "Community Engagement",
      description: "Connect with others interested in renewable energy solutions through our collaborative platform and knowledge sharing tools."
    }
  ];
  
  /**
   * Additional features for extended display
   */
  export const extendedFeatures = [
    {
      icon: <AlertCircle size={32} />,
      title: "Predictive Maintenance",
      description: "Reduce downtime with AI-powered early warning systems that detect potential issues before they affect performance."
    },
    {
      icon: <Zap size={32} />,
      title: "Energy Optimization",
      description: "Automated systems to maximize energy output based on environmental conditions and usage patterns."
    },
    {
      icon: <BarChart4 size={32} />,
      title: "Comprehensive Reporting",
      description: "Generate detailed reports on energy production, consumption, and environmental impact for stakeholders."
    },
    {
      icon: <Cpu size={32} />,
      title: "Smart Grid Integration",
      description: "Seamlessly connect to smart grid systems for efficient energy distribution and management across networks."
    }
  ];
  
  /**
   * Team members data
   */
  export const teamMembers = [
    {
      name: "John Leonard O. Nagallo",
      role: "Backend",
      image: "/team/leonard_suit.jpg",
      bio: "Renewable energy expert with 10+ years experience in sustainable development.",
      linkedin: "https://linkedin.com/in/sarahjohnson"
    },
    {
      name: "Jade C. Pis-An",
      role: "Frontend",
      image: "/team/jade_suit.jpg",
      bio: "Software architect specializing in energy monitoring systems and analytics.",
      linkedin: "https://linkedin.com/in/michaelchen"
    },
    {
      name: "Gwyneth Ortiz",
      role: "Documentation",
      image: "/team/gwyneth.png",
      bio: "Electrical engineer with expertise in renewable energy integration and smart grids.",
      linkedin: "https://linkedin.com/in/avarodriguez"
    },
    {
      name: "Lester I. Sible",
      role: "Frontend",
      image: "/assets/images/team/team4.jpg",
      bio: "Machine learning specialist focused on optimizing renewable energy performance.",
      linkedin: "https://linkedin.com/in/davidokafor"
    }
  ];
  
  /**
   * Statistics data
   */
  export const statistics = [
    {
      value: "10,000+",
      label: "Energy Sources Monitored",
      icon: <CloudSun size={32} />
    },
    {
      value: "5M+",
      label: "kWh Saved",
      icon: <Activity size={32} />
    },
    {
      value: "15+",
      label: "Countries Served",
      icon: <Users size={32} />
    },
    {
      value: "98%",
      label: "Client Satisfaction",
      icon: <MessageCircle size={32} />
    }
  ];
  
  /**
   * Helper function to format numbers
   * @param {number} num - Number to format
   * @returns {string} Formatted number
   */
  export const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };
  
  /**
   * Helper function for gradient colors
   * @param {string} baseColor - Base color in hex
   * @param {number} opacity - Opacity value (0-1)
   * @returns {string} Color with opacity
   */
  export const getColorWithOpacity = (baseColor, opacity = 0.2) => {
    // If hex is provided with # prefix
    if (baseColor.startsWith('#')) {
      return `${baseColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
    }
    return `${baseColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
  };