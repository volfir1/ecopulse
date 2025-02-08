  import React from 'react';
  import { LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, AreaChart, Area, ResponsiveContainer, CartesianGrid } from 'recharts';
  import { Sun } from 'lucide-react';
  import { Button, Card, theme } from '@shared/index';

  const SolarEnergy = () => {
    // Destructure all needed theme values at the top
    const { elements, text, background, divider } = theme.palette;
    const { solar, wind } = elements;
    
    const generationData = Array.from({ length: 24 }, (_, i) => ({
      time: `${String(i).padStart(2, '0')}:00`,
      output: Math.max(0, 5 * Math.sin((i - 6) * Math.PI / 12) + Math.random() * 0.5),
      efficiency: Math.max(0, 95 + 5 * Math.sin((i - 6) * Math.PI / 12) + Math.random())
    })).filter(d => d.output > 0);

    const solarIrradianceData = Array.from({ length: 7 }, (_, i) => ({
      day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      irradiance: 800 + Math.sin(i * 0.8) * 200 + Math.random() * 100,
      power: 4200 + Math.sin(i * 0.8) * 800 + Math.random() * 400
    }));

    const panelPerformance = Array.from({ length: 6 }, (_, i) => ({
      array: `Array ${i + 1}`,
      efficiency: 95 + Math.sin(i * 0.5) * 3 + Math.random() * 2,
      output: 2500 + Math.sin(i * 0.5) * 300 + Math.random() * 200
    }));

    return (
      <div className="p-6 bg-gray-50">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-semibold flex items-center gap-2" style={{ color: solar }}>
            <Sun className="h-6 w-6" />
            Solar Energy Analytics
          </h1>
          <div className="flex gap-4 items-center">
            <Button variant="solar" size="medium" outlined>
              Panel Report
            </Button>
            <Button variant="solar" size="medium">
              Download Summary
            </Button>
          </div>
        </div>

        <Card variant="solar" className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Daily Power Generation</h2>
          <div className="text-3xl font-bold mb-1" style={{ color: solar }}>5,200 kWh</div>
          <p className="text-gray-600 mb-4">Peak sunlight generation forecast</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={generationData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={solar} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={solar} stopOpacity={0}/>
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
                  label={{ value: 'Power Output (kW)', angle: -90, position: 'insideLeft', offset: 10 }}
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
                  stroke={solar}
                  fill="url(#solarGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-6">
          <Card variant="default">
            <h2 className="text-xl font-semibold mb-2">Solar Irradiance & Power</h2>
            <div className="text-2xl font-bold mb-4" style={{ color: solar }}>850 W/m² average</div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={solarIrradianceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="day" 
                  stroke={text.secondary}
                  label={{ value: 'Day of Week', position: 'bottom', offset: 0 }}
                />
                <YAxis 
                  stroke={text.secondary}
                  label={{ value: 'Irradiance (W/m²)', angle: -90, position: 'insideLeft', offset: 10 }}
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
                  dataKey="irradiance"
                  name="Solar Irradiance"
                  stroke={solar}
                  strokeWidth={2}
                  dot={{ fill: solar }}
                />
                <Line
                  type="monotone"
                  dataKey="power"
                  name="Power Output"
                  stroke={wind}
                  strokeWidth={2}
                  dot={{ fill: wind }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card variant="default">
            <h2 className="text-xl font-semibold mb-2">Panel Array Performance</h2>
            <div className="text-2xl font-bold mb-4" style={{ color: solar }}>95.2% efficiency rating</div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={panelPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="array" 
                  stroke={text.secondary}
                  label={{ value: 'Array Number', position: 'bottom', offset: 0 }}
                />
                <YAxis 
                  stroke={text.secondary}
                  label={{ value: 'Efficiency (%)', angle: -90, position: 'insideLeft', offset: 10 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: background.paper,
                    border: `1px solid ${divider}`,
                    borderRadius: '6px'
                  }}
                />
                <Bar
                  dataKey="efficiency"
                  fill={solar}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-6">
          <Card variant="default">
            <div className="text-xl font-semibold">Total Generation</div>
            <div className="text-3xl font-bold mt-2" style={{ color: solar }}>128.5 MWh</div>
            <div className="text-sm text-gray-600">Monthly total</div>
          </Card>
          <Card variant="default">
            <div className="text-xl font-semibold">Peak Power</div>
            <div className="text-3xl font-bold mt-2" style={{ color: solar }}>12.8 kW</div>
            <div className="text-sm text-gray-600">Highest today</div>
          </Card>
          <Card variant="default">
            <div className="text-xl font-semibold">Efficiency</div>
            <div className="text-3xl font-bold mt-2" style={{ color: solar }}>95.2%</div>
            <div className="text-sm text-gray-600">Average performance</div>
          </Card>
        </div>
      </div>
    );
  };

  export default SolarEnergy;