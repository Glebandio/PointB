import React, { useState } from 'react';
import { TerminalModal } from './TerminalModal';

export default function TerminalButtons({ onEditToggle, isEditing, onCopy, onExportExcel}) {
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
        }>Добавить терминал</button>

        <TerminalModal
          isOpen = {modalInfoIsOpen}
          onClose = {() => {setModalInfoIsOpen(false)}}
        />
            <button className='buttonTable' onClick={onExportExcel}>Выгрузка excel</button>
        </div>
    </div>
  );
}
