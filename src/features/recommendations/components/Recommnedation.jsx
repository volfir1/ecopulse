import React, { useState, useEffect } from 'react';
import api from '@features/modules/api';
import { 
  Button, 
  Card, 
  p, s, t, bg, elements,
  AppIcon,
  NumberBox,
  SingleYearPicker 
} from '@shared/index';
import { useRecommendations } from './reommendHook';
import { 
  Divider, 
  Chip, 
  Tooltip, 
  Paper,
  Typography,
  Box
} from '@mui/material';

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
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-green-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">Energy Recommendations</h1>
            <div className="flex items-center text-green-100 text-sm">
              <AppIcon name="location" size={16} className="mr-1" />
              <span>{cityData.city} • {cityData.period}</span>
            </div>
          </div>
          
          <Button
            variant="outlined"
            className="text-white border-white hover:bg-green-800"
            onClick={handleDownloadPDF}
            disabled={isLoading}
          >
            <AppIcon name={isLoading ? "loading" : "save"} size={18} className="mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Input Controls */}
        <Paper className="mb-6 rounded-lg shadow-sm">
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
              <NumberBox
                placeholder="Enter Budget"
                value={budgetValue}
                onChange={handleBudgetChange}
                size="medium"
                variant="outlined"
                className="w-full"
                prefix="₱"
              />
              <p className="mt-1 text-xs text-gray-500">Minimum: ₱15,000</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <SingleYearPicker
                initialYear={investmentYear}
                onYearChange={(year) => setInvestmentYear(year)}
                className="w-full"
              />
            </div>
          </div>
        </Paper>

        {/* Energy Potential */}
        <Typography variant="h6" className="font-semibold mb-3 text-gray-800">
          Renewable Energy Potential
        </Typography>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Paper className="rounded-lg shadow-sm overflow-hidden">
            <div className="bg-yellow-500 h-1"></div>
            <div className="p-4">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center mr-3">
                  <AppIcon name="solar" size={20} className="text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-medium">Solar</h3>
                  <p className="text-sm text-gray-600">Potential: {cityData.location.solarPotential}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">Average 5.5 kWh/m²/day</p>
            </div>
          </Paper>
        </div>

        {/* Future Projections */}
        <Typography variant="h6" className="font-semibold mb-3 text-gray-800">
          Future Projections
        </Typography>
        
        <Paper className="mb-6 rounded-lg shadow-sm">
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projections.map((proj, index) => (
                <div key={index}>
                  <div className="mb-2">
                    <Chip 
                      label={proj.year} 
                      size="small" 
                      className="bg-blue-100 text-blue-700 mb-1 mr-2" 
                    />
                    <span className="font-medium">{proj.title}</span>
                  </div>
                  
                  <div className="relative h-2 bg-gray-200 rounded-full mb-3">
                    <div 
                      className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                      style={{ width: `${proj.progress}%` }}
                    ></div>
                  </div>
                  
                  <ul className="text-sm text-gray-600 space-y-1">
                    {proj.details.map((detail, idx) => (
                      <li key={idx} className="flex">
                        <span className="h-2 w-2 mt-1.5 mr-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              
              {solarRecommendations && (
                <div>
                  <div className="mb-3">
                    <h3 className="font-medium">{solarRecommendations.future_projections.year}</h3>
                    <p className="text-sm text-gray-600">{solarRecommendations.future_projections.title}</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">
                      Predicted MERALCO Rate: 
                      <span className="font-medium ml-1">
                        {solarRecommendations.future_projections['Predicted MERALCO Rate']}
                      </span>
                    </p>
                    <p className="text-gray-600">
                      Installable Solar Capacity: 
                      <span className="font-medium ml-1">
                        {solarRecommendations.future_projections['Installable Solar Capacity']}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Paper>

        {/* Cost-Benefit Analysis */}
        <Typography variant="h6" className="font-semibold mb-3 text-gray-800">
          Cost-Benefit Analysis
        </Typography>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {costBenefits.map((item, index) => (
            <Paper key={index} className="rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">{item.label}</span>
                <Tooltip title={item.description || ""}>
                  <Button className="p-0 min-w-0">
                    <AppIcon name="info" size={16} className="text-gray-400" />
                  </Button>
                </Tooltip>
              </div>
              <div className="flex items-center">
                <AppIcon name={item.icon} size={20} className="text-gray-500 mr-2" />
                <Typography variant="h6" className="font-bold">{item.value}</Typography>
              </div>
            </Paper>
          ))}
          
          {solarRecommendations && solarRecommendations.cost_benefit_analysis.map((item, index) => (
            <Paper key={index} className="rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">{item.label}</span>
                <Tooltip title={item.description || ""}>
                  <Button className="p-0 min-w-0">
                    <AppIcon name="info" size={16} className="text-gray-400" />
                  </Button>
                </Tooltip>
              </div>
              <div className="flex items-center">
                <AppIcon name={item.icon} size={20} className="text-gray-500 mr-2" />
                <Typography variant="h6" className="font-bold">{item.value}</Typography>
              </div>
            </Paper>
          ))}
        </div>
      </div>
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <Paper className="p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-3">
              <AppIcon name="loading" size={24} className="text-green-500 animate-spin" />
              <Typography>Loading data...</Typography>
            </div>
          </Paper>
        </div>
      )}
    </div>
  );
};

export default EnergyRecommendations;