import React, { useState } from 'react';
import { KPpartnerModal } from './KPPratnerModal';
import { KPpartnerAddFolder } from './KPPartnerAddFolder';

export default function KPPartnerButtons() {

  const [modalAddfolderIsOpen, setModalAddfolderIsOpen] = useState(false)
  const [modalInfoIsOpen, setModalInfoIsOpen] = useState(false)

  return (
    <div className='buttonTableRow'>
        <div>
          <button className='buttonTable' onClick={
            ()=> setModalAddfolderIsOpen(true)
          }>Добавить папку</button>
          <button className='buttonTable' onClick={
            () => setModalInfoIsOpen(true)
          }>Добавить документ</button>
          <KPpartnerAddFolder
            isOpen={modalAddfolderIsOpen}
            onClose={()=> {setModalAddfolderIsOpen(false)}}
          />
          <KPpartnerModal
            isOpen = {modalInfoIsOpen}
            onClose = {() => {setModalInfoIsOpen(false)}}
          />
        </div>
    </div>
  );
}
