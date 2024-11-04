'use client';

import { useState, useEffect, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, Grid, Box, Button, Paper, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import * as XLSX from 'xlsx';
import { BuildingsView } from '../components/BuildingsView';
import { DetailView } from '../components/DetailView';
import { useRouter } from 'next/navigation';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { InteractiveDots } from '../components/InteractiveDots';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// Базовая структура корпусов
const BUILDINGS_DATA = [
  {
    id: 1,
    name: 'Building 1',
    workCenters: [
      { id: 'wc1', name: 'Preparation Area', type: 'preparation' },
      { id: 'wc2', name: 'Etching Line', type: 'etching' },
    ]
  },
  {
    id: 2,
    name: 'Building 2',
    workCenters: [
      { id: 'wc3', name: 'Assembly Area', type: 'assembly' },
      { id: 'wc4', name: 'Testing Area', type: 'testing' },
    ]
  },
  {
    id: 3,
    name: 'Building 3',
    workCenters: [
      { id: 'wc5', name: 'Storage', type: 'storage' },
      { id: 'wc6', name: 'Shipping', type: 'shipping' },
    ]
  }
];

export default function Home() {
  const [data, setData] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [navigationStack, setNavigationStack] = useState([]);
  const router = useRouter();
  const [mode, setMode] = useState('light');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? '#1976d2' : '#90caf9',
          },
          background: {
            default: mode === 'light' ? '#ffffff' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
        },
      }),
    [mode],
  );

  const toggleColorMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme-mode', newMode);
      return newMode;
    });
  };

  useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode');
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  useEffect(() => {
    window.onpopstate = () => {
      handleBack();
    };
    return () => {
      window.onpopstate = null;
    };
  }, [navigationStack]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rawData = XLSX.utils.sheet_to_json(worksheet);

      console.log('Loaded data:', rawData);

      const requiredFields = [
        'Customer',
        'Work Order Number',
        'Open Order Date',
        'Product Description',
        'Order Qty',
        'Reported Qty',
        'Work center',
        'Order Status'
      ];

      const hasAllFields = requiredFields.every(field => 
        rawData.length > 0 && field in rawData[0]
      );

      if (!hasAllFields) {
        console.error('Missing required fields in data');
        return;
      }

      const processedData = {
        buildings: BUILDINGS_DATA,
        customers: [...new Set(rawData.map(row => row.Customer))].filter(Boolean).sort(),
        products: [...new Set(rawData.map(row => row['Product Description']))].filter(Boolean).sort(),
        workCenters: [...new Set(rawData.map(row => row['Work center']))].filter(Boolean).sort(),
        rawData: rawData
      };

      console.log('Processed data:', processedData);
      setData(processedData);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleEntitySelect = (entity) => {
    setNavigationStack(prev => [...prev, selectedEntity]);
    setSelectedEntity(entity);
  };

  const handleBack = () => {
    if (navigationStack.length > 0) {
      const newStack = [...navigationStack];
      const lastEntity = newStack.pop();
      setNavigationStack(newStack);
      setSelectedEntity(lastEntity);
    }
  };

  const handleHome = () => {
    setNavigationStack([]);
    setSelectedEntity(null);
    router.push('/');
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        bgcolor: 'background.default', 
        minHeight: '100vh',
        color: 'text.primary'
      }}>
        {!data && <InteractiveDots />}
        <Container maxWidth="xl" sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <IconButton onClick={toggleColorMode} color="inherit">
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
          {!data ? (
            <Box
              sx={{
                height: '90vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative'
              }}
            >
              <Paper 
                sx={{ 
                  p: 6,
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  maxWidth: '600px',
                  width: '100%',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}
              >
                <Typography 
                  variant="h3" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                    mb: 4
                  }}
                >
                  BI Analytics Dashboard
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 4,
                    color: 'text.secondary'
                  }}
                >
                  Upload your production data file to start analysis
                </Typography>
                <Button
                  variant="contained"
                  component="label"
                  size="large"
                  sx={{ 
                    mt: 2,
                    py: 2,
                    px: 4,
                    borderRadius: '10px',
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                      transform: 'scale(1.05)',
                      transition: 'all 0.3s ease'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CloudUploadIcon />
                    <span>Select Excel File</span>
                  </Box>
                  <input
                    type="file"
                    hidden
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                  />
                </Button>
              </Paper>
            </Box>
          ) : (
            <>
              {navigationStack.length > 0 && (
                <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
                  <Button onClick={handleBack}>Back</Button>
                  <Button onClick={handleHome}>Home</Button>
                </Box>
              )}
              <Grid container spacing={3}>
                {!selectedEntity ? (
                  <>
                    {/* Корпуса */}
                    <Grid item xs={12}>
                      <BuildingsView 
                        buildings={data.buildings}
                        onSelect={handleEntitySelect}
                      />
                    </Grid>
                    
                    {/* Селекторы */}
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                        <InputLabel>Customers</InputLabel>
                        <Select
                          value=""
                          label="Customers"
                          onChange={(e) => handleEntitySelect({ 
                            type: 'customer',
                            id: e.target.value 
                          })}
                        >
                          {data.customers.map(customer => (
                            <MenuItem key={customer} value={customer}>
                              {customer}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                        <InputLabel>Products</InputLabel>
                        <Select
                          value=""
                          label="Products"
                          onChange={(e) => handleEntitySelect({ 
                            type: 'product',
                            id: e.target.value 
                          })}
                        >
                          {data.products.map(product => (
                            <MenuItem 
                              key={product} 
                              value={product}
                              sx={{
                                whiteSpace: 'normal',
                                wordBreak: 'break-word'
                              }}
                            >
                              {product}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                        <InputLabel>Work Centers</InputLabel>
                        <Select
                          value=""
                          label="Work Centers"
                          onChange={(e) => handleEntitySelect({ 
                            type: 'workCenter',
                            id: e.target.value 
                          })}
                        >
                          {data.workCenters.map(wc => (
                            <MenuItem key={wc} value={wc}>
                              {wc}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </>
                ) : (
                  <Grid item xs={12}>
                    <DetailView 
                      entity={selectedEntity}
                      data={data.rawData}
                      onNavigate={handleEntitySelect}
                    />
                  </Grid>
                )}
              </Grid>
            </>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}
