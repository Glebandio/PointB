import React, { useState, useRef, useEffect, useCallback } from 'react';
import ProdazhiButtons from "./ProdazhiButtons";
import { ReactComponent as IconClose } from "./icon-close.svg";
import './Prodazhi.css';
import * as XLSX from 'xlsx';


export default function Prodazhi() {
  const [selectedCells, setSelectedCells] = useState(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState([])
  const [editedRows, setEditedRows] = useState(new Set());

  const [isModalOpen, setIsModalOpen] = useState(false); // состояние для открытия/закрытия модального окна
  const [selectedRow, setSelectedRow] = useState(null)
  const tableRef = useRef(null);

  const columns = [
    "№", "Клиент", "Дата сделки", "Статус сделки", "Стоимость продажи", "Маржа по сделке",
    "Вид рассчета", "НДС", "Количество КТК", "Город", "Ответственный менеджер",
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
    fetch('http://localhost:8080/api/prodazhi')
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
          const response = await fetch('/api/editProdazhi', {
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

  const handleRowDoubleClick = (row) => {
    setSelectedRow(data[row]); // сохраняем данные строки
    setIsModalOpen(true);      // открываем модальное окно
  };

  function renderRow(row) {
    return (
      <tr key={row} onDoubleClick={() => handleRowDoubleClick(row)}>
        {columns.map((_, col) => renderCell(row, col))}
      </tr>
    );
  }

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Продажи");
    XLSX.writeFile(wb, "SailsData.xlsx");
  };

  const Modal = ({ isOpen, onClose, rowData }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      if (isOpen && rowData && rowData.id) {
        setLoading(true);
        setError(null);
  
        // POST запрос на сервер с передачей id через тело запроса
        fetch('/api/info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: rowData.id }), // Передаем id в теле запроса
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Ошибка при получении данных');
            }
            return response.json();
          })
          .then((result) => {
            setData(result.data); // Извлекаем только data
            setLoading(false);
          })
          .catch((error) => {
            setError(error.message);
            setLoading(false);
          });
      }
    }, [isOpen, rowData]);
  
    // Функция для обработки изменений полей ввода
    const handleChange = (e) => {
      const { name, value } = e.target;
      setData((prevData) => ({
        ...prevData,
        [name]: value,  // Обновляем только изменённое поле
      }));
    };
  
    // Функция для сохранения изменений
    const handleSave = () => {
      // POST запрос для сохранения изменений
      fetch('/api/editinfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),  // Отправляем все данные, включая изменённые
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Ошибка при сохранении данных');
          }
          return response.json();
        })
        .then((result) => {
          console.log('Изменения успешно сохранены', result);
          onClose();  // Закрываем модальное окно после успешного сохранения
        })
        .catch((error) => {
          console.error('Ошибка сохранения:', error.message);
        });
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="modal">
        <div className="modal-wrapper">
          <div className="modal-content">
            <button className="modal-close-button" onClick={onClose}>
              <IconClose />
            </button>
            <h2>Детали строки</h2>
            {loading ? (
              <p>Загрузка...</p>
            ) : error ? (
              <p>Ошибка: {error}</p>
            ) : (
              <form>
                <div>
                  <label>ID:</label>
                  <p>
                    <input type="text" value={data?.id || ''} readOnly />
                  </p>
                </div>
                <div>
                  <label>Клиент:</label>
                  <p>
                    <input 
                      type="text" 
                      name="klient" 
                      value={data?.klient || ''} 
                      onChange={handleChange} 
                    />
                  </p>
                </div>
                <div>
                  <label>Дата сделки:</label>
                  <p>
                    <input 
                      type="text" 
                      name="datas" 
                      value={data?.datas || ''} 
                      onChange={handleChange} 
                    />
                  </p>
                </div>
                <div>
                  <label>Статус сделки:</label>
                  <p>
                    <input 
                      type="text" 
                      name="status" 
                      value={data?.status || ''} 
                      onChange={handleChange} 
                    />
                  </p>
                </div>
                <div>
                  <label>Стоимость продажи:</label>
                  <p>
                    <input 
                      type="text" 
                      name="stoimost" 
                      value={data?.stoimost || ''} 
                      onChange={handleChange} 
                    />
                  </p>
                </div>
                <div>
                  <label>Маржа по сделке:</label>
                  <p>
                    <input 
                      type="text" 
                      name="marzha" 
                      value={data?.marzha || ''} 
                      onChange={handleChange} 
                    />
                  </p>
                </div>
                <div>
                  <label>Вид расчета:</label>
                  <p>
                    <input 
                      type="text" 
                      name="vid" 
                      value={data?.vid || ''} 
                      onChange={handleChange} 
                    />
                  </p>
                </div>
                <div>
                  <label>НДС:</label>
                  <p>
                    <input 
                      type="text" 
                      name="nds" 
                      value={data?.nds || ''} 
                      onChange={handleChange} 
                    />
                  </p>
                </div>
                <div>
                  <label>Количество КТК:</label>
                  <p>
                    <input 
                      type="text" 
                      name="kolvo" 
                      value={data?.kolvo || ''} 
                      onChange={handleChange} 
                    />
                  </p>
                </div>
                <div>
                  <label>Город:</label>
                  <p>
                    <input 
                      type="text" 
                      name="city" 
                      value={data?.city || ''} 
                      onChange={handleChange} 
                    />
                  </p>
                </div>
                <div>
                  <label>Ответственный менеджер:</label>
                  <p>
                    <input 
                      type="text" 
                      name="manager" 
                      value={data?.manager || ''} 
                      onChange={handleChange} 
                    />
                  </p>
                </div>
                <div>
                  <label>Контейнеры:</label>
                  <p>
                    <input 
                      type="text" 
                      name="containers" 
                      value={data?.containers || ''} 
                      onChange={handleChange} 
                    />
                  </p>
                </div>
              </form>
            )}
            <div style={{ display: 'flex' }}>
              <button className="button-modal" onClick={onClose}>Закрыть</button>
              <button className="button-modal" onClick={handleSave}>Сохранить</button>
            </div>
          </div>
        </div>
      </div>
    );
  };


  return (
    
    <div className='object-table'>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        rowData={selectedRow}
      />
      <ProdazhiButtons 
      onEditToggle={handleEditToggle} 
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
              {data.map((_, row) => renderRow(row))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
