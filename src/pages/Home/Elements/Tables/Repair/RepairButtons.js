import React, { useState } from 'react';
import { NaRemont } from './NaRemont';
import { SRemonta } from './SRemonta'

export default function Repair({ onEditToggle, isEditing, onCopy, onExportExcel }) {
  const [modalNaRemontIsOpen, setModalNaRemontIsOpen] = useState(false);
  const [modalSRemontIsOpen, setModalSRemontIsOpen] = useState(false);


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
          ()=> setModalNaRemontIsOpen(true)
        }>На ремонт</button>

        <NaRemont
          isOpen = {modalNaRemontIsOpen}
          onClose = {() => {setModalNaRemontIsOpen(false)}}
        />
        <button className='buttonTable' onClick={
          ()=> setModalSRemontIsOpen(true)
        }>Выпустить</button>

        <SRemonta
          isOpen = {modalSRemontIsOpen}
          onClose = {() => {setModalSRemontIsOpen(false)}}
        />
            <button className='buttonTable' onClick={onExportExcel}>Выгрузка excel</button>
        </div>
    </div>
  );
}
