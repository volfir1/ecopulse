import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, AreaChart, Area, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Thermometer } from 'lucide-react';
import { Button, Card, theme, YearPicker } from '@shared/index';

const Geothermal = () => {
  // Destructure theme values
  const { elements, text, background, divider } = theme.palette;
  const { geothermal, solar } = elements;
  
  // Generate geothermal-specific data patterns (more stable than other renewables)
  const generationData = Array.from({ length: 24 }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    output: 0.8 + Math.sin(i * 0.08) * 0.1 + Math.random() * 0.1 // Very stable output
  }));

  const temperatureData = Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    surface: 150 + Math.sin(i * 0.5) * 10 + Math.random() * 5,
    deep: 280 + Math.sin(i * 0.3) * 5 + Math.random() * 3
  }));

  const wellPerformance = Array.from({ length: 6 }, (_, i) => ({
    well: `Well ${i + 1}`,
    pressure: 85 + Math.sin(i * 0.7) * 10 + Math.random() * 5,
    output: 2600 + Math.sin(i * 0.6) * 300 + Math.random() * 200
  }));

  return (
    <div className="p-6 bg-gray-50">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold flex items-center gap-2" style={{ color: geothermal }}>
          <Thermometer className="h-6 w-6" />
          Geothermal Energy Analytics
        </h1>
        <div className="flex gap-4 items-center">
          <YearPicker />
          <Button variant="geothermal" size="medium" outlined>
            Well Report
          </Button>
          <Button variant="geothermal" size="medium">
            Download Summary
          </Button>
        </div>
      </div>

      <Card.Geo variant="geothermal" className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Daily Power Generation</h2>
        <div className="text-3xl font-bold mb-1" style={{ color: geothermal }}>6,200 MWh</div>
        <p className="text-gray-600 mb-4">Stable baseline generation</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={generationData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="geothermalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={geothermal} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={geothermal} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="time"
                stroke={text.secondary}
                tick={{ fill: text.secondary }}
                label={{ value: 'Time of Day', position: 'bottom', offset: 0 }}
              />
              <YAxis
                stroke={text.secondary}
                tick={{ fill: text.secondary }}
                label={{ value: 'Power Output (MW)', angle: -90, position: 'insideLeft', offset: 10 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: background.paper,
                  border: `1px solid ${divider}`,
                  borderRadius: '6px'
                }}
              />
              <Area
                type="monotone"
                dataKey="output"
                stroke={geothermal}
                fill="url(#geothermalGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card.Geo>

      <div className="grid grid-cols-2 gap-6">
        <Card.Geo variant="default">
          <h2 className="text-xl font-semibold mb-2">Temperature Monitoring</h2>
          <div className="text-2xl font-bold mb-4" style={{ color: geothermal }}>280°C at depth</div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={temperatureData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="day" 
                stroke={text.secondary}
                label={{ value: 'Day of Week', position: 'bottom', offset: 0 }}
              />
              <YAxis 
                stroke={text.secondary}
                label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', offset: 10 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: background.paper,
                  border: `1px solid ${divider}`,
                  borderRadius: '6px'
                }}
              />
              <Line
                type="monotone"
                dataKey="surface"
                name="Surface Temperature"
                stroke={geothermal}
                strokeWidth={2}
                dot={{ fill: geothermal }}
              />
              <Line
                type="monotone"
                dataKey="deep"
                name="Deep Well Temperature"
                stroke={solar}
                strokeWidth={2}
                dot={{ fill: solar }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card.Geo>

        <Card.Geo variant="default">
          <h2 className="text-xl font-semibold mb-2">Well Performance</h2>
          <div className="text-2xl font-bold mb-4" style={{ color: geothermal }}>87.5% efficiency rating</div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={wellPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="well" 
                stroke={text.secondary}
                label={{ value: 'Well Number', position: 'bottom', offset: 0 }}
              />
              <YAxis 
                stroke={text.secondary}
                label={{ value: 'Pressure (PSI)', angle: -90, position: 'insideLeft', offset: 10 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: background.paper,
                  border: `1px solid ${divider}`,
                  borderRadius: '6px'
                }}
              />
              <Bar
                dataKey="pressure"
                fill={geothermal}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card.Geo>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-6">
        <Card.Geo variant="default">
          <div className="text-xl font-semibold">Total Generation</div>
          <div className="text-3xl font-bold mt-2" style={{ color: geothermal }}>186.0 MWh</div>
          <div className="text-sm text-gray-600">Monthly total</div>
        </Card.Geo>
        <Card.Geo variant="default">
          <div className="text-xl font-semibold">Well Pressure</div>
          <div className="text-3xl font-bold mt-2" style={{ color: geothermal }}>85.2 PSI</div>
          <div className="text-sm text-gray-600">Average value</div>
        </Card.Geo>
        <Card.Geo variant="default">
          <div className="text-xl font-semibold">Efficiency</div>
          <div className="text-3xl font-bold mt-2" style={{ color: geothermal }}>87.5%</div>
          <div className="text-sm text-gray-600">System performance</div>
        </Card.Geo>
      </div>
    </div>
  );
};

export default Geothermal;