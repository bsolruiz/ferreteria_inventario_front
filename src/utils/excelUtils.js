import * as XLSX from 'xlsx';

export const exportToExcel = (data, filename, columns) => {
  const mappedData = data.map(item => {
    if (!columns) return item;
    
    const mappedItem = {};
    columns.forEach(col => {
      if (typeof col === 'string') {
        mappedItem[col] = item[col];
      } else {
        mappedItem[col.header] = item[col.key];
      }
    });
    return mappedItem;
  });

  const worksheet = XLSX.utils.json_to_sheet(mappedData);
  const workbook = XLSX.utils.book_new();
  
  if (mappedData && mappedData.length > 0) {
    const colWidths = Object.keys(mappedData[0]).map(key => ({
      wch: Math.max(
        key.length,
        ...mappedData.map(row => (row[key] ? row[key].toString().length : 0))
      ) + 2
    }));
    worksheet['!cols'] = colWidths;
  }

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};
