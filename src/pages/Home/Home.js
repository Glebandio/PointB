import React, { useState } from 'react';
import Menu from './Elements/Menu';
import Table from './Elements/Table';
import './Home.css'
import { useParams } from 'react-router-dom';

export default function Home() {
  const { user, position } = useParams();
  const [selectedMenuItem, setSelectedMenuItem] = useState(0);

  return (
    <div className="Home">
      <div>
        <header className="header">
          <strong className='logo'>PointB</strong>
          <div>
            <span>{user}</span>
            <span>{position}</span>
          </div>
        </header>
      </div>
      <div className='bodyHome'>
        <Menu onMenuItemClick={setSelectedMenuItem} />
        <Table selectedMenuItem={selectedMenuItem} />
      </div>
      <footer className='footerHome'>

      </footer>
    </div>
  );
}
