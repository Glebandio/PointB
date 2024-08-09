import React, { useState } from 'react';
import { NaPerevoz } from './NaPerevoz';
import { EndPerevoz } from './EndPerevoz';

export default function PerevozButt({ onEditToggle, isEditing, onCopy, onExportExcel }) {

  const [addPerevoz, setAddPerevoz] = useState(false)
  const [endPerevoz, setEndPerevoz] = useState(false)

  return (
    <div className='buttonTableRow'>
        <div>
            <button className='buttonTable' onClick={onCopy}>Скопировать </button>
        </div>
        <div>
            <button className='buttonTable' onClick={onEditToggle}>
                {isEditing ? 'Сохранить' : 'Редактирование'}
            </button>

            <button className='buttonTable' onClick={
              ()=> setAddPerevoz(true)
            }>Добавить перевозку</button>
            <NaPerevoz
              isOpen={addPerevoz}
              onClose = {() => setAddPerevoz(false)}
            />

            <button className='buttonTable' onClick={
              ()=> setEndPerevoz(true)
            }>Закончить</button>
            <EndPerevoz
              isOpen={endPerevoz}
              onClose = {() => setEndPerevoz(false)}
            />

            <button className='buttonTable' onClick={onExportExcel}>Выгрузка excel</button>
        </div>
    </div>
  );
}
