import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, AreaChart, Area, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Wind } from 'lucide-react';
import { Button, Card, theme, YearPicker } from '@shared/index';

const WindEnergy = () => {
  // Destructure theme values
  const { elements, text, background, divider } = theme.palette;
  const { wind, solar } = elements;

  // Generate wind-specific data patterns (more variable than other renewables)
  const generationData = Array.from({ length: 24 }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    output: 0.4 + Math.sin(i * 0.2) * 0.3 + Math.cos(i * 0.1) * 0.2 + Math.random() * 0.3
  }));

  const windSpeedData = Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    speed: 15 + Math.sin(i * 0.8) * 5 + Math.random() * 3,
    power: 3500 + Math.sin(i * 0.8) * 800 + Math.random() * 500
  }));

  const turbinePerformance = Array.from({ length: 6 }, (_, i) => ({
    turbine: `Turbine ${i + 1}`,
    efficiency: 92 + Math.sin(i * 0.7) * 5 + Math.random() * 3,
    output: 2200 + Math.sin(i * 0.6) * 400 + Math.random() * 200
  }));

  return (
    <div className="p-6 bg-gray-50">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold flex items-center gap-2" style={{ color: wind }}>
          <Wind className="h-6 w-6" />
          Wind Energy Analytics
        </h1>
        <div className="flex gap-4 items-center">
          <YearPicker />
          <Button variant="wind" size="medium" outlined>
            Turbine Report
          </Button>
          <Button variant="wind" size="medium">
            Download Summary
          </Button>
        </div>
      </div>

      <Card variant="wind" className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Daily Power Generation</h2>
        <div className="text-3xl font-bold mb-1" style={{ color: wind }}>4,800 MWh</div>
        <p className="text-gray-600 mb-4">Variable generation forecast</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={generationData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={wind} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={wind} stopOpacity={0}/>
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
                stroke={wind}
                fill="url(#windGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        <Card variant="default">
          <h2 className="text-xl font-semibold mb-2">Wind Speed & Power</h2>
          <div className="text-2xl font-bold mb-4" style={{ color: wind }}>15.8 m/s average</div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={windSpeedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="day" 
                stroke={text.secondary}
                label={{ value: 'Day of Week', position: 'bottom', offset: 0 }}
              />
              <YAxis 
                stroke={text.secondary}
                label={{ value: 'Wind Speed (m/s)', angle: -90, position: 'insideLeft', offset: 10 }}
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
                dataKey="speed"
                name="Wind Speed"
                stroke={wind}
                strokeWidth={2}
                dot={{ fill: wind }}
              />
              <Line
                type="monotone"
                dataKey="power"
                name="Power Output"
                stroke={solar}
                strokeWidth={2}
                dot={{ fill: solar }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card variant="default">
          <h2 className="text-xl font-semibold mb-2">Turbine Performance</h2>
          <div className="text-2xl font-bold mb-4" style={{ color: wind }}>92.5% efficiency rating</div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={turbinePerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="turbine" 
                stroke={text.secondary}
                label={{ value: 'Turbine Number', position: 'bottom', offset: 0 }}
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
                fill={wind}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-6">
        <Card variant="default">
          <div className="text-xl font-semibold">Total Generation</div>
          <div className="text-3xl font-bold mt-2" style={{ color: wind }}>142.8 MWh</div>
          <div className="text-sm text-gray-600">Monthly total</div>
        </Card>
        <Card variant="default">
          <div className="text-xl font-semibold">Peak Power</div>
          <div className="text-3xl font-bold mt-2" style={{ color: wind }}>15.2 MW</div>
          <div className="text-sm text-gray-600">Highest today</div>
        </Card>
        <Card variant="default">
          <div className="text-xl font-semibold">Efficiency</div>
          <div className="text-3xl font-bold mt-2" style={{ color: wind }}>92.5%</div>
          <div className="text-sm text-gray-600">Average performance</div>
        </Card>
      </div>
    </div>
  );
};

export default WindEnergy;