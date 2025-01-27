import React from 'react';
import { Card, CardContent, Typography, Box, Grid } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, ResponsiveContainer } from 'recharts';
import YearPicker from 'shared/components/datepicker/YearPicker';
const generationData = Array.from({ length: 100 }, (_, i) => ({
  date: `2014-${i}`,
  value: 0.5 + Math.random() * 0.5
}));

const consumptionData = Array.from({ length: 7 }, (_, i) => ({
  day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
  value: 3800 + Math.random() * 800
}));

const costData = Array.from({ length: 8 }, (_, i) => ({
  kw: `${(i + 1) * 4}W`,
  value: (i + 1) * 500
}));

export default function DashboardContent() {
  return (
    <Box sx={{ width: '100%', height: '100%', mt: 0 }}>
      <YearPicker />
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Predicted Generation</Typography>
          <Typography variant="h4" sx={{ mb: 2 }}>5,000 kWh</Typography>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Next 30 days</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={generationData}>
              <Line type="monotone" dataKey="value" stroke="#4CAF50" fill="#4CAF50" fillOpacity={0.2} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Predicted Consumption</Typography>
              <Typography variant="h4" sx={{ mb: 2 }}>4,200 kWh</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={consumptionData}>
                  <Line type="monotone" dataKey="value" stroke="#4CAF50" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Cost Trends</Typography>
              <Typography variant="h4" sx={{ mb: 2 }}>₱3,500/month average</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={costData}>
                  <Bar dataKey="value" fill="#4CAF50" />
                  <XAxis dataKey="kw" />
                  <YAxis />
                  <Tooltip />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}