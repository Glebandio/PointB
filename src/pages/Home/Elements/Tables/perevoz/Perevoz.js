import React, { useState, useRef, useEffect, useCallback } from 'react';
import PerevozButt from "./PerevozButt";
import './Perevoz.css'; // Не забудьте создать и добавить стили

import * as XLSX from 'xlsx';


export default function Perevoz() {
  const [selectedCells, setSelectedCells] = useState(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState([]);
  const [editedRows, setEditedRows] = useState(new Set());
  const tableRef = useRef(null);

  const columns = [
    "№", "Подрядчик", "Дата подписания сделки", "Количество контейнеров", "Город А", 
    "Сток в терминале города А",  "Город Б", "Сток в терминале города Б",
    "Цена (+ или -)", "Статус оплаты",  "Ответственный менеджер"
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
    fetch('http://localhost:8080/api/perevoz')
      .then(res => res.json())
      .then(fetchedData => setData(fetchedData))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    fetchData();
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
          const response = await fetch('/api/editPerevoz', {
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

  
  function renderCell(row, col) {
    const cellKey = `${row}-${col}`;
    const isSelected = selectedCells.has(cellKey);
    const cellData = data[row][Object.keys(data[row])[col]];

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
    XLSX.utils.book_append_sheet(wb, ws, "Перевозки");
    XLSX.writeFile(wb, "PerevozkiData.xlsx");
  };

  return (
    <div className='object-table'>
      <PerevozButt 
      onEditToggle={handleEditToggle} 
      isEditing={isEditing} 
      onCopy={handleCopy} 
      onExportExcel = {handleExportExcel}
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
