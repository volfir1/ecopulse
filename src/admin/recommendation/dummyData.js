// recommendationDummyData.js
// Comprehensive dummy data for Recommendation Admin prototype

// Sample data for multiple years
export const recommendationDummyData = [
    {
      id: "67c698036bbacc4b3abde3a1",
      Year: 2022,
      "Solar Cost (PHP/W)": 72,
      "MERALCO Rate (PHP/kWh)": 11,
      "Recommendation Summary": "Based on current data, solar installation is recommended for Negros and Leyte-Samar regions. The high renewable energy potential, especially in solar and geothermal, offers significant ROI opportunities.",
      "Recommended Panel Type": "Monocrystalline",
      "Estimated ROI (years)": 4.5,
      "Carbon Reduction (tons)": 850,
      "Energy Savings (%)": 32,
      "Optimal Panel Size (kW)": 5.5,
      "Installation Cost (PHP)": 396000,
      "Annual Savings (PHP)": 87600,
      "Maintenance Cost (PHP/year)": 3960,
      "Recommended Regions": "Negros, Leyte-Samar",
      "Best Energy Type": "Solar, Geothermal",
      "Grid Integration Cost (PHP)": 45000,
      "Payback Period (years)": 4.7,
      "Energy Storage Required (kWh)": 15,
      "Expected Lifespan (years)": 25,
      "Performance Ratio (%)": 80,
      "Incentives Available (PHP)": 25000
    },
    {
      id: "67c698036bbacc4b3abde3b2",
      Year: 2021,
      "Solar Cost (PHP/W)": 78,
      "MERALCO Rate (PHP/kWh)": 10.5,
      "Recommendation Summary": "Solar installation is economically viable only in Negros region. Other regions should consider alternative renewable sources or wait for solar costs to decrease.",
      "Recommended Panel Type": "Polycrystalline",
      "Estimated ROI (years)": 5.1,
      "Carbon Reduction (tons)": 720,
      "Energy Savings (%)": 29,
      "Optimal Panel Size (kW)": 5.0,
      "Installation Cost (PHP)": 390000,
      "Annual Savings (PHP)": 76500,
      "Maintenance Cost (PHP/year)": 3900,
      "Recommended Regions": "Negros",
      "Best Energy Type": "Solar",
      "Grid Integration Cost (PHP)": 50000,
      "Payback Period (years)": 5.3,
      "Energy Storage Required (kWh)": 12,
      "Expected Lifespan (years)": 24,
      "Performance Ratio (%)": 78,
      "Incentives Available (PHP)": 20000
    },
    {
      id: "67c698036bbacc4b3abde3c3",
      Year: 2020,
      "Solar Cost (PHP/W)": 85,
      "MERALCO Rate (PHP/kWh)": 10,
      "Recommendation Summary": "Solar installation is not economically recommended in any region due to high costs and longer payback periods. Focus should remain on geothermal and hydro resources.",
      "Recommended Panel Type": "Polycrystalline",
      "Estimated ROI (years)": 5.8,
      "Carbon Reduction (tons)": 580,
      "Energy Savings (%)": 25,
      "Optimal Panel Size (kW)": 4.5,
      "Installation Cost (PHP)": 382500,
      "Annual Savings (PHP)": 66000,
      "Maintenance Cost (PHP/year)": 3825,
      "Recommended Regions": "None",
      "Best Energy Type": "Geothermal, Hydro",
      "Grid Integration Cost (PHP)": 55000,
      "Payback Period (years)": 6.1,
      "Energy Storage Required (kWh)": 10,
      "Expected Lifespan (years)": 23,
      "Performance Ratio (%)": 75,
      "Incentives Available (PHP)": 15000
    },
    {
      id: "67c698036bbacc4b3abde3d4",
      Year: 2023,
      "Solar Cost (PHP/W)": 65,
      "MERALCO Rate (PHP/kWh)": 11.5,
      "Recommendation Summary": "Solar installation is highly recommended across all regions. Declining equipment costs and rising electricity rates create favorable conditions for renewable energy investment.",
      "Recommended Panel Type": "Monocrystalline (High-efficiency)",
      "Estimated ROI (years)": 3.8,
      "Carbon Reduction (tons)": 980,
      "Energy Savings (%)": 38,
      "Optimal Panel Size (kW)": 6.0,
      "Installation Cost (PHP)": 390000,
      "Annual Savings (PHP)": 102600,
      "Maintenance Cost (PHP/year)": 3900,
      "Recommended Regions": "All Regions",
      "Best Energy Type": "Solar, Wind",
      "Grid Integration Cost (PHP)": 40000,
      "Payback Period (years)": 4.0,
      "Energy Storage Required (kWh)": 18,
      "Expected Lifespan (years)": 27,
      "Performance Ratio (%)": 83,
      "Incentives Available (PHP)": 35000
    }
  ];
  
  // Simplified table data for the data grid
  export const tableData = recommendationDummyData.map(item => ({
    id: item.id,
    year: item.Year,
    solarCost: item["Solar Cost (PHP/W)"],
    meralcoRate: item["MERALCO Rate (PHP/kWh)"],
    estimatedROI: item["Estimated ROI (years)"],
    recommendedRegions: item["Recommended Regions"],
    energySavings: item["Energy Savings (%)"] + "%",
    bestEnergyType: item["Best Energy Type"],
    paybackPeriod: item["Payback Period (years)"]
  }));
  
  // Formatted chart data for different chart types
  export const chartData = {
    // ROI Analysis chart data
    roiAnalysis: [
      { 
        name: '2020', 
        ROI: 5.8, 
        PaybackPeriod: 6.1,
        SolarCost: 85
      },
      { 
        name: '2021', 
        ROI: 5.1, 
        PaybackPeriod: 5.3,
        SolarCost: 78
      },
      { 
        name: '2022', 
        ROI: 4.5, 
        PaybackPeriod: 4.7,
        SolarCost: 72
      },
      { 
        name: '2023', 
        ROI: 3.8, 
        PaybackPeriod: 4.0,
        SolarCost: 65
      }
    ],
    
    // Energy Savings chart data
    energySavings: [
      { 
        name: 'Cebu', 
        "2020": 20, 
        "2021": 25, 
        "2022": 28, 
        "2023": 35
      },
      { 
        name: 'Negros', 
        "2020": 25, 
        "2021": 29, 
        "2022": 32, 
        "2023": 38
      },
      { 
        name: 'Panay', 
        "2020": 22, 
        "2021": 26, 
        "2022": 30, 
        "2023": 36
      },
      { 
        name: 'Leyte-Samar', 
        "2020": 24, 
        "2021": 28, 
        "2022": 32, 
        "2023": 38
      },
      { 
        name: 'Bohol', 
        "2020": 18, 
        "2021": 22, 
        "2022": 25, 
        "2023": 32
      }
    ],
    
    // Carbon Impact chart data
    carbonImpact: [
      { name: '2020', Carbon: 580 },
      { name: '2021', Carbon: 720 },
      { name: '2022', Carbon: 850 },
      { name: '2023', Carbon: 980 }
    ],
    
    // Financial Overview chart data
    financialOverview: [
      { 
        name: '2020',
        InstallationCost: 382500,
        AnnualSavings: 66000,
        MaintenanceCost: 3825
      },
      { 
        name: '2021',
        InstallationCost: 390000,
        AnnualSavings: 76500,
        MaintenanceCost: 3900
      },
      { 
        name: '2022',
        InstallationCost: 396000,
        AnnualSavings: 87600,
        MaintenanceCost: 3960
      },
      { 
        name: '2023',
        InstallationCost: 390000,
        AnnualSavings: 102600,
        MaintenanceCost: 3900
      }
    ]
  };
  
  // Colors for charts
  export const chartColors = {
    financial: {
      ROI: '#4caf50',
      PaybackPeriod: '#f44336',
      SolarCost: '#2196f3',
      InstallationCost: '#ff9800',
      AnnualSavings: '#03a9f4',
      MaintenanceCost: '#9c27b0'
    },
    environmental: {
      Carbon: '#8bc34a',
      Energy: '#ffeb3b'
    },
    years: {
      "2020": '#e57373',
      "2021": '#81c784',
      "2022": '#64b5f6',
      "2023": '#ffb74d'
    }
  };