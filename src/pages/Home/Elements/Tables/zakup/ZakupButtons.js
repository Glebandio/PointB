import React, { useState } from 'react';
import { ZakupModal } from './ZakupModal';
import { ParserModal } from './ParserModal';

export default function ZakupButtons({ onEditToggle, isEditing, onCopy, onExportExcel }) {
  const [modalInfoIsOpen, setModalInfoIsOpen] = useState(false);
  const [modalParserOpen, setModalParserOpen] = useState(false);

  return (
    <div className='buttonTableRow'>
      <div>
        <button className='buttonTable' onClick={onCopy}>Скопировать</button>
      </div>
      <div>
        
        <button className='buttonTable' onClick={() => setModalParserOpen(true)}>Спарсить с Excel</button>

        <ParserModal
          isOpen={modalParserOpen}
          onClose={() => {setModalParserOpen(false);}}
        />

        <button className='buttonTable' onClick={onEditToggle}>
          {isEditing ? 'Сохранить' : 'Редактирование'}
        </button>


        <button className='buttonTable' onClick={() => setModalInfoIsOpen(true)}>Добавить контейнер</button>

        <ZakupModal
          isOpen={modalInfoIsOpen}
          onClose={() => { setModalInfoIsOpen(false); }}
        />

        <button className='buttonTable' onClick={onExportExcel}>Выгрузка excel</button>
      </div>
    </div>
  );
}
