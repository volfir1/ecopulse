import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, AreaChart, Area, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Droplets } from 'lucide-react';
import { Button, Card, YearPicker, theme } from '@shared/index';

const HydroPower = () => {
  // Get theme colors
  const { elements, text, background } = theme.palette;
  const { hydropower } = elements;

  // Generate realistic hydro data with seasonal patterns
  const generationData = Array.from({ length: 100 }, (_, i) => ({
    date: `2024-${String(i).padStart(2, '0')}`,
    value: 0.5 + Math.sin(i * 0.1) * 0.3 + Math.cos(i * 0.05) * 0.2 + Math.random() * 0.2
  }));

  const waterFlowData = Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    flow: 4200 + Math.sin(i * 0.8) * 800 + Math.random() * 400,
    generation: 3800 + Math.sin(i * 0.8) * 600 + Math.random() * 300
  }));

  const turbineEfficiency = Array.from({ length: 8 }, (_, i) => ({
    turbine: `T${i + 1}`,
    efficiency: 85 + Math.sin(i * 0.5) * 10 + Math.random() * 5,
    output: 2800 + Math.sin(i * 0.7) * 400 + Math.random() * 200
  }));

  return (
    <div className="p-6 bg-gray-50">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold flex items-center gap-2" style={{ color: hydropower }}>
          <Droplets className="h-6 w-6" />
          Hydropower Energy Dashboard
        </h1>
        <div className="flex gap-4 items-center">
          <YearPicker />
          <Button 
            variant="hydropower" 
            size="medium" 
            outlined
          >
            Export Data
          </Button>
          <Button 
            variant="hydropower" 
            size="medium"
          >
            Generate Report
          </Button>
        </div>
      </div>

      <Card variant="hydropower" className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Power Generation Forecast</h2>
        <div className="text-3xl font-bold mb-1" style={{ color: hydropower }}>5,200 MWh</div>
        <p className="text-gray-600 mb-4">Projected for next 30 days</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={generationData}>
              <defs>
                <linearGradient id="hydroGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={hydropower} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={hydropower} stopOpacity={0}/>
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
                stroke={hydropower}
                fill="url(#hydroGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        <Card variant="default">
          <h2 className="text-xl font-semibold mb-2">Water Flow & Generation</h2>
          <div className="text-2xl font-bold mb-4" style={{ color: hydropower }}>4,100 m³/s average flow</div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={waterFlowData}>
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
                dataKey="flow"
                stroke={hydropower}
                strokeWidth={2}
                dot={{ fill: hydropower }}
              />
              <Line
                type="monotone"
                dataKey="generation"
                stroke={elements.wind}
                strokeWidth={2}
                dot={{ fill: elements.wind }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card variant="default">
          <h2 className="text-xl font-semibold mb-2">Turbine Performance</h2>
          <div className="text-2xl font-bold mb-4" style={{ color: hydropower }}>89.4% average efficiency</div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={turbineEfficiency}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="turbine" 
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
                fill={hydropower}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-6">
        <Card variant="default">
          <div className="text-xl font-semibold">Total Generation</div>
          <div className="text-3xl font-bold mt-2" style={{ color: hydropower }}>128.5 MWh</div>
          <div className="text-sm text-gray-600">Monthly total</div>
        </Card>
        <Card variant="default">
          <div className="text-xl font-semibold">Peak Flow</div>
          <div className="text-3xl font-bold mt-2" style={{ color: hydropower }}>4,800 m³/s</div>
          <div className="text-sm text-gray-600">Highest today</div>
        </Card>
        <Card variant="default">
          <div className="text-xl font-semibold">Efficiency</div>
          <div className="text-3xl font-bold mt-2" style={{ color: hydropower }}>89.4%</div>
          <div className="text-sm text-gray-600">Average performance</div>
        </Card>
      </div>
    </div>
  );
};

export default HydroPower;