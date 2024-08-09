import React, { useState, useRef, useEffect, useCallback } from 'react';
import ZakupButtons from "./ZakupButtons";
import './Zakup.css';
import * as XLSX from 'xlsx';


export default function Zakup() {
  const [selectedCells, setSelectedCells] = useState(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState([]);
  const [editedRows, setEditedRows] = useState(new Set());
  const tableRef = useRef(null);

  const columns = [
    "№", "Страна", "Город", "Терминал", "Сток", "Номер контейнера",
    "Тип", "Фото", "YOM", "Состояние", "Вид расчета", "Цена закупа",
    "НДС", "ГТД", "Подрядчик", "Дата поступления", "Статус оплаты",
    "Терминальное хранение", "Ремонт", "ПРР", "Издержки",
    "Комментарий", "Ответственный менеджер"
  ];

  const fetchData = useCallback(() => {
    fetch('/api/zakup')
      .then(res => res.json())
      .then(fetchedData => {
        const formattedData = fetchedData.map(row => {
          return {
            ...row,
            'Дата поступления': row['Дата поступления'] ? new Date(row['Дата поступления']).toLocaleDateString('ru-RU') : ''
          };

        });
        setData(formattedData);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCopy = useCallback(() => {
    const selectedData = Array.from(selectedCells).map(cellKey => {
      const [row, col] = cellKey.split('-').map(Number);
      return data[row][Object.keys(data[row])[col]];
    }).join('\n');

    navigator.clipboard.writeText(selectedData).then(() => {
      alert('Copied to clipboard');
    });
  }, [selectedCells, data]);

  useEffect(() => {
    function handleMouseUp() {
      setIsSelecting(false);
    }

    function handleKeyDown(e) {
      if (e.ctrlKey && e.key === 'c') {
        handleCopy();
      }
    }

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleCopy]);

  function handleMouseDown(row, col) {
    setIsSelecting(true);
    setSelectionStart({ row, col });
    setSelectedCells(new Set([`${row}-${col}`]));
  }

  function handleMouseEnter(row, col) {
    if (isSelecting && selectionStart) {
      const newSelectedCells = new Set();
      const startRow = Math.min(selectionStart.row, row);
      const endRow = Math.max(selectionStart.row, row);
      const startCol = Math.min(selectionStart.col, col);
      const endCol = Math.max(selectionStart.col, col);

      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          newSelectedCells.add(`${r}-${c}`);
        }
      }

      setSelectedCells(newSelectedCells);
    }
  }

  function handleEditToggle() {
    setIsEditing(prev => !prev);
  }


  function renderCell(row, col) {
    const cellKey = `${row}-${col}`;
    const isSelected = selectedCells.has(cellKey);
    const cellData = data[row][Object.keys(data[row])[col]];
    const columnName = columns[col];

    if (columnName === "Фото") {
      const filenames = cellData ? JSON.parse(cellData) : [];
      const filename = filenames.length > 0 ? filenames[0] : '';
      return (
        <td
          key={cellKey}
          className={isSelected ? 'selected-cell' : 'cell'}
          onMouseDown={() => handleMouseDown(row, col)}
          onMouseEnter={() => handleMouseEnter(row, col)}
          onClick={() => openPhoto(filename)}
        >
          📸
        </td>
      );
    }

    if(columnName === "Ремонт"){
      return(
        <td
            key={cellKey}
            className={isSelected ? 'selected-cell' : 'cell'}
            onMouseDown={() => handleMouseDown(row, col)}
            onMouseEnter={() => handleMouseEnter(row, col)}
        >
          {cellData ? 'Нуждается' : 'Нет'}
        </td>
      )
    }

    if (columnName === "ГТД") {
      return (
        <td
          key={cellKey}
          className={isSelected ? 'selected-cell' : 'cell'}
          onMouseDown={() => handleMouseDown(row, col)}
          onMouseEnter={() => handleMouseEnter(row, col)}
          onClick={() => handleFileClick(cellData)}
        >
          {cellData ? '📄 ' + cellData : 'нет'}
        </td>
      );
    }

    if (columnName === "Дата поступления") {
      return (
        <td
          key={cellKey}
          className={isSelected ? 'selected-cell' : 'cell'}
          onMouseDown={() => handleMouseDown(row, col)}
          onMouseEnter={() => handleMouseEnter(row, col)}
        >
          {cellData}
        </td>
      );
    }


    return (
      <td
        key={cellKey}
        className={isSelected ? 'selected-cell' : 'cell'}
        onMouseDown={() => handleMouseDown(row, col)}
        onMouseEnter={() => handleMouseEnter(row, col)}
      >
        {isEditing ? (
          <input 
            type="text" 
            value={cellData}
            onChange={(e) => handleCellChange(row, col, e.target.value)}
            className="editable-cell"
          />
        ) : (
          cellData
        )}
      </td>
    );
  }


  function openPhoto(filename) {
    if (!filename) {
      alert('Фото не найдено');
      return;
    }

    const photoUrl = `/uploads/images/${filename}`;
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>PointB</title>
            <style>
              body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background-color: white;
                font-family: Arial, sans-serif;
              }
              img {
                max-width: 90%;
                max-height: 90%;
              }
              h1 {
                position: absolute;
                top: 0;
                width: 100%;
                text-align: center;
                background-color: white;
                margin: 0;
                padding: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
            </style>
          </head>
          <body>
            <h1>PointB</h1>
            <img src="${photoUrl}" alt="Photo">
          </body>
        </html>
      `);
      newWindow.document.close();
    } else {
      alert('Не удалось открыть новое окно. Пожалуйста, проверьте настройки вашего браузера.');
    }
  }

  function handleFileDownload(filename) {
    if (!filename) {
      alert('Filename is missing');
      return;
    }

    const url = `/api/download/${filename.trim()}`;
    console.log(`Downloading file from URL: ${url}`);

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to download file');
        }
        return response.blob();
      })
      .then(blob => {
        const downloadUrl = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', filename.trim());
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch(error => {
        console.error('Error downloading file:', error);
        alert('Failed to download file');
      });
  }

  function handleFileClick(filename) {
    if (filename && filename !== 'нет') {
      handleFileDownload(filename.trim());
    }
  }


  function renderRow(row) {
    return (
      <tr key={row}>
        {columns.map((_, col) => renderCell(row, col))}
      </tr>
    );
  }

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Закуп");
    XLSX.writeFile(wb, "ZakupData.xlsx");
  };


  function handleCellChange(row, col, newValue) {
    setData(prevData => {
      const newData = prevData.map((rowData, rIdx) => {
        if (rIdx === row) {
          const newRowData = { ...rowData };
          const key = Object.keys(newRowData)[col];
          newRowData[key] = newValue;
          return newRowData;
        }
        return rowData;
      });
      return newData;
    });

    setEditedRows(prev => new Set([...prev, row]));
  }

  useEffect(() => {
    if (editedRows.size > 0) {
      const editRow = async (row) => {
        const rowData = data[row];
        
        try {
          const response = await fetch('/api/editZakup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ rowData }) // Sending only rowData which contains the id
          });
  
          if (!response.ok) {
            throw new Error('Failed to update row');
          }
  
          const result = await response.json();
          console.log('Update successful:', result);
  
          if (result.status) {
            // Update the local state with the updated data
            setData(prevData => {
              const newData = [...prevData];
              newData[row] = result.data; // Ensure data is correctly updated
              return newData;
            });
          }
        } catch (error) {
          console.error('Error saving data:', error);
        }
      };
  
      const rows = Array.from(editedRows);
      rows.forEach(row => {
        editRow(row);
      });
  
      setEditedRows(new Set());
    }
  }, [editedRows, data]);

  return (
    <div className='object-table'>
      <ZakupButtons
        onEditToggle={handleEditToggle}
        isEditing={isEditing}
        onExportExcel={handleExportExcel}
        onCopy={handleCopy}
      />
      <div className='object-3'>
        <div className='scrollable'>
          <table className='svod-table' ref={tableRef}>
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={index}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((_, row) => renderRow(row))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
