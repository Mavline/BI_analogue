import { useState, useRef, useEffect, useMemo } from 'react';
import { Paper, Typography, Box, Grid, IconButton } from '@mui/material';
import { VisualizationSelector } from './VisualizationSelector';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PolarAreaController,
  DoughnutController,
  RadarController,
} from 'chart.js';
import { Bar, Pie, Line, Radar, PolarArea, Doughnut } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip as MuiTooltip } from '@mui/material';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  PolarAreaController,
  DoughnutController,
  RadarController,
  Title,
  Tooltip,
  Legend
);

// Яркие цвета для графиков
const CHART_COLORS = [
  'rgba(0, 120, 255, 1)',     // Яркий синий
  'rgba(0, 200, 83, 1)',      // Яркий зеленый
  'rgba(255, 171, 0, 1)',     // Оранжевый
  'rgba(123, 31, 162, 1)',    // Фиолетовый
  'rgba(0, 176, 255, 1)',     // Голубой
  'rgba(76, 175, 80, 1)',     // Изумрудный
  'rgba(255, 214, 0, 1)',     // Золотой
  'rgba(156, 39, 176, 1)',    // Пурпурный
];

// Убираем radar из типов визуализации
const DEFAULT_VISUALIZATIONS = ['bar', 'pie', 'line', 'doughnut'];

export function DetailView({ entity, data, onNavigate }) {
  const [visualizations, setVisualizations] = useState(DEFAULT_VISUALIZATIONS);
  const [expandedChart, setExpandedChart] = useState(null);

  const ACTIVE_FIELDS = [
    'Work Order Number',
    'Open Order Date',
    'Product Description',
    'Order Qty',
    'Reported Qty',
    'Work center',
    'Order Status'
  ];

  // Получаем данные для отображения
  const getRelatedData = () => {
    console.log('Current entity:', entity);
    
    // Используем rawData если они есть
    const workingData = entity.rawData || data;
    console.log('Working with data:', workingData?.length);

    // Если это первый уровень (выбор из списка)
    if (!entity.path) {
      const filteredRows = workingData.filter(row => {
        switch (entity.type) {
          case 'customer':
            return row.Customer === entity.id;
          case 'product':
            return row['Product Description'] === entity.id;
          case 'workCenter':
            return row['Work center'] === entity.id;
          default:
            return false;
        }
      });

      console.log(`Found ${filteredRows.length} rows for initial filter`);

      // Создаем графики для связанных полей
      const charts = ACTIVE_FIELDS
        .filter(field => field !== entity.type)
        .map(field => {
          const distribution = {};
          filteredRows.forEach(row => {
            const value = row[field];
            if (value !== undefined && value !== null) {
              distribution[value] = (distribution[value] || 0) + 1;
            }
          });

          return {
            field,
            data: {
              labels: Object.keys(distribution),
              datasets: [{
                label: field,
                data: Object.values(distribution),
                backgroundColor: CHART_COLORS,
                borderColor: CHART_COLORS,
                borderWidth: 2
              }]
            },
            rawData: filteredRows
          };
        });

      return { charts };
    }

    // Если это второй уровень - используем переданные данные напрямую
    console.log('Using rawData directly:', workingData);

    // Создаем графики для всех полей кроме текущего
    const charts = ACTIVE_FIELDS
      .filter(field => field !== entity.type)
      .map(field => {
        const distribution = {};
        workingData.forEach(row => {
          const value = row[field];
          if (value !== undefined && value !== null) {
            distribution[value] = (distribution[value] || 0) + 1;
          }
        });

        console.log(`Distribution for ${field}:`, distribution);

        return {
          field,
          data: {
            labels: Object.keys(distribution),
            datasets: [{
              label: field,
              data: Object.values(distribution),
              backgroundColor: CHART_COLORS,
              borderColor: CHART_COLORS,
              borderWidth: 2
            }]
          },
          rawData: workingData
        };
      });

    return { charts };
  };

  // Обработка клика по графику
  const handleChartClick = (elements, chartData, field, rawData) => {
    if (!elements?.length) return;
    
    const index = elements[0].index;
    const value = chartData.labels[index];
    
    console.log('Click detected:', { field, value });

    // Фильтруем данные для следующего уровня
    const selectedRows = rawData.filter(row => row[field] === value);
    console.log('Selected rows:', selectedRows);

    if (selectedRows.length > 0) {
      onNavigate({
        type: field,
        id: value,
        rawData: selectedRows,
        path: [...(entity.path || []), { field: entity.type, value: entity.id }]
      });
    }
  };

  // Рендер графика
  const renderChart = (chart, index) => (
    <Grid item xs={12} md={expandedChart === index ? 12 : 6} key={index}>
      <Paper 
        sx={{ 
          p: 2,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: 6,
            transform: 'scale(1.01)'
          }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2 
        }}>
          <Typography variant="h6">
            {chart.field}
          </Typography>
          <IconButton 
            onClick={() => setExpandedChart(expandedChart === index ? null : index)}
          >
            {expandedChart === index ? <CloseFullscreenIcon /> : <OpenInFullIcon />}
          </IconButton>
        </Box>
        <Box sx={{ height: expandedChart === index ? 600 : 300 }}>
          <VisualizationSelector
            currentType={visualizations[index]}
            onSelect={(type) => {
              const newVisualizations = [...visualizations];
              newVisualizations[index] = type;
              setVisualizations(newVisualizations);
            }}
          />
          {renderVisualizationType(
            chart.data,
            visualizations[index] || 'bar',
            {
              responsive: true,
              maintainAspectRatio: false,
              onClick: (_, elements) => {
                handleChartClick(elements, chart.data, chart.field, chart.rawData);
              },
              plugins: {
                legend: { 
                  position: 'top',
                  labels: {
                    boxWidth: 20,
                    padding: 10
                  }
                },
                tooltip: {
                  callbacks: {
                    label: (context) => `${context.label}: ${context.raw}`
                  }
                }
              }
            }
          )}
        </Box>
      </Paper>
    </Grid>
  );

  const { charts } = getRelatedData();

  // Добавляем функцию renderVisualizationType
  const renderVisualizationType = (chartData, type, options = {}) => {
    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { 
          position: 'top',
          labels: {
            boxWidth: 20,
            padding: 10
          }
        },
        tooltip: {
          callbacks: {
            label: (context) => `${context.label}: ${context.raw}`
          }
        }
      },
      ...options
    };

    switch (type) {
      case 'pie':
        return <Pie data={chartData} options={defaultOptions} />;
      case 'line':
        return <Line data={chartData} options={defaultOptions} />;
      case 'doughnut':
        return <Doughnut data={chartData} options={defaultOptions} />;
      case 'bar':
      default:
        return <Bar data={chartData} options={defaultOptions} />;
    }
  };

  return (
    <Grid container spacing={2}>
      {charts.map((chart, index) => renderChart(chart, index))}
    </Grid>
  );
} 