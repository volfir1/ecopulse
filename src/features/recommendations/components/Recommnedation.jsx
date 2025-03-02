import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '@features/modules/api';
import { 
  Button, 
  Card, 
  p, s, t, bg, elements,
  AppIcon,
  NumberBox,
  SingleYearPicker // Changed from YearPicker to SingleYearPicker
} from '@shared/index';
import { useRecommendations } from './reommendHook';

const EnergyRecommendations = () => {
  const {
    cityData,
    projections,
    costBenefits,
    energyPotential,
    handleDownloadPDF,
    year,
    handleYearChange,
    isLoading
  } = useRecommendations();

  const [solarRecommendations, setSolarRecommendations] = useState(null);

  // Initialize budget and year with default values
  const [budgetValue, setBudgetValue] = useState(50000);
  const [investmentYear, setInvestmentYear] = useState(new Date().getFullYear() + 1);

  useEffect(() => {
    const fetchSolarRecommendations = async () => {
      try {
        const response = await api.get('/api/solar_recommendations', {
          params: { year: investmentYear, budget: budgetValue }
        });
        setSolarRecommendations(response.data.recommendations);
      } catch (error) {
        console.error("Error fetching solar recommendations:", error);
      }
    };

    fetchSolarRecommendations();
  }, [investmentYear, budgetValue]);

  // Handle budget change with minimum value of 15,000
  const handleBudgetChange = (event) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      const numericValue = parseInt(value, 10);
      if (numericValue >= 15000 || value === '') {
        setBudgetValue(value === '' ? '' : numericValue);
      }
    }
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
                value={budgetValue}
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
              {/* Replaced YearPicker with SingleYearPicker */}
              <SingleYearPicker
                initialYear={investmentYear}
                onYearChange={(year) => setInvestmentYear(year)}
              />
            </div>
          </div>
        </div>
        
        <Button
          variant="primary"
          size="medium"
          className="gap-2 transition-all hover:shadow-md bg-green-700 hover:bg-green-800"
          onClick={handleDownloadPDF}
          disabled={isLoading}
        >
          <AppIcon name={isLoading ? "loading" : "save"} size={18} />
          Download PDF
        </Button>
      </div>

      {/* Energy Potential Cards */}
      <h2 className="text-xl font-semibold mb-4" style={{ color: t.main }}>Renewable Energy Potential</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Creating energy potential cards from location data */}
        <Card.Base 
          className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          style={{ backgroundColor: bg.paper }}
        >
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 rounded-lg transition-colors" 
                   style={{ 
                     backgroundColor: `${elements.solar}20`,
                     color: elements.solar
                   }}>
                <AppIcon name="solar" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold" style={{ color: t.main }}>Solar</h3>
                <p style={{ color: t.secondary }}>Potential: {cityData.location.solarPotential}</p>
              </div>
            </div>
            <p className="text-sm" style={{ color: t.hint }}>Average 5.5 kWh/m²/day</p>
          </div>
        </Card.Base>
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
            {solarRecommendations && (
              <div className="group">
                <h3 className="text-lg font-semibold" style={{ color: t.main }}>{solarRecommendations.future_projections.year}</h3>
                <p style={{ color: t.secondary }} className="mb-2">{solarRecommendations.future_projections.title}</p>
                <p style={{ color: t.secondary }} className="mb-2">{solarRecommendations.future_projections['Predicted MERALCO Rate']}</p>
                <p style={{ color: t.secondary }} className="mb-2">{solarRecommendations.future_projections['Installable Solar Capacity']}</p>
              </div>
            )}
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
        {solarRecommendations && solarRecommendations.cost_benefit_analysis.map((item) => (
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
      
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
            <AppIcon name="loading" size={24} className="animate-spin" />
            <span>Loading data...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnergyRecommendations;