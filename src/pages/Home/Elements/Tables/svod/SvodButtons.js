import React from 'react';

export default function SvodButtons({ onEditToggle, isEditing, onCopy, onExportExcel }) {
  return (
    <div className='buttonTableRow'>
        <div>
            <button className='buttonTable' onClick={onCopy}>Скопировать </button>
        </div>
        <div>
            <button className='buttonTable' onClick={onEditToggle}>
                {isEditing ? 'Сохранить' : 'Редактирование'}
            </button>
            <button className='buttonTable' onClick={onExportExcel}>Выгрузка excel</button>
        </div>
    </div>
  );
}
