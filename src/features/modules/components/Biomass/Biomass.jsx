import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, AreaChart, Area, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Leaf } from 'lucide-react';
import { Button, Card, YearPicker, theme } from '@shared/index';

const Biomass = () => {
  // Get theme colors
  const { elements, text, background } = theme.palette;
  const { biomass } = elements;

  // Generate biomass-appropriate data patterns
  const generationData = Array.from({ length: 100 }, (_, i) => ({
    date: `2024-${String(i).padStart(2, '0')}`,
    value: 0.6 + Math.sin(i * 0.15) * 0.2 + Math.cos(i * 0.1) * 0.15 + Math.random() * 0.15
  }));

  const feedstockData = Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    agricultural: 2800 + Math.sin(i * 0.8) * 500 + Math.random() * 300,
    forestry: 2200 + Math.cos(i * 0.8) * 400 + Math.random() * 250
  }));

  const efficiencyData = Array.from({ length: 6 }, (_, i) => ({
    source: ['Wood', 'Crop', 'Waste', 'Biogas', 'Pellets', 'Other'][i],
    efficiency: 75 + Math.sin(i * 0.7) * 15 + Math.random() * 10,
    output: 2400 + Math.sin(i * 0.6) * 500 + Math.random() * 300
  }));

  return (
    <div className="p-6 bg-gray-50">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold flex items-center gap-2" style={{ color: biomass }}>
          <Leaf className="h-6 w-6" />
          Biomass Energy Analytics
        </h1>
        <div className="flex gap-4 items-center">
          <YearPicker />
          <Button 
            variant="biomass" 
            size="medium" 
            outlined
          >
            Feedstock Report
          </Button>
          <Button 
            variant="biomass" 
            size="medium"
          >
            Download Summary
          </Button>
        </div>
      </div>

      <Card variant="biomass" className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Biomass Power Generation</h2>
        <div className="text-3xl font-bold mb-1" style={{ color: biomass }}>3,800 MWh</div>
        <p className="text-gray-600 mb-4">Current month projection</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={generationData}>
              <defs>
                <linearGradient id="biomassGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={biomass} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={biomass} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                stroke={text.secondary}
              />
              <YAxis 
                stroke={text.secondary}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: background.paper,
                  borderRadius: '8px'
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={biomass}
                fill="url(#biomassGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        <Card variant="default">
          <h2 className="text-xl font-semibold mb-2">Feedstock Consumption</h2>
          <div className="text-2xl font-bold mb-4" style={{ color: biomass }}>5,200 tons monthly</div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={feedstockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="day" 
                stroke={text.secondary}
              />
              <YAxis 
                stroke={text.secondary}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: background.paper,
                  borderRadius: '8px'
                }}
              />
              <Line
                type="monotone"
                dataKey="agricultural"
                name="Agricultural"
                stroke={biomass}
                strokeWidth={2}
                dot={{ fill: biomass }}
              />
              <Line
                type="monotone"
                dataKey="forestry"
                name="Forestry"
                stroke={elements.wind}
                strokeWidth={2}
                dot={{ fill: elements.wind }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card variant="default">
          <h2 className="text-xl font-semibold mb-2">Source Efficiency</h2>
          <div className="text-2xl font-bold mb-4" style={{ color: biomass }}>82.3% conversion rate</div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={efficiencyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="source" 
                stroke={text.secondary}
              />
              <YAxis 
                stroke={text.secondary}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: background.paper,
                  borderRadius: '8px'
                }}
              />
              <Bar
                dataKey="efficiency"
                fill={biomass}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-6">
        <Card variant="default">
          <div className="text-xl font-semibold">Total Generation</div>
          <div className="text-3xl font-bold mt-2" style={{ color: biomass }}>95.2 MWh</div>
          <div className="text-sm text-gray-600">Monthly total</div>
        </Card>
        <Card variant="default">
          <div className="text-xl font-semibold">Feedstock Usage</div>
          <div className="text-3xl font-bold mt-2" style={{ color: biomass }}>5,200 tons</div>
          <div className="text-sm text-gray-600">Current stock</div>
        </Card>
        <Card variant="default">
          <div className="text-xl font-semibold">Conversion Rate</div>
          <div className="text-3xl font-bold mt-2" style={{ color: biomass }}>82.3%</div>
          <div className="text-sm text-gray-600">Average efficiency</div>
        </Card>
      </div>
    </div>
  );
};

export default Biomass;