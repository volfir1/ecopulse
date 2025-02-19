import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Grid } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, ResponsiveContainer } from 'recharts';
import { p, s, t, bg, success } from '@shared/index';
import YearPicker from '@components/datepicker/YearPicker';
import dayjs from 'dayjs';

export default function DashboardContent() {
  // Use dayjs objects for the years instead of numbers
  const [startYear, setStartYear] = useState(dayjs().subtract(3, 'year'));
  const [endYear, setEndYear] = useState(dayjs());
  const [generationData, setGenerationData] = useState([]);
  const [consumptionData, setConsumptionData] = useState([]);
  const [costData, setCostData] = useState([]);
  const [predictedGeneration, setPredictedGeneration] = useState(0);
  const [predictedConsumption, setPredictedConsumption] = useState(0);
  const [costAverage, setCostAverage] = useState(0);

  // Handle year changes from the YearPicker
  const handleYearChange = (start, end) => {
    setStartYear(start);
    setEndYear(end);
  };

  useEffect(() => {
    // Get numerical year values for calculations
    const startYearNum = startYear.year();
    const endYearNum = endYear.year();
    
    // Generate data based on selected years
    const generateData = () => {
      // Scale factors based on year range
      const yearSpan = endYearNum - startYearNum + 1;
      const scaleFactor = 1 + (yearSpan * 0.1);
      
      // Generate generation data
      const newGenerationData = Array.from({ length: 100 }, (_, i) => ({
        date: `${startYearNum + Math.floor(i / (100 / yearSpan))}-${(i % 12) + 1}`,
        value: (0.5 + Math.random() * 0.5) * scaleFactor
      }));
      setGenerationData(newGenerationData);
      
      // Calculate predicted generation
      const predictedGen = Math.round(5000 * scaleFactor);
      setPredictedGeneration(predictedGen);
      
      // Generate consumption data
      const newConsumptionData = Array.from({ length: 7 }, (_, i) => {
        const baseValue = 3800 + Math.random() * 800;
        return {
          day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
          value: Math.round(baseValue * (1 + (yearSpan * 0.05)))
        };
      });
      setConsumptionData(newConsumptionData);
      
      // Calculate predicted consumption
      const predictedCons = Math.round(4200 * (1 + (yearSpan * 0.05)));
      setPredictedConsumption(predictedCons);
      
      // Generate cost data
      const newCostData = Array.from({ length: 8 }, (_, i) => {
        const baseValue = (i + 1) * 500;
        return {
          kw: `${(i + 1) * 4}kW`,
          value: Math.round(baseValue * (1 + (yearSpan * 0.08)))
        };
      });
      setCostData(newCostData);
      
      // Calculate cost average
      const avgCost = Math.round(3500 * (1 + (yearSpan * 0.06)));
      setCostAverage(avgCost);
    };
    
    generateData();
  }, [startYear, endYear]);

  return (
    <Box sx={{ 
      width: '100%', 
      height: '100%', 
      mt: 0,
      backgroundColor: bg.subtle,
      padding: 3
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <YearPicker 
          startYear={startYear}
          endYear={endYear}
          onYearChange={handleYearChange}
        />
      </Box>
      
      <Card sx={{ 
        mb: 4,
        backgroundColor: bg.paper,
        boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
      }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: t.main }}>
            Predicted Generation
          </Typography>
          <Typography variant="h4" sx={{ mb: 2, color: success.main }}>
            {predictedGeneration.toLocaleString()} kWh
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 1, color: t.secondary }}>
            Next 30 days • {startYear.format('YYYY')}-{endYear.format('YYYY')} projection
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={generationData}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={success.main} 
                fill={success.main} 
                fillOpacity={0.2} 
              />
              <XAxis 
                dataKey="date" 
                stroke={t.secondary}
                tickFormatter={(tick) => {
                  const parts = tick.split('-');
                  return parts.length > 1 ? `${parts[0]}-${parts[1]}` : tick;
                }}
              />
              <YAxis stroke={t.secondary} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: bg.paper,
                  borderColor: t.disabled,
                  color: t.main
                }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            height: '100%',
            backgroundColor: bg.paper,
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: t.main }}>
                Predicted Consumption
              </Typography>
              <Typography variant="h4" sx={{ mb: 2, color: p.main }}>
                {predictedConsumption.toLocaleString()} kWh
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={consumptionData}>
                  <Line type="monotone" dataKey="value" stroke={p.main} />
                  <XAxis dataKey="day" stroke={t.secondary} />
                  <YAxis stroke={t.secondary} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: bg.paper,
                      borderColor: t.disabled,
                      color: t.main
                    }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ 
            height: '100%',
            backgroundColor: bg.paper,
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: t.main }}>
                Cost Trends
              </Typography>
              <Typography variant="h4" sx={{ mb: 2, color: s.main }}>
                ₱{costAverage.toLocaleString()}/month average
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={costData}>
                  <Bar dataKey="value" fill={s.main} />
                  <XAxis dataKey="kw" stroke={t.secondary} />
                  <YAxis stroke={t.secondary} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: bg.paper,
                      borderColor: t.disabled,
                      color: t.main
                    }} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}