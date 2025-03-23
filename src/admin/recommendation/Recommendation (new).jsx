import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  IconButton, 
  Box, 
  Tabs,
  Tab
} from '@mui/material';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Card, Button, useSnackbar } from '@shared/index';

import { 
  formatCurrency, 
  generateRoiData, 
  generateEnergyData, 
  generateCarbonData, 
  extractRoiValues,
  getYearValue,
  generateYearOptions,
  chartColors,
  dummyData
} from './utils';
import { useYearPicker, useRecommendationData } from './hook';

/**
 * Form Input Components
 */
export const NumberBox = ({ 
  label, 
  value = '', 
  placeholder = '', 
  disabled = false,
  onChange
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="text"
        className={`border rounded-md p-2 w-full ${disabled ? 'bg-gray-100' : ''}`}
        placeholder={placeholder}
        value={value || ''}
        disabled={disabled}
        readOnly={disabled}
        onChange={onChange}
      />
    </div>
  );
};

export const TextBox = ({ 
  label, 
  value = '', 
  placeholder = '', 
  multiline = false, 
  rows = 3, 
  disabled = false,
  onChange
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {multiline ? (
        <textarea
          className={`border rounded-md p-2 w-full ${disabled ? 'bg-gray-100' : ''}`}
          placeholder={placeholder}
          value={value || ''}
          rows={rows}
          disabled={disabled}
          readOnly={disabled}
          onChange={onChange}
        />
      ) : (
        <input
          type="text"
          className={`border rounded-md p-2 w-full ${disabled ? 'bg-gray-100' : ''}`}
          placeholder={placeholder}
          value={value || ''}
          disabled={disabled}
          readOnly={disabled}
          onChange={onChange}
        />
      )}
    </div>
  );
};

/**
 * YearPicker Component
 */
export const YearPicker = ({
  startYear,
  endYear,
  onStartYearChange,
  onEndYearChange,
  onReset,
  error,
  usingMockData = false
}) => {
  const years = generateYearOptions(2020, 2030);
  
  return (
    <div className="flex items-center gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Start Year</label>
        <select 
          className={`border rounded-md p-2 ${error ? 'border-red-500' : 'border-gray-300'}`}
          value={getYearValue(startYear)}
          onChange={(e) => onStartYearChange(parseInt(e.target.value))}
        >
          {years.map(year => (
            <option key={`start-${year}`} value={year}>{year}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center">
        <span className="text-gray-600">to</span>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">End Year</label>
        <select 
          className={`border rounded-md p-2 ${error ? 'border-red-500' : 'border-gray-300'}`}
          value={getYearValue(endYear)}
          onChange={(e) => onEndYearChange(parseInt(e.target.value))}
        >
          {years.map(year => (
            <option key={`end-${year}`} value={year}>{year}</option>
          ))}
        </select>
      </div>
      
      <div className="flex items-end mb-1">
        <Button
          variant="secondary"
          size="small"
          onClick={onReset}
          className="h-[38px]"
          startIcon={
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
            </svg>
          }
        >
          Reset
        </Button>
      </div>
      
      {usingMockData && (
        <div className="flex items-end mb-1">
          <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-md flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            Using simulated data
          </span>
        </div>
      )}
      
      {error && (
        <div className="text-red-500 text-xs">Invalid year range</div>
      )}
    </div>
  );
};

/**
 * RecommendationForm Component
 */
export const RecommendationForm = ({ onSubmit }) => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [budget, setBudget] = useState(50000);
  const [errors, setErrors] = useState({});
  const toast = useSnackbar();

  const validateForm = () => {
    const newErrors = {};
    
    if (!year || year < currentYear) {
      newErrors.year = `Year must be ${currentYear} or later`;
    }
    
    if (!budget || budget < 10000) {
      newErrors.budget = 'Budget must be at least ₱10,000';
    }
    
    if (Object.keys(newErrors).length > 0) {
      toast.warning('Please correct the errors in the form');
      setErrors(newErrors);
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(year, budget);
    }
  };

  return (
    <Card.Solar
      title="Calculate Your Solar Investment"
      className="mb-6"
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Investment Year
            </label>
            <input
              type="number"
              className={`border rounded-md p-2 w-full ${errors.year ? 'border-red-500' : 'border-gray-300'}`}
              min={currentYear}
              max={2050}
              value={year}
              onChange={(e) => {
                setYear(parseInt(e.target.value));
                setErrors({...errors, year: null});
              }}
              required
            />
            {errors.year && (
              <p className="text-red-500 text-xs mt-1">{errors.year}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Year when you plan to invest in solar panels
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget (PHP)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">₱</span>
              <input
                type="number"
                className={`border rounded-md p-2 pl-7 w-full ${errors.budget ? 'border-red-500' : 'border-gray-300'}`}
                min={10000}
                step={10000}
                value={budget}
                onChange={(e) => {
                  setBudget(parseInt(e.target.value));
                  setErrors({...errors, budget: null});
                }}
                required
              />
            </div>
            {errors.budget && (
              <p className="text-red-500 text-xs mt-1">{errors.budget}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Your available budget for solar investment
            </p>
          </div>
        </div>
        <div className="mt-6 flex items-center">
          <Button
            variant="solar"
            type="submit"
            startIcon={
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <path d="M12 1v2"></path>
                <path d="M12 21v2"></path>
                <path d="M4.22 4.22l1.42 1.42"></path>
                <path d="M18.36 18.36l1.42 1.42"></path>
                <path d="M1 12h2"></path>
                <path d="M21 12h2"></path>
                <path d="M4.22 19.78l1.42-1.42"></path>
                <path d="M18.36 5.64l1.42-1.42"></path>
              </svg>
            }
          >
            Get Recommendations
          </Button>
          <div className="text-xs ml-4 text-gray-500 max-w-xs">
            Our AI model will analyze current market trends to provide accurate forecasts of solar costs and electricity rates for your selected year.
          </div>
        </div>
      </form>
    </Card.Solar>
  );
};

/**
 * RecommendationResults Component
 */
export const RecommendationResults = ({ recommendation }) => {
  const { future_projections, cost_benefit_analysis } = recommendation;

  return (
    <Card.Base
      title={future_projections.title}
      className="mb-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-green-800 mb-4">Investment Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Year of Investment:</span>
              <span className="font-semibold">{future_projections.year}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Predicted Solar Cost:</span>
              <span className="font-semibold text-amber-600">{future_projections['Predicted Solar Cost'] || future_projections['Predicted MERALCO Rate']}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Predicted MERALCO Rate:</span>
              <span className="font-semibold text-blue-600">{future_projections['Predicted MERALCO Rate']}</span>
            </div>
            <div className="flex justify-between items-center border-t border-green-100 pt-3 mt-3">
              <span className="text-gray-700 font-medium">Installable Solar Capacity:</span>
              <span className="font-bold text-green-600 text-lg">{future_projections['Installable Solar Capacity']}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-800 mb-4">Return on Investment</h3>
          <div className="space-y-4">
            {cost_benefit_analysis.map((item, index) => (
              <div key={index} className="flex items-start">
                <div className="bg-white p-2 rounded-full mr-3">
                  {item.icon === 'energy' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                    </svg>
                  )}
                  {item.icon === 'savings' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M16 8h-6.5a2.5 2.5 0 000 5h3a2.5 2.5 0 010 5H6"></path>
                      <path d="M12 18v2"></path>
                      <path d="M12 4v2"></path>
                    </svg>
                  )}
                  {item.icon === 'roi' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                      <path d="M12 22V2"></path>
                      <path d="M17 7H7.5a2.5 2.5 0 000 5h9a2.5 2.5 0 010 5H7"></path>
                    </svg>
                  )}
                </div>
                <div>
                  <h4 className="font-medium">{item.label}</h4>
                  <p className="text-lg font-bold text-gray-700">{item.value}</p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Card.Success className="p-4">
        <h3 className="font-medium mb-2">Recommendation Summary</h3>
        <p className="text-gray-700">
          Based on your investment of {formatCurrency(50000)} in {future_projections.year}, you can install {future_projections['Installable Solar Capacity']} of solar capacity. 
          This system will generate approximately {cost_benefit_analysis[0].value} of energy per year, saving you {cost_benefit_analysis[1].value} annually.
          Your investment will pay for itself in just {cost_benefit_analysis[2].value}, making this an excellent financial decision with significant long-term benefits.
        </p>
        <div className="mt-4 flex items-center text-green-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span className="font-medium">We recommend proceeding with this solar investment plan.</span>
        </div>
      </Card.Success>
    </Card.Base>
  );
};

/**
 * RecommendationCharts Component
 */
export const RecommendationCharts = ({ recommendation, historicalData }) => {
  const [activeTab, setActiveTab] = useState(0);
  const toast = useSnackbar();
  
  const { future_projections, cost_benefit_analysis } = recommendation;
  const year = future_projections.year;
  
  // Extract values from recommendation
  const { roiYears, yearlyProduction, yearlySavings } = extractRoiValues(recommendation);
  
  // Generate data for charts
  const initialInvestment = 50000; // This would typically come from the form
  const roiData = generateRoiData(year, roiYears, yearlySavings, initialInvestment);
  const energyData = generateEnergyData(yearlyProduction, yearlySavings);
  const carbonData = generateCarbonData(year, yearlyProduction);
  
  // Handle chart download
  const handleDownloadChart = () => {
    toast.info("Chart download feature will be implemented in the next update");
  };
  
  // Handle PDF export
  const handleExportPDF = () => {
    toast.info("PDF export feature will be implemented in the next update");
  };

  // Render the appropriate chart based on active tab
  const renderChart = () => {
    switch(activeTab) {
      case 0: // ROI Analysis
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={roiData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis yAxisId="left" 
                     label={{ value: 'PHP', angle: -90, position: 'insideLeft' }} 
                     tickFormatter={(value) => `₱${Math.abs(value) >= 1000 ? `${(value/1000).toFixed(0)}k` : value}`} />
              <Tooltip formatter={(value) => [`₱${value.toLocaleString()}`, undefined]} />
              <Legend />
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="investment" 
                name="Investment" 
                stroke="#ef4444" 
                strokeWidth={2} 
              />
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="cumulativeSavings" 
                name="Cumulative Savings" 
                stroke="#22c55e" 
                strokeWidth={2} 
              />
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="netReturn" 
                name="Net Return" 
                stroke="#3b82f6" 
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 1: // Energy Production
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={energyData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" 
                     label={{ value: 'Energy (kWh)', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right"
                     label={{ value: 'Savings (PHP)', angle: 90, position: 'insideRight' }} />
              <Tooltip formatter={(value, name) => {
                if (name === 'energy') return [`${value.toFixed(2)} kWh`, 'Energy Production'];
                return [`₱${value.toFixed(2)}`, 'Cost Savings'];
              }} />
              <Legend />
              <Bar yAxisId="left" dataKey="energy" name="Energy Production" fill="#22c55e" />
              <Line yAxisId="right" type="monotone" dataKey="savings" name="Cost Savings" stroke="#3b82f6" strokeWidth={2} />
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 2: // Carbon Impact
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={carbonData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis label={{ value: 'Carbon Offset (tons)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => [`${value.toFixed(2)} tons`, 'Carbon Offset']} />
              <Legend />
              <Area type="monotone" dataKey="cumulativeOffset" name="Cumulative Carbon Offset" fill="#059669" stroke="#059669" />
              <Bar dataKey="carbonOffset" name="Annual Carbon Offset" fill="#10b981" />
            </AreaChart>
          </ResponsiveContainer>
        );
        
      default:
        return null;
    }
  };

  const renderTabButton = (index, label) => (
    <button
      onClick={() => setActiveTab(index)}
      className={`mr-4 px-3 py-2 text-sm font-medium rounded-md ${
        activeTab === index
          ? 'bg-green-100 text-green-800'
          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );

  return (
    <Card.Solar
      title="Investment Analysis Charts"
      className="mb-6 overflow-hidden"
      action={
        <div className="flex flex-wrap items-center">
          {renderTabButton(0, "ROI Analysis")}
          {renderTabButton(1, "Energy Production")}
          {renderTabButton(2, "Carbon Impact")}
        </div>
      }
      footer={
        <div className="flex justify-end">
          <Button
            variant="secondary"
            className="mr-2"
            startIcon={
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            }
            onClick={handleDownloadChart}
          >
            Download Chart
          </Button>
          <Button
            variant="solar"
            startIcon={
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            }
            onClick={handleExportPDF}
          >
            Export to PDF
          </Button>
        </div>
      }
    >
      <div className="p-6 h-96">
        {renderChart()}
      </div>
    </Card.Solar>
  );
};

/**
 * RecommendationHistory Component
 */
export const RecommendationHistory = ({ 
  filteredData = [], 
  startYear, 
  endYear,
  onEditRecord 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useSnackbar();

  // Search functionality
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast.info('Please enter a search term');
      return;
    }
    
    toast.info(`Search functionality will be implemented in the next update`);
  };

  // Export functionality
  const handleExport = () => {
    toast.info('Export functionality will be implemented in the next update');
  };

  // Refresh functionality
  const handleRefresh = () => {
    toast.success('Data refreshed successfully');
  };

  // Delete record
  const handleDelete = (id) => {
    toast.success('Record deleted successfully');
  };

  return (
    <Card.Base className="mb-6">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium">Recommendation History ({startYear} - {endYear})</h2>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            <input 
              type="text" 
              placeholder="Search records..." 
              className="border rounded-md p-2 mr-2" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button 
              variant="secondary" 
              className="mr-2"
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>
          <div className="flex items-center">
            <Button 
              variant="secondary" 
              className="mr-2"
              onClick={handleRefresh}
              startIcon={
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                </svg>
              }
            >
              Refresh
            </Button>
            <Button 
              variant="solar"
              onClick={handleExport}
              startIcon={
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              }
            >
              Export
            </Button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solar Cost (PHP/W)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MERALCO Rate (PHP/kWh)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROI (Years)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommended Regions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Energy Savings</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Best Energy Type</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <tr key={row.id} className="hover:bg-green-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.solarCost}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.meralcoRate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.estimatedROI}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.recommendedRegions}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.energySavings}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.bestEnergyType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      className="text-green-600 hover:text-green-900 mr-3"
                      onClick={() => onEditRecord?.(row)}
                    >
                      Edit
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDelete(row.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredData.length}</span> of <span className="font-medium">{filteredData.length}</span> records
        </div>
        <div className="flex items-center">
          <Button variant="secondary" className="mr-2" disabled>
            Previous
          </Button>
          <Button variant="secondary" disabled>
            Next
          </Button>
        </div>
      </div>
    </Card.Base>
  );
};

/**
 * Main SolarRecommendationsPage Component
 */
export const SolarRecommendationsPage = () => {
  const {
    recommendation,
    historicalData,
    loading,
    filteredData,
    isModalOpen,
    selectedRecord,
    setFilteredData,
    fetchRecommendation,
    fetchHistoricalData,
    filterDataByYearRange,
    openModal,
    closeModal,
    handleSaveRecommendation
  } = useRecommendationData();
  
  // Setup year picker
  const { 
    startYear, 
    endYear, 
    error: yearError, 
    handleStartYearChange, 
    handleEndYearChange, 
    handleReset 
  } = useYearPicker({
    initialStartYear: 2020,
    initialEndYear: 2023,
    onStartYearChange: () => {},
    onEndYearChange: () => {}
  });

  // Fetch historical data on component mount
  React.useEffect(() => {
    fetchHistoricalData();
  }, []);

  // Filter data based on year range
  React.useEffect(() => {
    if (dummyData.tableData) {
      const filtered = filterDataByYearRange(
        dummyData.tableData, 
        startYear, 
        endYear
      );
      setFilteredData(filtered);
    }
  }, [startYear, endYear]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-green-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Solar Investment Recommendations</h1>
            <p className="text-gray-500">Calculate ROI and get personalized recommendations for your solar investment</p>
          </div>
        </div>
        <Button
          variant="solar"
          startIcon={
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          }
          onClick={() => openModal()}
        >
          Add New Recommendation
        </Button>
      </div>

      {/* Recommendation Form */}
      <RecommendationForm onSubmit={fetchRecommendation} />

      {/* Results Section - Only shown when data is available */}
      {recommendation && (
        <>
          <RecommendationResults recommendation={recommendation} />
          <RecommendationCharts recommendation={recommendation} historicalData={historicalData} />
        </>
      )}

      {/* Year Range Filter Card */}
      <Card.Base className="mb-6 p-4">
        <div className="flex justify-between items-center">
          <div className="text-gray-700 font-medium">
            Filter Recommendations By Year Range
          </div>
          <div className="flex items-center gap-4">
            <YearPicker 
              startYear={startYear}
              endYear={endYear}
              onStartYearChange={handleStartYearChange}
              onEndYearChange={handleEndYearChange}
              onReset={handleReset}
              error={yearError}
              usingMockData={true}
            />
          </div>
        </div>
      </Card.Base>

      {/* Recommendation History */}
      <RecommendationHistory 
        filteredData={filteredData} 
        startYear={getYearValue(startYear)} 
        endYear={getYearValue(endYear)}
        onEditRecord={openModal}
      />

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onClose={closeModal} maxWidth="md" fullWidth>
        <DialogTitle className="flex justify-between items-center">
          <span className="text-lg font-medium">{selectedRecord.id ? 'Edit Recommendation' : 'Add New Recommendation'}</span>
          <IconButton onClick={closeModal} size="small">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box className="p-4 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <select className="border rounded-md p-2 w-full" value={selectedRecord.Year || new Date().getFullYear()}>
                <option value={2020}>2020</option>
                <option value={2021}>2021</option>
                <option value={2022}>2022</option>
                <option value={2023}>2023</option>
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
              </select>
            </div>
            
            {/* Input Parameters */}
            <div className="border p-4 rounded-md bg-gray-50">
              <h3 className="text-lg font-medium mb-4">Input Parameters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberBox
                  label="Solar Cost (PHP/W)"
                  value={selectedRecord["Solar Cost (PHP/W)"]}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="MERALCO Rate (PHP/kWh)"
                  value={selectedRecord["MERALCO Rate (PHP/kWh)"]}
                  placeholder="Enter value"
                />
              </div>
            </div>
            
            {/* Recommendation Summary */}
            <div className="border p-4 rounded-md">
              <h3 className="text-lg font-medium mb-4">Recommendation Summary</h3>
              <TextBox
                label="Summary"
                value={selectedRecord["Recommendation Summary"]}
                placeholder="Enter recommendation summary"
                multiline
                rows={4}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <TextBox
                  label="Recommended Panel Type"
                  value={selectedRecord["Recommended Panel Type"]}
                  placeholder="Enter panel type"
                />
                <TextBox
                  label="Recommended Regions"
                  value={selectedRecord["Recommended Regions"]}
                  placeholder="Enter regions"
                />
                <TextBox
                  label="Best Energy Type"
                  value={selectedRecord["Best Energy Type"]}
                  placeholder="Enter energy types"
                />
                <NumberBox
                  label="Estimated ROI (years)"
                  value={selectedRecord["Estimated ROI (years)"]}
                  placeholder="Enter value"
                />
              </div>
            </div>
            
            {/* Environmental Impact */}
            <div className="border p-4 rounded-md">
              <h3 className="text-lg font-medium mb-4">Environmental Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberBox
                  label="Carbon Reduction (tons)"
                  value={selectedRecord["Carbon Reduction (tons)"]}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Energy Savings (%)"
                  value={selectedRecord["Energy Savings (%)"]}
                  placeholder="Enter value"
                />
              </div>
            </div>
            
            {/* Technical Specifications */}
            <div className="border p-4 rounded-md">
              <h3 className="text-lg font-medium mb-4">Technical Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberBox
                  label="Optimal Panel Size (kW)"
                  value={selectedRecord["Optimal Panel Size (kW)"]}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Installation Cost (PHP)"
                  value={selectedRecord["Installation Cost (PHP)"]}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Annual Savings (PHP)"
                  value={selectedRecord["Annual Savings (PHP)"]}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Maintenance Cost (PHP/year)"
                  value={selectedRecord["Maintenance Cost (PHP/year)"]}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Grid Integration Cost (PHP)"
                  value={selectedRecord["Grid Integration Cost (PHP)"]}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Payback Period (years)"
                  value={selectedRecord["Payback Period (years)"]}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Energy Storage Required (kWh)"
                  value={selectedRecord["Energy Storage Required (kWh)"]}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Expected Lifespan (years)"
                  value={selectedRecord["Expected Lifespan (years)"]}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Performance Ratio (%)"
                  value={selectedRecord["Performance Ratio (%)"]}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Incentives Available (PHP)"
                  value={selectedRecord["Incentives Available (PHP)"]}
                  placeholder="Enter value"
                />
              </div>
            </div>
          </Box>
        </DialogContent>
        <DialogActions className="p-4">
          <Button
            variant="secondary"
            onClick={closeModal}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            variant="solar"
            onClick={handleSaveRecommendation}
          >
            {selectedRecord.id ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};