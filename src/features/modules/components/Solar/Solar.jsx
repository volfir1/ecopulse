import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, 
  BarChart, Bar, AreaChart, Area, 
  ResponsiveContainer, CartesianGrid 
} from 'recharts';
import { Sun } from 'lucide-react';
import { Button, Card, theme } from '@shared/index';

const SolarEnergy = () => {
  const { elements, text, background, divider } = theme.palette;
  const { solar } = elements;
  
  // Data generation
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
      {/* Header Section */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold flex items-center gap-2" style={{ color: solar }}>
          <Sun size={24} />
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

      {/* Main Generation Card */}
      <Card.Solar className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Daily Power Generation</h2>
        <div className="text-3xl font-bold mb-1" style={{ color: solar }}>5,200 kWh</div>
        <p className="text-gray-600 mb-4">Peak sunlight generation forecast</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={generationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="output" 
                stroke={solar} 
                fill={solar} 
                fillOpacity={0.1} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card.Solar>

      {/* Chart Cards */}
      <div className="grid grid-cols-2 gap-6">
        <Card.Base>
          <h2 className="text-xl font-semibold mb-2">Solar Irradiance & Power</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={solarIrradianceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="irradiance" 
                  stroke={solar} 
                  strokeWidth={2}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="power" 
                  stroke={text.secondary} 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card.Base>

        <Card.Base>
          <h2 className="text-xl font-semibold mb-2">Panel Array Performance</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={panelPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="array" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="output" fill={solar} fillOpacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card.Base>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mt-6">
        <Card.Base>
          <div className="text-xl font-semibold">Total Generation</div>
          <div className="text-3xl font-bold mt-2" style={{ color: solar }}>128.5 MWh</div>
          <div className="text-sm text-gray-600">Monthly total</div>
        </Card.Base>
        <Card.Base>
          <div className="text-xl font-semibold">Peak Power</div>
          <div className="text-3xl font-bold mt-2" style={{ color: solar }}>12.8 kW</div>
          <div className="text-sm text-gray-600">Highest today</div>
        </Card.Base>
        <Card.Base>
          <div className="text-xl font-semibold">Efficiency</div>
          <div className="text-3xl font-bold mt-2" style={{ color: solar }}>95.2%</div>
          <div className="text-sm text-gray-600">Average performance</div>
        </Card.Base>
      </div>
    </div>
  );
};

export default SolarEnergy;