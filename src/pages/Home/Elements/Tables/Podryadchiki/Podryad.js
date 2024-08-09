import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import PodryadButtons from "./PodryadButtons";
import './Podryad.css'; // Ensure you create and add styles

import * as XLSX from 'xlsx';


export default function Podryad() {
  const [selectedCells, setSelectedCells] = useState(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState([]);
  const tableRef = useRef(null);

  const columns = ["№", "Имя контрагента", "ИНН", "Сопроводительные документы"];
  const columnKeys = useMemo(() => ["id", "namecontr", "inn", "soprdocs"], []);

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
    fetch('/api/Podryad')
      .then(res => res.json())
      .then(json => {
        const updatedData = json.map(row => {
          let soprdocs = [];
          if (typeof row.soprdocs === 'string') {
            soprdocs = row.soprdocs.split(',').map(doc => doc.trim());
          } else if (Array.isArray(row.soprdocs)) {
            soprdocs = row.soprdocs;
          }
          return { ...row, soprdocs };
        });
        setData(updatedData);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
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
      rIdx === row ? { ...rowData, [columnKeys[col]]: newValue } : rowData
    );
    setData(newData);
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

  function renderRow(row, rowIndex) {
    return (
      <tr key={rowIndex}>
        {columns.map((_, colIndex) => {
          return renderCell(row, rowIndex, colIndex);
        })}
      </tr>
    );
  }

  function renderCell(row, rowIndex, colIndex) {
    const cellKey = `${rowIndex}-${colIndex}`;
    const isSelected = selectedCells.has(cellKey);
    const cellData = data[rowIndex] ? data[rowIndex][columnKeys[colIndex]] : '';

    const handleFileClick = (filename) => {
      handleFileDownload(filename);
    };

    return (
      <td
        key={cellKey}
        className={isSelected ? 'selected-cell' : 'cell'}
        onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
        onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
      >
        {isEditing ? (
          <input 
            type="text" 
            value={cellData}
            onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
            className="editable-cell"
          />
        ) : (
          <>
            {Array.isArray(cellData) ? cellData.map((doc, index) => (
              <span key={index} className="file-wrapper">
                <span
                  className="file-download"
                  onClick={() => handleFileClick(doc.trim())}
                  style={{ cursor: 'pointer', marginRight: '5px' }}
                >
                  📄
                </span>
                <span
                  className="file-name"
                  onClick={() => handleFileClick(doc.trim())}
                  style={{ cursor: 'pointer' }}
                >
                  {doc.trim()}
                </span>
                {index < cellData.length - 1 && ', '}
              </span>
            )) : (
              colIndex !== columnKeys.length - 1 && cellData
            )}
          </>
        )}
      </td>
    );
  }

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Подрядчики");
    XLSX.writeFile(wb, "PodryadData.xlsx");
  };

  return (
    <div className='object-table'>
      <PodryadButtons onEditToggle={handleEditToggle} 
      isEditing={isEditing} 
      onCopy={handleCopy} 
      onExportExcel = {handleExportExcel}
      />
      <div className='object-3'>
        <div className='scrollable'>
          <table className='podryad-table' ref={tableRef}>
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={index}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((rowData, rowIndex) => renderRow(rowData, rowIndex))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
