import React, { useState, useRef, useEffect, useCallback } from 'react';
import KpClientsButt from "./KpClientsButt";
import './Kp_clients.css'; // Не забудьте создать и добавить стили

import * as XLSX from 'xlsx';


export default function KpClients() {
  const [selectedCells, setSelectedCells] = useState(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState([]);
  const tableRef = useRef(null);

  const columns = [
    "№", "Страна", "Город", "Терминал", 
    "Номер контейнера",  "Фото",  "YOM",
    "Тип",  "Оценка"
  ];

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

  const fetchData = useCallback(() => {
    fetch('/api/getkpc')
      .then(res => res.json())
      .then(fetchedData => setData(fetchedData))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Fetch data every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [fetchData]);

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

  function handleCellChange(row, col, newValue) {
    const newData = data.map((rowData, rIdx) => 
      rowData.map((cellData, cIdx) => 
        rIdx === row && cIdx === col ? newValue : cellData
      )
    );
    setData(newData);
  }

  function renderCell(row, col) {
    const cellKey = `${row}-${col}`;
    const isSelected = selectedCells.has(cellKey);
    const cellData = data[row][Object.keys(data[row])[col]];
    const columnName = columns[col];

    if (columnName === "Фото") {
      let filenames;
      try {
        filenames = cellData ? JSON.parse(decodeURIComponent(cellData)) : [];
      } catch (e) {
        filenames = [];
      }
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

    const photoUrl = `/uploads/images/${encodeURIComponent(filename)}`;
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
    XLSX.utils.book_append_sheet(wb, ws, "КП клиенты");
    XLSX.writeFile(wb, "KpClientsData.xlsx");
  };

  return (
    <div className='object-table'>
      <KpClientsButt 
      onEditToggle={handleEditToggle} 
      isEditing={isEditing} 
      onCopy={handleCopy} 
      onExportExcel = {handleExportExcel}
      />
      <div className='object-3'>
        <div className='scrollable'>
        <table className='kpclients-table' ref={tableRef}>
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
