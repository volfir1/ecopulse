import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  IconButton, 
  Box, 
  Tab, 
  Tabs
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

// Import dummy data
import { 
  recommendationDummyData, 
  tableData, 
  chartData, 
  chartColors 
} from './dummyData';

// Prototype only - this would normally be imported
const Button = ({ children, className, variant, onClick }) => (
  <button 
    className={`px-4 py-2 rounded-md font-medium ${
      variant === 'primary' 
        ? 'bg-green-500 text-white hover:bg-green-600' 
        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
    } ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

// Prototype only - this would normally be imported
const Card = ({ children, className }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>
    {children}
  </div>
);

// Prototype NumberBox component
const NumberBox = ({ label, value, placeholder, disabled }) => (
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
    />
  </div>
);

// Prototype TextBox component
const TextBox = ({ label, value, placeholder, multiline, rows, disabled }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {multiline ? (
      <textarea
        className={`border rounded-md p-2 w-full ${disabled ? 'bg-gray-100' : ''}`}
        placeholder={placeholder}
        value={value || ''}
        rows={rows || 3}
        disabled={disabled}
        readOnly={disabled}
      />
    ) : (
      <input
        type="text"
        className={`border rounded-md p-2 w-full ${disabled ? 'bg-gray-100' : ''}`}
        placeholder={placeholder}
        value={value || ''}
        disabled={disabled}
        readOnly={disabled}
      />
    )}
  </div>
);

const RecommendationAdminPrototype = () => {
  // State for modal, tabs, and form data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedRecord, setSelectedRecord] = useState(recommendationDummyData[0]);
  const [startYear, setStartYear] = useState(2020);
  const [endYear, setEndYear] = useState(2023);
  
  // Mock functions
  const openModal = (record = recommendationDummyData[0]) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };
  
  const closeModal = () => setIsModalOpen(false);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Function to render the appropriate chart based on active tab
  const renderChart = () => {
    switch(activeTab) {
      case 0: // ROI Analysis
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData.roiAnalysis}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" label={{ value: 'Years', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Cost (PHP/W)', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="ROI" name="ROI (years)" stroke={chartColors.financial.ROI} strokeWidth={2} />
              <Line yAxisId="left" type="monotone" dataKey="PaybackPeriod" name="Payback Period (years)" stroke={chartColors.financial.PaybackPeriod} strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="SolarCost" name="Solar Cost (PHP/W)" stroke={chartColors.financial.SolarCost} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 1: // Energy Savings
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData.energySavings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Energy Savings (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="2020" name="2020" fill={chartColors.years["2020"]} />
              <Bar dataKey="2021" name="2021" fill={chartColors.years["2021"]} />
              <Bar dataKey="2022" name="2022" fill={chartColors.years["2022"]} />
              <Bar dataKey="2023" name="2023" fill={chartColors.years["2023"]} />
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 2: // Carbon Impact
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData.carbonImpact}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Carbon Reduction (tons)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="Carbon" fill={chartColors.environmental.Carbon} stroke={chartColors.environmental.Carbon} />
            </AreaChart>
          </ResponsiveContainer>
        );
        
      default:
        return null;
    }
  };

  // Filter data based on year range
  const filteredData = tableData.filter(item => 
    item.year >= startYear && item.year <= endYear
  );

  // Get current recommendation for summary section
  const currentYearData = recommendationDummyData.find(item => item.Year === 2022);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-green-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Energy Recommendations</h1>
            <p className="text-gray-500">Generate and manage energy recommendations based on regional data</p>
          </div>
        </div>
        <Button
          variant="primary"
          className="flex items-center gap-2"
          onClick={() => openModal()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add New Recommendation
        </Button>
      </div>

      {/* Year Range Filter Card */}
      <Card className="mb-6 p-4">
        <div className="flex justify-between items-center">
          <div className="text-gray-700 font-medium">
            Filter Recommendations By Year Range
          </div>
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Year</label>
              <select 
                className="border rounded-md p-2"
                value={startYear}
                onChange={(e) => setStartYear(parseInt(e.target.value))}
              >
                <option value={2020}>2020</option>
                <option value={2021}>2021</option>
                <option value={2022}>2022</option>
                <option value={2023}>2023</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Year</label>
              <select 
                className="border rounded-md p-2"
                value={endYear}
                onChange={(e) => setEndYear(parseInt(e.target.value))}
              >
                <option value={2020}>2020</option>
                <option value={2021}>2021</option>
                <option value={2022}>2022</option>
                <option value={2023}>2023</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Charts Section */}
      <Card className="mb-6 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="chart tabs">
            <Tab label="ROI Analysis" />
            <Tab label="Energy Savings" />
            <Tab label="Carbon Impact" />
          </Tabs>
        </div>
        <div className="p-6 h-96">
          {renderChart()}
        </div>
        <div className="flex justify-end p-4 border-t border-gray-200">
          <Button
            variant="secondary"
            className="flex items-center gap-2 mr-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download Chart
          </Button>
          <Button
            variant="primary"
            className="flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Export to PDF
          </Button>
        </div>
      </Card>

      {/* Recommendations Summary Card */}
      <Card className="mb-6">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Current Recommendation Summary</h2>
        </div>
        <div className="p-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-medium text-green-800 mb-2">Recommendation for {currentYearData.Year}</h3>
            <p className="text-gray-700">{currentYearData["Recommendation Summary"]}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-gray-700 mb-2">Return on Investment</h4>
              <div className="flex items-end">
                <span className="text-2xl font-bold text-green-600">{currentYearData["Estimated ROI (years)"]}</span>
                <span className="ml-1 text-gray-600">years</span>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-gray-700 mb-2">Energy Savings</h4>
              <div className="flex items-end">
                <span className="text-2xl font-bold text-green-600">{currentYearData["Energy Savings (%)"]}</span>
                <span className="ml-1 text-gray-600">%</span>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-gray-700 mb-2">Carbon Reduction</h4>
              <div className="flex items-end">
                <span className="text-2xl font-bold text-green-600">{currentYearData["Carbon Reduction (tons)"]}</span>
                <span className="ml-1 text-gray-600">tons</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-4">
              <h4 className="font-medium text-gray-700 mb-3">Technical Details</h4>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-600">Recommended Panel Type:</span>
                  <span className="font-medium">{currentYearData["Recommended Panel Type"]}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Optimal Panel Size:</span>
                  <span className="font-medium">{currentYearData["Optimal Panel Size (kW)"]} kW</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Solar Cost:</span>
                  <span className="font-medium">{currentYearData["Solar Cost (PHP/W)"]} PHP/W</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">MERALCO Rate:</span>
                  <span className="font-medium">{currentYearData["MERALCO Rate (PHP/kWh)"]} PHP/kWh</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Energy Storage Required:</span>
                  <span className="font-medium">{currentYearData["Energy Storage Required (kWh)"]} kWh</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Expected Lifespan:</span>
                  <span className="font-medium">{currentYearData["Expected Lifespan (years)"]} years</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Performance Ratio:</span>
                  <span className="font-medium">{currentYearData["Performance Ratio (%)"]}%</span>
                </li>
              </ul>
            </div>
            <div className="border rounded-md p-4">
              <h4 className="font-medium text-gray-700 mb-3">Financial Overview</h4>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-600">Installation Cost:</span>
                  <span className="font-medium">{currentYearData["Installation Cost (PHP)"].toLocaleString()} PHP</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Annual Savings:</span>
                  <span className="font-medium">{currentYearData["Annual Savings (PHP)"].toLocaleString()} PHP</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Maintenance Cost:</span>
                  <span className="font-medium">{currentYearData["Maintenance Cost (PHP/year)"].toLocaleString()} PHP/year</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Payback Period:</span>
                  <span className="font-medium">{currentYearData["Payback Period (years)"]} years</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Grid Integration Cost:</span>
                  <span className="font-medium">{currentYearData["Grid Integration Cost (PHP)"].toLocaleString()} PHP</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Incentives Available:</span>
                  <span className="font-medium">{currentYearData["Incentives Available (PHP)"].toLocaleString()} PHP</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Recommended Regions:</span>
                  <span className="font-medium">{currentYearData["Recommended Regions"]}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Data Table */}
      <Card className="mb-6">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Recommendation History ({startYear} - {endYear})</h2>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center">
              <input type="text" placeholder="Search records..." className="border rounded-md p-2 mr-2" />
              <Button variant="secondary" className="mr-2">
                Search
              </Button>
            </div>
            <div className="flex items-center">
              <Button variant="secondary" className="mr-2">
                Refresh
              </Button>
              <Button variant="primary">
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
              {filteredData.map((row) => (
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
                      onClick={() => {
                        const record = recommendationDummyData.find(item => item.Year === row.year);
                        openModal(record);
                      }}
                    >
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
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
      </Card>

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
              <select className="border rounded-md p-2 w-full" value={selectedRecord.Year}>
                <option value={2020}>2020</option>
                <option value={2021}>2021</option>
                <option value={2022}>2022</option>
                <option value={2023}>2023</option>
                <option value={2024}>2024</option>
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
            variant="primary"
            onClick={closeModal}
          >
            {selectedRecord.id ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RecommendationAdminPrototype;