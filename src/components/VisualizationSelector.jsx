import { Box, IconButton, Tooltip, Menu, MenuItem } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import TableChartIcon from '@mui/icons-material/TableChart';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import RadarChartIcon from '@mui/icons-material/RadioButtonChecked';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import AllOutIcon from '@mui/icons-material/AllOut';
import { useState } from 'react';

export function VisualizationSelector({ onSelect, currentType }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const visualizations = [
    { type: 'bar', icon: <BarChartIcon />, label: 'Bar Chart' },
    { type: 'pie', icon: <PieChartIcon />, label: 'Pie Chart' },
    { type: 'line', icon: <TimelineIcon />, label: 'Line Chart' },
    { type: 'radar', icon: <RadarChartIcon />, label: 'Radar Chart' },
    { type: 'polarArea', icon: <AllOutIcon />, label: 'Polar Area' },
    { type: 'doughnut', icon: <DonutLargeIcon />, label: 'Doughnut' },
  ];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (type) => {
    onSelect(type);
    handleClose();
  };

  return (
    <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
      <Tooltip title="Change visualization">
        <IconButton 
          size="small" 
          onClick={handleClick}
          sx={{ 
            bgcolor: 'background.paper',
            boxShadow: 1,
            '&:hover': { bgcolor: 'background.default' }
          }}
        >
          {visualizations.find(v => v.type === currentType)?.icon || <BarChartIcon />}
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {visualizations.map((viz) => (
          <MenuItem 
            key={viz.type} 
            onClick={() => handleSelect(viz.type)}
            selected={currentType === viz.type}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {viz.icon}
              {viz.label}
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
} 