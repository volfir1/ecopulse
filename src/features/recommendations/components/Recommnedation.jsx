import React, { useState } from 'react';
import { 
  Button, 
  Card, 
  p, s, t, bg, elements,
  AppIcon,
  InputBox,
  NumberBox,
  YearPicker
} from '@shared/index';

const EnergyRecommendations = () => {
  const [budget, setBudget] = useState("300000");
  const [year, setYear] = useState("2025");

  // Static data
  const cityData = {
    city: "Taguig City",
    period: "2024-2026 Analysis",
    location: {
      coordinates: "14.5176° N, 121.0509° E"
    }
  };

  const energyPotential = [
    {
      type: "Solar",
      potential: "High",
      icon: 'solar',
      color: elements.solar,
      details: "Average 5.5 kWh/m²/day"
    },
    {
      type: "Wind",
      potential: "Moderate",
      icon: 'wind',
      color: elements.wind,
      details: "Average speed 12 km/h"
    },
    {
      type: "Hydro",
      potential: "Available",
      icon: 'hydropower',
      color: elements.hydropower,
      details: "2 viable water sources"
    }
  ];

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

  const handleBudgetChange = (event) => {
    const value = event.target.value.replace(/[^0-9]/g, '');
    setBudget(value);
  };

  const handleYearChange = (date) => {
    setYear(date);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto" style={{ backgroundColor: bg.subtle }}>
      {/* Header Section */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-2" style={{ color: t.main }}>Energy Recommendations</h1>
          <div className="flex items-center gap-2">
            <p style={{ color: t.secondary }}>
              {cityData.city} • {cityData.period}
            </p>
            <button 
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              title={cityData.location.coordinates}
            >
              <AppIcon name="location" type="tool" size={16} />
            </button>
          </div>
          <div className="flex gap-4 mt-4">
  <div>
    <label 
      className="block text-sm font-medium mb-1" 
      style={{ color: t.secondary }}
    >
      Budget
    </label>
    <NumberBox
      placeholder="Enter Budget"
      value={budget}
      onChange={handleBudgetChange}
      size="medium"
      variant="outlined"
      className="w-40"
      prefix="₱"
    />
  </div>
  <div>
    <label 
      className="block text-sm font-medium mb-1" 
      style={{ color: t.secondary }}
    >
      Year
    </label>
    <YearPicker
      value={year}
      onChange={handleYearChange}
      endYear={year}
      showRange={false}
      className="w-32"
    />
  </div>
</div>

        </div>
        
        <Button
          variant="primary"
          size="medium"
          className="gap-2 transition-all hover:shadow-md bg-green-700 hover:bg-green-800"
        >
          <AppIcon name="save" size={18} />
          Download PDF
        </Button>
      </div>

      {/* Energy Potential Cards */}
      <h2 className="text-xl font-semibold mb-4" style={{ color: t.main }}>Renewable Energy Potential</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {energyPotential.map((energy) => (
          <Card.Base 
            key={energy.type} 
            className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            style={{ backgroundColor: bg.paper }}
          >
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 rounded-lg transition-colors" 
                     style={{ 
                       backgroundColor: `${energy.color}20`,
                       color: energy.color
                     }}>
                  <AppIcon name={energy.icon} size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: t.main }}>{energy.type}</h3>
                  <p style={{ color: t.secondary }}>Potential: {energy.potential}</p>
                </div>
              </div>
              <p className="text-sm" style={{ color: t.hint }}>{energy.details}</p>
            </div>
          </Card.Base>
        ))}
      </div>

      {/* Future Projections */}
      <h2 className="text-xl font-semibold mb-4" style={{ color: t.main }}>Future Projections</h2>
      <Card.Base className="mb-8 hover:shadow-lg transition-all duration-300" style={{ backgroundColor: bg.paper }}>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projections.map((proj) => (
              <div key={proj.year} className="group">
                <h3 className="text-lg font-semibold" style={{ color: t.main }}>{proj.year}</h3>
                <p style={{ color: t.secondary }} className="mb-2">{proj.title}</p>
                <div className="relative h-2 rounded-full mb-4 overflow-hidden" style={{ backgroundColor: `${p.light}30` }}>
                  <div 
                    className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${proj.progress}%`,
                      backgroundColor: p.main
                    }}
                  />
                </div>
                <ul className="list-disc pl-4 space-y-1">
                  {proj.details.map((detail, index) => (
                    <li key={index} className="text-sm group-hover:text-gray-700 transition-colors" style={{ color: t.secondary }}>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Card.Base>

      {/* Cost-Benefit Analysis */}
      <h2 className="text-xl font-semibold mb-4" style={{ color: t.main }}>Cost-Benefit Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {costBenefits.map((item) => (
          <Card.Base 
            key={item.label} 
            className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            style={{ backgroundColor: bg.paper }}
          >
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <AppIcon name={item.icon} size={20} />
                <span style={{ color: t.secondary }}>{item.label}</span>
                <button 
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  title={item.description}
                >
                  <AppIcon name="info" size={16} />
                </button>
              </div>
              <p className="text-2xl font-semibold" style={{ color: t.main }}>{item.value}</p>
            </div>
          </Card.Base>
        ))}
      </div>
    </div>
  );
};

export default EnergyRecommendations;