import React, { useState } from 'react';
import { ArchivModal } from './ArchivModal';

export default function ArchiveButtons({ onEditToggle, isEditing, onCopy }) {
  const [modalInfoIsOpen, setModalInfoIsOpen] = useState(false);

  
  return (
    <div className='buttonTableRow'>
      <div>
        <button className='buttonTable' onClick={onCopy}>Скопировать</button>
      </div>
      <div>
        <button className='buttonTable' onClick={onEditToggle}>
          {isEditing ? 'Сохранить' : 'Редактирование'}
        </button>
        <button className='buttonTable' onClick={
          ()=> setModalInfoIsOpen(true)
        }>Вернуть контейнер</button>

        <ArchivModal
          isOpen = {modalInfoIsOpen}
          onClose = {() => {setModalInfoIsOpen(false)}}
        />

        <button className='buttonTable' /*onClick={onExportExcel}*/>Выгрузка excel</button>
      </div>
    </div>
  );
}
