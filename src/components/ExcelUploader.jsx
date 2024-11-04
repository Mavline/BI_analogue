import { Button } from '@mui/material';
import * as XLSX from 'xlsx';

export function ExcelUploader({ onDataLoad }) {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      const processedData = {
        customers: [...new Set(data.map(row => row['Customer']))],
        products: [...new Set(data.map(row => row['Product Number']))],
        buildings: [
          { id: 1, name: 'Корпус 1' },
          { id: 2, name: 'Корпус 2' },
          { id: 3, name: 'Корпус 3' }
        ],
        rawData: data
      };

      onDataLoad(processedData);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <Button
      variant="contained"
      component="label"
      sx={{ m: 2 }}
    >
      Загрузить Excel файл
      <input
        type="file"
        hidden
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
      />
    </Button>
  );
} 