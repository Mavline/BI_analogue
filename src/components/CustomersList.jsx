import { List, ListItem, ListItemText, Paper, Typography } from '@mui/material';

export function CustomersList({ customers, onSelect }) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Клиенты
      </Typography>
      <List>
        {customers.map((customer) => (
          <ListItem 
            key={customer}
            sx={{ cursor: 'pointer' }}
            onClick={() => onSelect({ type: 'customer', id: customer })}
          >
            <ListItemText primary={customer} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
} 