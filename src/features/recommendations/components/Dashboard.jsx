import React from 'react';
import { 
  Button, 
  Card, 
  theme, 
  AppIcon
} from '@shared/index';

const EnergyRecommendations = () => {
  const { primary, warning, info } = theme.palette;

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
  ];

  const energyPotential = [
    {
      type: "Solar",
      potential: "High",
      icon: 'solar',
      color: warning.main,
      details: "Average 5.5 kWh/m²/day"
    },
    {
      type: "Wind",
      potential: "Moderate",
      icon: 'wind',
      color: info.main,
      details: "Average speed 12 km/h"
    },
    {
      type: "Hydro",
      potential: "Available",
      icon: 'hydropower',
      color: primary.main,
      details: "2 viable water sources"
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Energy Recommendations</h1>
          <div className="flex items-center gap-2">
            <p className="text-gray-600">
              {cityData.city} • {cityData.period}
            </p>
            <button 
              className="p-1 hover:bg-gray-100 rounded-full"
              title={cityData.location.coordinates}
            >
              <AppIcon name="location" type="tool" size={16} />
            </button>
          </div>
          <div className="flex gap-2 mt-2">
            <span className="px-3 py-1 text-sm border border-primary-600 text-primary-600 rounded-full"
                  style={{ borderColor: primary.main, color: primary.main }}>
              Budget: {cityData.budget}
            </span>
            <span className="px-3 py-1 text-sm border border-primary-600 text-primary-600 rounded-full"
                  style={{ borderColor: primary.main, color: primary.main }}>
              Year: {cityData.year}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outlined"
            size="medium"
            className="gap-2"
          >
            <AppIcon name="save" size={18} />
            Save Report
          </Button>
          <Button
            variant="primary"
            size="medium"
            className="gap-2"
          >
            <AppIcon name="download" size={18} />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Energy Potential Cards */}
      <h2 className="text-xl font-semibold mb-4">Renewable Energy Potential</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {energyPotential.map((energy) => (
          <Card key={energy.type} variant="default" className="hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${energy.color}20`, color: energy.color }}>
                  <AppIcon name={energy.icon} size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{energy.type}</h3>
                  <p className="text-gray-600">Potential: {energy.potential}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">{energy.details}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Future Projections */}
      <h2 className="text-xl font-semibold mb-4">Future Projections (2024-2026)</h2>
      <Card variant="default" className="mb-8">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projections.map((proj) => (
              <div key={proj.year}>
                <h3 className="text-lg font-semibold">{proj.year}</h3>
                <p className="text-gray-600 mb-2">{proj.title}</p>
                {/* Progress Bar */}
                <div className="relative h-2 bg-primary-100 rounded-full mb-4">
                  <div 
                    className="absolute top-0 left-0 h-full rounded-full transition-all"
                    style={{ 
                      width: `${proj.progress}%`,
                      backgroundColor: primary.main
                    }}
                  />
                </div>
                <ul className="list-disc pl-4 space-y-1">
                  {proj.details.map((detail, index) => (
                    <li key={index} className="text-sm text-gray-500">{detail}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Cost-Benefit Analysis */}
      <h2 className="text-xl font-semibold mb-4">Cost-Benefit Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {costBenefits.map((item) => (
          <Card key={item.label} variant="default" className="hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <AppIcon name={item.icon} size={20} />
                <span className="text-gray-600">{item.label}</span>
                <button 
                  className="p-1 hover:bg-gray-100 rounded-full"
                  title={item.description}
                >
                  <AppIcon name="info" size={16} />
                </button>
              </div>
              <p className="text-2xl font-semibold">{item.value}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EnergyRecommendations;