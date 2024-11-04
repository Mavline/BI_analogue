import { Grid, Paper, Typography, Box } from '@mui/material';

export function BuildingsView({ buildings, onSelect, data }) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Buildings
      </Typography>
      <Grid container spacing={3}>
        {buildings.map((building) => (
          <Grid item xs={12} md={4} key={building.id}>
            <Box
              sx={{
                p: 3,
                border: '2px solid #1976d2',
                borderRadius: 2,
                cursor: 'pointer',
                textAlign: 'center',
                minHeight: 150,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                transition: 'all 0.3s',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  transform: 'scale(1.02)'
                }
              }}
              onClick={() => onSelect(building)}
            >
              <Typography variant="h5" gutterBottom>
                {building.name}
              </Typography>
              <Typography variant="body1">
                Work Centers: {building.workCenters.length}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
} 
