import React from 'react';
import { 
  Button, 
  Card, 
  theme, 
  AppIcon,
  YearPicker 
} from '@shared/index';
import { useRecommendations } from './renderRecommend';

const EnergyRecommendations = () => {
  const { primary, warning, info } = theme.palette;
  const {
    cityData,
    projections,
    costBenefits,
    energyPotential,
    handleSaveReport,
    handleDownloadPDF,
    isLoading
  } = useRecommendations();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

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
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              title={cityData.location.coordinates}
            >
              <AppIcon name="location" type="tool" size={16} />
            </button>
          </div>
          <div className="flex gap-2 mt-2">
            <span className="px-3 py-1 text-sm border rounded-full transition-colors"
                  style={{ borderColor: primary.main, color: primary.main }}>
              Budget: {cityData.budget}
            </span>
            <span className="px-3 py-1 text-sm border rounded-full transition-colors"
                  style={{ borderColor: primary.main, color: primary.main }}>
              Year: {cityData.year}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <YearPicker />
          <div className="flex gap-2">
            <Button
              variant="outlined"
              size="medium"
              className="gap-2 transition-all hover:shadow-md"
              onClick={handleSaveReport}
            >
              <AppIcon name="save" size={18} />
              Save Report
            </Button>
            <Button
              variant="primary"
              size="medium"
              className="gap-2 transition-all hover:shadow-md"
              onClick={handleDownloadPDF}
            >
              <AppIcon name="download" size={18} />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Energy Potential Cards */}
      <h2 className="text-xl font-semibold mb-4">Renewable Energy Potential</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {energyPotential.map((energy) => (
          <Card.Base 
            key={energy.type} 
            className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 rounded-lg transition-colors" 
                     style={{ backgroundColor: `${energy.color}20`, color: energy.color }}>
                  <AppIcon name={energy.icon} size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{energy.type}</h3>
                  <p className="text-gray-600">Potential: {energy.potential}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">{energy.details}</p>
            </div>
          </Card.Base>
        ))}
      </div>

      {/* Future Projections */}
      <h2 className="text-xl font-semibold mb-4">Future Projections (2024-2026)</h2>
      <Card.Base className="mb-8 hover:shadow-lg transition-all duration-300">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projections.map((proj) => (
              <div key={proj.year} className="group">
                <h3 className="text-lg font-semibold">{proj.year}</h3>
                <p className="text-gray-600 mb-2">{proj.title}</p>
                {/* Progress Bar */}
                <div className="relative h-2 bg-primary-100 rounded-full mb-4 overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${proj.progress}%`,
                      backgroundColor: primary.main
                    }}
                  />
                </div>
                <ul className="list-disc pl-4 space-y-1">
                  {proj.details.map((detail, index) => (
                    <li key={index} className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
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
      <h2 className="text-xl font-semibold mb-4">Cost-Benefit Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {costBenefits.map((item) => (
          <Card.Base 
            key={item.label} 
            className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <AppIcon name={item.icon} size={20} />
                <span className="text-gray-600">{item.label}</span>
                <button 
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  title={item.description}
                >
                  <AppIcon name="info" size={16} />
                </button>
              </div>
              <p className="text-2xl font-semibold">{item.value}</p>
            </div>
          </Card.Base>
        ))}
      </div>
    </div>
  );
};

export default EnergyRecommendations;