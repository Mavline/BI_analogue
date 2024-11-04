import { useState } from 'react';
import { Grid, Container } from '@mui/material';
import { BuildingsView } from './BuildingsView';
import { CustomersList } from './CustomersList';
import { ProductsList } from './ProductsList';
import { DetailView } from './DetailView';
import { Analytics } from './Analytics';

export function Dashboard({ data }) {
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [navigationHistory, setNavigationHistory] = useState([]);

  // Обработка выбора сущности (из списка или графика)
  const handleEntitySelect = (entity) => {
    console.log('Selecting entity:', entity);
    
    // Если это выбор из списка
    if (!entity.path) {
      // Фильтруем данные для выбранной сущности
      const filteredData = data.rawData.filter(row => {
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

      console.log(`Found ${filteredData.length} rows for initial selection`);

      // Сохраняем текущее состояние в историю
      if (selectedEntity) {
        setNavigationHistory(prev => [...prev, selectedEntity]);
      }

      // Устанавливаем новое состояние с отфильтрованными данными
      setSelectedEntity({
        ...entity,
        rawData: filteredData
      });
    }
    // Если это клик по графику
    else {
      console.log('Click on chart value:', entity);
      
      // Сохраняем предыдущее состояние
      setNavigationHistory(prev => [...prev, selectedEntity]);

      // Устанавливаем новое состояние
      setSelectedEntity(entity);
    }
  };

  // Обработка возврата назад
  const handleBack = () => {
    if (navigationHistory.length > 0) {
      const newHistory = [...navigationHistory];
      const lastEntity = newHistory.pop();
      setNavigationHistory(newHistory);
      setSelectedEntity(lastEntity);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        {!selectedEntity ? (
          <>
            <Grid item xs={12}>
              <BuildingsView 
                buildings={data.buildings} 
                onSelect={handleEntitySelect} 
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomersList 
                customers={data.customers} 
                onSelect={handleEntitySelect} 
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ProductsList 
                products={data.products} 
                onSelect={handleEntitySelect} 
              />
            </Grid>
            <Grid item xs={12}>
              <Analytics data={data.rawData} />
            </Grid>
          </>
        ) : (
          <Grid item xs={12}>
            <DetailView 
              entity={selectedEntity}
              data={data.rawData}
              onNavigate={handleEntitySelect}
              onBack={handleBack}
            />
          </Grid>
        )}
      </Grid>
    </Container>
  );
} 