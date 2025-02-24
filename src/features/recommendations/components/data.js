// recommendationsData.js
export const initialData = {
  cityData: {
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
  },

  projections: [
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
  ],

  costBenefits: [
    {
      label: "Initial Investment",
      value: "₱15M",
      icon: 'battery',
      description: "Total upfront costs including equipment and installation"
    },
    {
      label: "ROI Timeline",
      value: "3.5 years",
      icon: 'trending-up',
      description: "Expected period to recover investment through savings"
    },
    {
      label: "Monthly Savings",
      value: "₱350,000",
      icon: 'line-chart',
      description: "Projected monthly reduction in energy costs"
    },
    {
      label: "Gov't Incentives",
      value: "₱2.5M",
      icon: 'solar',
      description: "Available government subsidies and tax benefits"
    }
  ],

  energyPotential: [
    {
      type: "Solar",
      potential: "High",
      icon: 'solar',
      color: 'warning.main',
      details: "Average 5.5 kWh/m²/day"
    },
    {
      type: "Wind",
      potential: "Moderate",
      icon: 'wind',
      color: 'info.main',
      details: "Average speed 12 km/h"
    },
    {
      type: "Hydro",
      potential: "Available",
      icon: 'hydropower',
      color: 'primary.main',
      details: "2 viable water sources"
    }
  ]
};