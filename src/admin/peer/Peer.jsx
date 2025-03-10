import React, { useState, useCallback } from 'react';
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
  ResponsiveContainer 
} from 'recharts';

// Import dummy data
import { 
  peerToPeerDummyData, 
  tableData, 
  chartData, 
  chartColors 
} from './dummyData';

import {
  SingleYearPicker,
} from '@shared/index';

// Prototype only - this would normally be imported
const Button = ({ children, className, variant, onClick }) => (
  <button 
    className={`px-4 py-2 rounded-md font-medium ${
      variant === 'primary' 
        ? 'bg-blue-500 text-white hover:bg-blue-600' 
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

const PeerToPeerAdminPrototype = () => {
  // State for modal, tabs, and form data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedRecord, setSelectedRecord] = useState(peerToPeerDummyData[0]);
  const [startYear, setStartYear] = useState(2020);
  const [endYear, setEndYear] = useState(2023);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  //Cebu 
  const [cebuTotalPowerGeneration, setCebuTotalPowerGeneration] = useState('');
  const [cebuNonRenewableGeneration, setCebuNonRenewableGeneration] = useState('');
  const [cebuRenewableGeneration, setCebuRenewableGeneration] = useState('');
  const [cebuGeothermal, setCebuGeothermal] = useState('');
  const [cebuHydro, setCebuHydro] = useState('');
  const [cebuBiomass, setCebuBiomass] = useState('');
  const [cebuSolar, setCebuSolar] = useState('');
  const [cebuWind, setCebuWind] = useState('');

  //Negros
  const [negrosTotalPowerGeneration, setNegrosTotalPowerGeneration] = useState('');
  const [negrosNonRenewableGeneration, setNegrosNonRenewableGeneration] = useState('');
  const [negrosRenewableGeneration, setNegrosRenewableGeneration] = useState('');
  const [negrosGeothermal, setNegrosGeothermal] = useState('');
  const [negrosHydro, setNegrosHydro] = useState('');
  const [negrosBiomass, setNegrosBiomass] = useState('');
  const [negrosSolar, setNegrosSolar] = useState('');
  const [negrosWind, setNegrosWind] = useState('');

  //Panay
  const [panayTotalPowerGeneration, setPanayTotalPowerGeneration] = useState('');
  const [panayNonRenewableGeneration, setPanayNonRenewableGeneration] = useState('');
  const [panayRenewableGeneration, setPanayRenewableGeneration] = useState('');
  const [panayGeothermal, setPanayGeothermal] = useState('');
  const [panayHydro, setPanayHydro] = useState('');
  const [panayBiomass, setPanayBiomass] = useState('');
  const [panaySolar, setPanaySolar] = useState('');
  const [panayWind, setPanayWind] = useState('');

  //Leyte-Samar
  const [leyteSamarTotalPowerGeneration, setLeyteSamarTotalPowerGeneration] = useState('');
  const [leyteSamarNonRenewableGeneration, setLeyteSamarNonRenewableGeneration] = useState('');
  const [leyteSamarRenewableGeneration, setLeyteSamarRenewableGeneration] = useState('');
  const [leyteSamarGeothermal, setLeyteSamarGeothermal] = useState('');
  const [leyteSamarHydro, setLeyteSamarHydro] = useState('');
  const [leyteSamarBiomass, setLeyteSamarBiomass] = useState('');
  const [leyteSamarSolar, setLeyteSamarSolar] = useState('');
  const [leyteSamarWind, setLeyteSamarWind] = useState('');

  //Bohol
  const [boholTotalPowerGeneration, setBoholTotalPowerGeneration] = useState('');
  const [boholNonRenewableGeneration, setBoholNonRenewableGeneration] = useState('');
  const [boholRenewableGeneration, setBoholRenewableGeneration] = useState('');
  const [boholGeothermal, setBoholGeothermal] = useState('');
  const [boholHydro, setBoholHydro] = useState('');
  const [boholBiomass, setBoholBiomass] = useState('');
  const [boholSolar, setBoholSolar] = useState('');
  const [boholWind, setBoholWind] = useState('');

  //Visayas
  const [visayasTotalPowerGeneration, setVisayasTotalPowerGeneration] = useState('');
  const [visayasTotalPowerConsumption, setVisayasTotalPowerConsumption] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  
  // Mock functions
  const openModal = (record = peerToPeerDummyData[0]) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleOpenAddModal = useCallback(() => {
    setIsEditing(false);
    setCebuTotalPowerGeneration('');
    setCebuNonRenewableGeneration('');
    setCebuRenewableGeneration('');
    setCebuGeothermal('');
    setCebuHydro('');
    setCebuBiomass('');
    setCebuSolar('');
    setCebuWind('');
    //Negros
    setNegrosTotalPowerGeneration('');
    setNegrosNonRenewableGeneration('');
    setNegrosRenewableGeneration('');
    setNegrosGeothermal('');
    setNegrosHydro('');
    setNegrosBiomass('');
    setNegrosSolar('');
    setNegrosWind('');
    setSelectedYear(new Date().getFullYear());
    // setSelectedYear(new Date().getFullYear());
    // setGenerationValue('');
    // setNonRenewableEnergy('');
    // setPopulation('');
    // setGdp('');
    setIsModalOpen(true);
  }, []);  

  //Visayas
  const handleVisayasTotalPowerGenerationChange = useCallback((event) => {
    setVisayasTotalPowerGeneration(event.target.value);
  }, []);
  const handleVisayasTotalPowerConsumptionChange = useCallback((event) => {
    setVisayasTotalPowerConsumption(event.target.value);
  }, []);
  //Cebu
  const handleCebuTotalPowerGenerationChange = useCallback((event) => {
    setCebuTotalPowerGeneration(event.target.value);
  }, []);
  const handleCebuNonRenewableGenerationChange = useCallback((event) => {
    setCebuNonRenewableGeneration(event.target.value);
  }, []);
  const handleCebuRenewableGenerationChange = useCallback((event) => {
    setCebuRenewableGeneration(event.target.value);
  }, []);
  const handleCebuGeothermalChange = useCallback((event) => {
    setCebuWind(event.target.value);
  }, []);
  const handleCebuHydroChange = useCallback((event) => {
    setCebuHydro(event.target.value);
  }, []);
  const handleCebuBiomassChange = useCallback((event) => {
    setCebuBiomass(event.target.value);
  }, []);
  const handleCebuSolarChange = useCallback((event) => {
    setCebuSolar(event.target.value);
  }, []);
  const handleCebuWindChange = useCallback((event) => {
    setCebuWind(event.target.value);
  }, []);

  //Negros
  const handleNegrosTotalPowerGenerationChange = useCallback((event) => {
    setNegrosTotalPowerGeneration(event.target.value);
  }, []);
  const handleNegrosNonRenewableGenerationChange = useCallback((event) => {
    setNegrosNonRenewableGeneration(event.target.value);
  }, []);
  const handleNegrosRenewableGenerationChange = useCallback((event) => {
    setNegrosRenewableGeneration(event.target.value);
  }, []);
  const handleNegrosGeothermalChange = useCallback((event) => {
    setNegrosGeothermal(event.target.value);
  }, []);
  const handleNegrosHydroChange = useCallback((event) => {
    setNegrosHydro(event.target.value);
  }, []);
  const handleNegrosBiomassChange = useCallback((event) => {
    setNegrosBiomass(event.target.value);
  }, []);
  const handleNegrosSolarChange = useCallback((event) => {
    setNegrosSolar(event.target.value);
  }, []);
  const handleNegrosWindChange = useCallback((event) => {
    setNegrosWind(event.target.value);
  }, []);

  //Panay
  const handlePanayTotalPowerGenerationChange = useCallback((event) => {
    setPanayTotalPowerGeneration(event.target.value);
  }, []);
  const handlePanayNonRenewableGenerationChange = useCallback((event) => {
    setPanayNonRenewableGeneration(event.target.value);
  }, []);
  const handlePanayRenewableGenerationChange = useCallback((event) => {
    setPanayRenewableGeneration(event.target.value);
  }, []);
  const handlePanayGeothermalChange = useCallback((event) => {
    setPanayGeothermal(event.target.value);
  }, []);
  const handlePanayHydroChange = useCallback((event) => {
    setPanayHydro(event.target.value);
  }, []);
  const handlePanayBiomassChange = useCallback((event) => {
    setPanayBiomass(event.target.value);
  }, []);
  const handlePanaySolarChange = useCallback((event) => {
    setPanaySolar(event.target.value);
  }, []);
  const handlePanayWindChange = useCallback((event) => {
    setPanayWind(event.target.value);
  }, []);

  //Leyte-Samar
  const handleLeyteSamarTotalPowerGenerationChange = useCallback((event) => {
    setLeyteSamarTotalPowerGeneration(event.target.value);
  }, []);
  const handleLeyteSamarNonRenewableGenerationChange = useCallback((event) => {
    setLeyteSamarNonRenewableGeneration(event.target.value);
  }, []);
  const handleLeyteSamarRenewableGenerationChange = useCallback((event) => {
    setLeyteSamarRenewableGeneration(event.target.value);
  }, []);
  const handleLeyteSamarGeothermalChange = useCallback((event) => {
    setLeyteSamarGeothermal(event.target.value);
  }, []);
  const handleLeyteSamarHydroChange = useCallback((event) => {
    setLeyteSamarHydro(event.target.value);
  }, []);
  const handleLeyteSamarBiomassChange = useCallback((event) => {
    setLeyteSamarBiomass(event.target.value);
  }, []);
  const handleLeyteSamarSolarChange = useCallback((event) => {
    setLeyteSamarSolar(event.target.value);
  }, []);
  const handleLeyteSamarWindChange = useCallback((event) => {
    setLeyteSamarWind(event.target.value);
  }, []);

  //Bohol
  const handleBoholTotalPowerGenerationChange = useCallback((event) => {
    setBoholTotalPowerGeneration(event.target.value);
  }, []);
  const handleBoholNonRenewableGenerationChange = useCallback((event) => {
    setBoholNonRenewableGeneration(event.target.value);
  }, []);
  const handleBoholRenewableGenerationChange = useCallback((event) => {
    setBoholRenewableGeneration(event.target.value);
  }, []);
  const handleBoholGeothermalChange = useCallback((event) => {
    setBoholGeothermal(event.target.value);
  }, []);
  const handleBoholHydroChange = useCallback((event) => {
    setBoholHydro(event.target.value);
  }, []);
  const handleBoholBiomassChange = useCallback((event) => {
    setBoholBiomass(event.target.value);
  }, []);
  const handleBoholSolarChange = useCallback((event) => {
    setBoholSolar(event.target.value);
  }, []);
  const handleBoholWindChange = useCallback((event) => {
    setBoholWind(event.target.value);
  }, []);

  const closeModal = () => setIsModalOpen(false);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleYearChange = useCallback((year) => {
    setSelectedYear(year);
  }, []);  

  // Function to render the appropriate chart based on active tab
  const renderChart = () => {
    switch(activeTab) {
      case 0: // Regional Overview
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData.regionalOverview}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Power Generation (GWh)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Cebu" stroke={chartColors.regions.Cebu} strokeWidth={2} />
              <Line type="monotone" dataKey="Negros" stroke={chartColors.regions.Negros} strokeWidth={2} />
              <Line type="monotone" dataKey="Panay" stroke={chartColors.regions.Panay} strokeWidth={2} />
              <Line type="monotone" dataKey="Leyte-Samar" stroke={chartColors.regions["Leyte-Samar"]} strokeWidth={2} />
              <Line type="monotone" dataKey="Bohol" stroke={chartColors.regions.Bohol} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 1: // Renewable vs Non-Renewable
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData.renewableVsNonRenewable}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Power Generation (GWh)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Renewable" stackId="a" fill={chartColors.energyTypes.Renewable} />
              <Bar dataKey="NonRenewable" stackId="a" fill={chartColors.energyTypes.NonRenewable} />
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 2: // Solar Distribution
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData.solarDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Solar Generation (GWh)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Solar" fill={chartColors.energyTypes.Solar} />
            </BarChart>
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Peer-to-Peer Energy Data</h1>
            <p className="text-gray-500">Manage regional energy generation and consumption data</p>
          </div>
        </div>
        <Button
          variant="primary"
          className="flex items-center gap-2"
          onClick={handleOpenAddModal}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add New Record
        </Button>
      </div>

      {/* Year Range Filter Card */}
      <Card className="mb-6 p-4">
        <div className="flex justify-between items-center">
          <div className="text-gray-700 font-medium">
            Filter Data By Year Range
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

      {/* Chart Section */}
      <Card className="mb-6 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="chart tabs">
            <Tab label="Regional Overview" />
            <Tab label="Renewable vs Non-Renewable" />
            <Tab label="Solar Distribution" />
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

      {/* Data Table */}
      <Card className="mb-6">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Peer-to-Peer Energy Records ({startYear} - {endYear})</h2>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cebu Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Negros Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Panay Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leyte-Samar Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bohol Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visayas Total</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((row) => (
                <tr key={row.id} className="hover:bg-blue-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.cebuTotal}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.negrosTotal}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.panayTotal}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.leyteSamarTotal}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.boholTotal}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.visayasTotal}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      onClick={() => {
                        const record = peerToPeerDummyData.find(item => item.Year === row.year);
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
          <span className="text-lg font-medium">{selectedRecord.id ? 'Edit Record' : 'Add New Record'}</span>
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
              <SingleYearPicker
                             initialYear={selectedYear}
                             onYearChange={handleYearChange}
                           />
            </div>
            
            {/* Cebu Section */}
            <div className="border p-4 rounded-md">
              <h3 className="text-lg font-medium mb-4">Cebu</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberBox
                  label="Total Power Generation (GWh)"
                  value={cebuTotalPowerGeneration}
                  onChange={handleCebuTotalPowerGenerationChange}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Total Non-Renewable Energy (GWh)"
                  value={cebuNonRenewableGeneration}
                  onChange={handleCebuNonRenewableGenerationChange}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Total Renewable Energy (GWh)"
                  value={cebuRenewableGeneration}
                  onChange={handleCebuRenewableGenerationChange}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Geothermal (GWh)"
                  value={cebuGeothermal}
                  onChange={handleCebuGeothermalChange}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Hydro (GWh)"
                  value={cebuHydro}
                  onChange={handleCebuHydroChange}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Biomass (GWh)"
                  value={cebuBiomass}
                  onChange={handleCebuBiomassChange}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Solar (GWh)"
                  value={cebuSolar}
                  onChange={handleCebuSolarChange}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Wind (GWh)"
                  value={cebuWind}
                  onChange={handleCebuWindChange}
                  placeholder="Enter value"
                />
              </div>
            </div>
            
            {/* Negros Section */}
            <div className="border p-4 rounded-md">
              <h3 className="text-lg font-medium mb-4">Negros</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NumberBox
                label="Total Power Generation (GWh)"
                value={negrosTotalPowerGeneration}
                onChange={handleNegrosTotalPowerGenerationChange}
                placeholder="Enter value"
              />
              <NumberBox
                label="Total Non-Renewable Energy (GWh)"
                value={negrosNonRenewableGeneration}
                onChange={handleNegrosNonRenewableGenerationChange}
                placeholder="Enter value"
              />
              <NumberBox
                label="Total Renewable Energy (GWh)"
                value={negrosRenewableGeneration}
                onChange={handleNegrosRenewableGenerationChange}
                placeholder="Enter value"
              />
              <NumberBox
                label="Geothermal (GWh)"
                value={negrosGeothermal}
                onChange={handleNegrosGeothermalChange}
                placeholder="Enter value"
              />
              <NumberBox
                label="Hydro (GWh)"
                value={negrosHydro}
                onChange={handleNegrosHydroChange}
                placeholder="Enter value"
              />
              <NumberBox
                label="Biomass (GWh)"
                value={negrosBiomass}
                onChange={handleNegrosBiomassChange}
                placeholder="Enter value"
              />
              <NumberBox
                label="Solar (GWh)"
                value={negrosSolar}
                onChange={handleNegrosSolarChange}
                placeholder="Enter value"
              />
              <NumberBox
                label="Wind (GWh)"
                value={negrosWind}
                onChange={handleNegrosWindChange}
                placeholder="Enter value"
              />
              </div>
            </div>
            
            {/* Panay Section */}
            <div className="border p-4 rounded-md">
              <h3 className="text-lg font-medium mb-4">Panay</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NumberBox
                label="Total Power Generation (GWh)"
                value={panayTotalPowerGeneration}
                onChange={handlePanayTotalPowerGenerationChange}
                placeholder="Enter value"
              />
              <NumberBox
                label="Total Non-Renewable Energy (GWh)"
                value={panayNonRenewableGeneration}
                onChange={handlePanayNonRenewableGenerationChange}
                placeholder="Enter value"
              />
              <NumberBox
                label="Total Renewable Energy (GWh)"
                value={panayRenewableGeneration}
                onChange={handlePanayRenewableGenerationChange}
                placeholder="Enter value"
              />
              <NumberBox
                label="Geothermal (GWh)"
                value={panayGeothermal}
                onChange={handlePanayGeothermalChange}
                placeholder="Enter value"
              />
              <NumberBox
                label="Hydro (GWh)"
                value={panayHydro}
                onChange={handlePanayHydroChange}
                placeholder="Enter value"
              />
              <NumberBox
                label="Biomass (GWh)"
                value={panayBiomass}
                onChange={handlePanayBiomassChange}
                placeholder="Enter value"
              />
              <NumberBox
                label="Solar (GWh)"
                value={panaySolar}
                onChange={handlePanaySolarChange}
                placeholder="Enter value"
              />
              <NumberBox
                label="Wind (GWh)"
                value={panayWind}
                onChange={handlePanayWindChange}
                placeholder="Enter value"
              />
              </div>
            </div>
            
            {/* Leyte-Samar Section */}
            <div className="border p-4 rounded-md">
              <h3 className="text-lg font-medium mb-4">Leyte-Samar</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NumberBox
                label="Total Power Generation (GWh)"
                value={leyteSamarTotalPowerGeneration}
                onChange={handleLeyteSamarTotalPowerGenerationChange}
                placeholder="Enter value"
              />
              <NumberBox
                label="Total Non-Renewable Energy (GWh)"
                value={leyteSamarNonRenewableGeneration}
                onChange={handleLeyteSamarNonRenewableGenerationChange}
                placeholder="Enter value"
              />
              <NumberBox
                label="Total Renewable Energy (GWh)"
                value={leyteSamarRenewableGeneration}
                onChange={handleLeyteSamarRenewableGenerationChange}
                placeholder="Enter value"
              />
              <NumberBox
                label="Geothermal (GWh)"
                value={leyteSamarGeothermal}
                onChange={handleLeyteSamarGeothermalChange}
                placeholder="Enter value"
              />
              <NumberBox
                label="Hydro (GWh)"
                value={leyteSamarHydro}
                onChange={handleLeyteSamarHydroChange}
                placeholder="Enter value"
              />
              <NumberBox
                label="Biomass (GWh)"
                value={leyteSamarBiomass}
                onChange={handleLeyteSamarBiomassChange}
                placeholder="Enter value"
              />
              <NumberBox
                label="Solar (GWh)"
                value={leyteSamarSolar}
                onChange={handleLeyteSamarSolarChange}
                placeholder="Enter value"
              />
              <NumberBox
                label="Wind (GWh)"
                value={leyteSamarWind}
                onChange={handleLeyteSamarWindChange}
                placeholder="Enter value"
              />
              </div>
            </div>
            
            {/* Bohol Section */}
            <div className="border p-4 rounded-md">
              <h3 className="text-lg font-medium mb-4">Bohol</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NumberBox
                label="Total Power Generation (GWh)"
                value={boholTotalPowerGeneration}
                onChange={handleBoholTotalPowerGenerationChange}
                placeholder="Enter value"
              />
              <NumberBox
                label="Total Non-Renewable Energy (GWh)"
                value={boholNonRenewableGeneration}
                onChange={handleBoholNonRenewableGenerationChange}
                placeholder="Enter value"
              />
              <NumberBox
                label="Total Renewable Energy (GWh)"
                value={boholRenewableGeneration}
                onChange={handleBoholRenewableGenerationChange}
                placeholder="Enter value"
              />
              <NumberBox
                label="Geothermal (GWh)"
                value={boholGeothermal}
                onChange={handleBoholGeothermalChange}
                placeholder="Enter value"
              />
              <NumberBox
                label="Hydro (GWh)"
                value={boholHydro}
                onChange={handleBoholHydroChange}
                placeholder="Enter value"
              />
              <NumberBox
                label="Biomass (GWh)"
                value={boholBiomass}
                onChange={handleBoholBiomassChange}
                placeholder="Enter value"
              />
              <NumberBox
                label="Solar (GWh)"
                value={boholSolar}
                onChange={handleBoholSolarChange}
                placeholder="Enter value"
              />
              <NumberBox
                label="Wind (GWh)"
                value={boholWind}
                onChange={handleBoholWindChange}
                placeholder="Enter value"
              />
              </div>
            </div>
            
            {/* Visayas Total */}
            <div className="border p-4 rounded-md bg-gray-50">
              <h3 className="text-lg font-medium mb-4">Visayas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberBox
                  label="Total Power Generation (GWh)"
                  value={visayasTotalPowerGeneration}
                  onChange={handleVisayasTotalPowerGenerationChange}
                  placeholder="Enter value"
                  disabled={true}
                />
                <NumberBox
                  label="Total Power Consumption (GWh)"
                  value={visayasTotalPowerConsumption}
                  onChange={handleVisayasTotalPowerConsumptionChange}
                  placeholder="Enter value"
                />
              </div>
            </div>
            
            {/* Recommendation Parameters */}
            <div className="border p-4 rounded-md bg-blue-50">
              <h3 className="text-lg font-medium mb-4">Recommendation Parameters</h3>
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

export default PeerToPeerAdminPrototype;