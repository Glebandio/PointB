import React, { useState } from 'react';

export default function Menu({ onMenuItemClick }) {
  const [activeIndex, setActiveIndex] = useState(null);

  function Button({ children, isActive, onClick }) {
    return (
      <button className={isActive ? 'selectedButtonMenu' : 'buttonMenu'} onClick={onClick}>
        {children}
      </button>
    );
  }

  function handleButtonClick(index) {
    setActiveIndex(index);
    onMenuItemClick(index);
  }

  const menuItems = [
    'Свод контейнеров',
    'Закуп',
    'Терминалы',
    'Ремонт',
    'Продажи',
    'КП партнерские',
    'КП для клиентов',
    'Архив',
    'Подрядчики',
    'Мои задачи',
    'Перевозки',
    'Репозиторий'
  ];

  return (
    <div className="object-1">
      {menuItems.map((item, index) => (
        <Button 
          key={index} 
          isActive={activeIndex === index} 
          onClick={() => handleButtonClick(index)}
        >
          {item}
        </Button>
      ))}
    </div>
  );
}
