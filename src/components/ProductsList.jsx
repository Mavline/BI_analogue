import { List, ListItem, ListItemText, Paper, Typography } from '@mui/material';

export function ProductsList({ products, onSelect }) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Продукция
      </Typography>
      <List>
        {products.map((product) => (
          <ListItem 
            key={product}
            button 
            onClick={() => onSelect({ type: 'product', id: product })}
          >
            <ListItemText primary={product} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
} 