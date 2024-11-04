import { useState } from 'react';
import { Paper, Typography, Box, Tabs, Tab } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie, Line, Bubble } from 'react-chartjs-2';
import { VisualizationSelector } from './VisualizationSelector';
import { DataGrid } from '@mui/x-data-grid';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export function Analytics({ data }) {
  const [activeTab, setActiveTab] = useState(0);
  const [visualizationType, setVisualizationType] = useState('bar');

  const processDataForCharts = () => {
    const productData = {};
    const customerOrders = {};
    const workCenterData = {};

    data.forEach(row => {
      // Products with descriptions
      const productDesc = row['Product Description'];
      if (productDesc) {
        productData[productDesc] = (productData[productDesc] || 0) + 1;
      }

      // Customers
      const customer = row['Customer'];
      customerOrders[customer] = (customerOrders[customer] || 0) + 1;

      // Work Centers
      const workCenter = row['Work center'];
      if (workCenter) {
        workCenterData[workCenter] = (workCenterData[workCenter] || 0) + 1;
      }
    });

    return { productData, customerOrders, workCenterData };
  };

  const { productData, customerOrders, workCenterData } = processDataForCharts();

  // Top 10 products by order count
  const topProducts = Object.entries(productData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const barChartData = {
    labels: topProducts.map(([desc]) => desc),
    datasets: [{
      label: 'Top Products by Orders',
      data: topProducts.map(([, count]) => count),
      backgroundColor: 'rgba(54, 162, 235, 0.5)'
    }]
  };

  const pieChartData = {
    labels: Object.keys(customerOrders),
    datasets: [{
      data: Object.values(customerOrders),
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)'
      ]
    }]
  };

  const workCenterChartData = {
    labels: Object.keys(workCenterData),
    datasets: [{
      label: 'Orders by Work Center',
      data: Object.values(workCenterData),
      backgroundColor: 'rgba(75, 192, 192, 0.5)'
    }]
  };

  const renderVisualization = (chartData, options = {}) => {
    switch (visualizationType) {
      case 'pie':
        return <Pie data={chartData} options={{ maintainAspectRatio: false, ...options }} />;
      case 'line':
        return <Line data={chartData} options={{ maintainAspectRatio: false, ...options }} />;
      case 'bubble':
        return <Bubble data={chartData} options={{ maintainAspectRatio: false, ...options }} />;
      case 'table':
        return (
          <DataGrid
            rows={chartData.datasets[0].data.map((value, index) => ({
              id: index,
              label: chartData.labels[index],
              value: value
            }))}
            columns={[
              { field: 'label', headerName: 'Label', flex: 1 },
              { field: 'value', headerName: 'Value', flex: 1 }
            ]}
            autoHeight
          />
        );
      case 'bar':
      default:
        return <Bar data={chartData} options={{ maintainAspectRatio: false, ...options }} />;
    }
  };

  return (
    <Paper sx={{ p: 2, position: 'relative' }}>
      <Typography variant="h6" gutterBottom>
        Analytics
      </Typography>
      <VisualizationSelector
        currentType={visualizationType}
        onSelect={setVisualizationType}
      />
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Top Products" />
          <Tab label="Customers" />
          <Tab label="Work Centers" />
        </Tabs>
      </Box>
      <Box sx={{ height: 400 }} className="chart-container">
        {activeTab === 0 && renderVisualization(barChartData)}
        {activeTab === 1 && renderVisualization(pieChartData)}
        {activeTab === 2 && renderVisualization(workCenterChartData)}
      </Box>
    </Paper>
  );
} 