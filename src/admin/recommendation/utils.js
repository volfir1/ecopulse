// Utility functions for solar recommendations

// Format currency to PHP
export const formatCurrency = (value) => {
    if (typeof value === 'string') {
      return value; // Already formatted
    }
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(value);
  };
  
  // Generate year options from minYear to maxYear
  export const generateYearOptions = (minYear = 2020, maxYear = 2030) => {
    const years = [];
    for (let year = minYear; year <= maxYear; year++) {
      years.push(year);
    }
    return years;
  };
  
  // Extract year value safely from dayjs object
  export const getYearValue = (dayjsObj) => {
    return dayjsObj && typeof dayjsObj.year === 'function' ? dayjsObj.year() : new Date().getFullYear();
  };
  
  // Generate ROI projection data
  export const generateRoiData = (year, roiYears, yearlySavings, initialInvestment) => {
    const roiData = [];
    
    for (let i = 0; i < 10; i++) {
      const yearNum = parseInt(year) + i;
      const investment = i === 0 ? initialInvestment : 0; // Initial investment in year 0
      const yearlySavingsAmount = yearlySavings;
      const cumulativeSavings = yearlySavingsAmount * (i + 1);
      const netReturn = cumulativeSavings - initialInvestment;
      
      roiData.push({
        year: yearNum,
        investment: i === 0 ? initialInvestment : 0,
        savings: yearlySavingsAmount,
        cumulativeSavings: cumulativeSavings,
        netReturn: netReturn
      });
    }
    
    return roiData;
  };
  
  // Generate energy production data - monthly breakdown
  export const generateEnergyData = (yearlyProduction, yearlySavings) => {
    const energyData = [];
    // Monthly production factors (higher in summer months, lower in rainy season)
    const monthlyFactors = [0.7, 0.8, 0.9, 1.1, 1.2, 1.1, 0.9, 0.8, 0.9, 1.0, 1.0, 0.9];
    
    for (let i = 0; i < 12; i++) {
      const monthName = new Date(0, i).toLocaleString('default', { month: 'short' });
      energyData.push({
        month: monthName,
        energy: (yearlyProduction / 12) * monthlyFactors[i],
        savings: (yearlySavings / 12) * monthlyFactors[i]
      });
    }
    
    return energyData;
  };
  
  // Generate carbon offset data
  export const generateCarbonData = (year, yearlyProduction) => {
    // Assuming 0.5 kg CO2 offset per kWh of solar energy
    const carbonOffsetPerKWh = 0.5; // kg
    const carbonData = [];
    
    for (let i = 0; i < 10; i++) {
      const yearNum = parseInt(year) + i;
      carbonData.push({
        year: yearNum,
        carbonOffset: (yearlyProduction * carbonOffsetPerKWh) / 1000, // convert to tons
        cumulativeOffset: (yearlyProduction * carbonOffsetPerKWh * (i + 1)) / 1000
      });
    }
    
    return carbonData;
  };
  
  // Extract ROI values from recommendation data
  export const extractRoiValues = (recommendation) => {
    if (!recommendation) return { roiYears: 0, yearlyProduction: 0, yearlySavings: 0 };
    
    const { cost_benefit_analysis } = recommendation;
    
    // Extract ROI years as a number
    const roiYears = parseFloat(cost_benefit_analysis[2].value.split(' ')[0]);
    
    // Extract yearly production
    const yearlyProduction = parseFloat(cost_benefit_analysis[0].value.split(' ')[0].replace(',', ''));
    
    // Extract yearly savings
    const yearlySavings = parseFloat(cost_benefit_analysis[1].value.split(' ')[1].replace(',', ''));
    
    return {
      roiYears,
      yearlyProduction,
      yearlySavings
    };
  };
  
  // Generate chart colors
  export const chartColors = {
    financial: {
      ROI: '#3b82f6', // Blue
      PaybackPeriod: '#10b981', // Green
      SolarCost: '#f59e0b' // Amber
    },
    years: {
      "2020": '#c026d3', // Purple
      "2021": '#2563eb', // Blue
      "2022": '#059669', // Green
      "2023": '#d97706', // Orange
      "2024": '#dc2626', // Red
      "2025": '#7c3aed', // Indigo
      "2026": '#0891b2'  // Cyan
    },
    environmental: {
      Carbon: '#059669' // Green
    }
  };
  
  // Dummy data for development purposes
  export const dummyData = {
    // Recommendation data for admin
    recommendationDummyData: [
      {
        Year: 2022,
        "Solar Cost (PHP/W)": 52.0,
        "MERALCO Rate (PHP/kWh)": 9.8,
        "Recommendation Summary": "Solar energy is highly recommended for this year with excellent ROI driven by declining panel costs and rising utility rates. Invest in bifacial panels for optimal performance.",
        "Recommended Panel Type": "Bifacial Monocrystalline",
        "Recommended Regions": "Metro Manila, Calabarzon, Central Luzon",
        "Best Energy Type": "Solar PV",
        "Estimated ROI (years)": 4.8,
        "Carbon Reduction (tons)": 12.5,
        "Energy Savings (%)": 38,
        "Optimal Panel Size (kW)": 5.2,
        "Installation Cost (PHP)": 270400,
        "Annual Savings (PHP)": 56340,
        "Maintenance Cost (PHP/year)": 2704,
        "Payback Period (years)": 4.8,
        "Grid Integration Cost (PHP)": 15000,
        "Energy Storage Required (kWh)": 10,
        "Expected Lifespan (years)": 25,
        "Performance Ratio (%)": 80,
        "Incentives Available (PHP)": 27040
      }
    ],
    
    // Table data for recommendation history
    tableData: [
      {
        id: 1,
        year: 2020,
        solarCost: '65.0 PHP/W',
        meralcoRate: '8.5 PHP/kWh',
        estimatedROI: '6.2 years',
        recommendedRegions: 'Luzon, Visayas',
        energySavings: '30%',
        bestEnergyType: 'Solar PV (Monocrystalline)'
      },
      {
        id: 2,
        year: 2021,
        solarCost: '58.5 PHP/W',
        meralcoRate: '9.1 PHP/kWh',
        estimatedROI: '5.5 years',
        recommendedRegions: 'Luzon, Visayas, Mindanao',
        energySavings: '35%',
        bestEnergyType: 'Solar PV (Monocrystalline)'
      },
      {
        id: 3,
        year: 2022,
        solarCost: '52.0 PHP/W',
        meralcoRate: '9.8 PHP/kWh',
        estimatedROI: '4.8 years',
        recommendedRegions: 'All Regions',
        energySavings: '38%',
        bestEnergyType: 'Solar PV (Bifacial)'
      },
      {
        id: 4,
        year: 2023,
        solarCost: '48.5 PHP/W',
        meralcoRate: '10.3 PHP/kWh',
        estimatedROI: '4.2 years',
        recommendedRegions: 'All Regions',
        energySavings: '42%',
        bestEnergyType: 'Solar PV (Bifacial)'
      }
    ],
    
    // Chart data
    chartData: {
      roiAnalysis: [
        { name: '2020', ROI: 6.2, PaybackPeriod: 6.2, SolarCost: 65.0 },
        { name: '2021', ROI: 5.5, PaybackPeriod: 5.5, SolarCost: 58.5 },
        { name: '2022', ROI: 4.8, PaybackPeriod: 4.8, SolarCost: 52.0 },
        { name: '2023', ROI: 4.2, PaybackPeriod: 4.2, SolarCost: 48.5 },
        { name: '2024', ROI: 3.8, PaybackPeriod: 3.8, SolarCost: 45.0 },
        { name: '2025', ROI: 3.5, PaybackPeriod: 3.5, SolarCost: 42.0 }
      ],
      energySavings: [
        { name: 'Metro Manila', '2020': 30, '2021': 35, '2022': 38, '2023': 42 },
        { name: 'Calabarzon', '2020': 32, '2021': 36, '2022': 40, '2023': 44 },
        { name: 'Central Luzon', '2020': 31, '2021': 34, '2022': 39, '2023': 43 },
        { name: 'Western Visayas', '2020': 28, '2021': 33, '2022': 36, '2023': 40 }
      ],
      carbonImpact: [
        { name: '2020', Carbon: 10.2 },
        { name: '2021', Carbon: 11.5 },
        { name: '2022', Carbon: 12.5 },
        { name: '2023', Carbon: 13.8 },
        { name: '2024', Carbon: 14.5 },
        { name: '2025', Carbon: 15.2 }
      ]
    }
  };