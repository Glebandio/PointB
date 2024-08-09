import React, {useState} from 'react';
import { ProdazhiModal } from './ProdazhiModal';

export default function ProdazhiButtons({ onEditToggle, isEditing, onCopy, onExportExcel}) {

  const [modalProdazhi, setModalProdazhi] = useState(false)

  return (
    <div className='buttonTableRow'>
        <div>
            <button className='buttonTable' onClick={onCopy}>Скопировать </button>
        </div>
        <div>
            <button className='buttonTable' onClick={() => setModalProdazhi(true)}>Добавить сделку</button>
            <ProdazhiModal
              isOpen={modalProdazhi}
              onClose = {() => setModalProdazhi(false)}
            />
            <button className='buttonTable' onClick={onEditToggle}>
                {isEditing ? 'Сохранить' : 'Редактирование'}
            </button>
            <button className='buttonTable' onClick={onExportExcel}>Выгрузка excel</button>
        </div>
    </div>
  );
}
