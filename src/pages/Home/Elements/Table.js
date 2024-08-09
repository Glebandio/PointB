import React from 'react';
import Svod from './Tables/svod/Svod';
import Zakup from './Tables/zakup/Zakup';
import Terminal from './Tables/terminal/Terminal';
import Archive from './Tables/archiv/Archiv';
import Prodazhi from './Tables/prodachi/Prodazhi';
import Repair from './Tables/Repair/Repair';
import Podryad from './Tables/Podryadchiki/Podryad';
import KpClients from './Tables/kp clients/Kp_clients';
import Perevoz from './Tables/perevoz/Perevoz';
import Task from './Tables/Ruktask/Task';
import KPpartner from './Tables/KPPartner/KPPartner';
import Repos from './Tables/Repos/Repository';

export default function Table({ selectedMenuItem }) {

  function renderTableContent() {
    switch (selectedMenuItem) {
      case 0:
        return <Svod/>;
      case 1:
        return <Zakup/>;
      case 2:
        return <Terminal/>;
      case 3:
        return <Repair/>;
      case 4:
        return <Prodazhi/>;
      case 5:
        return <KPpartner/>;
      case 6:
        return <KpClients/>;
      case 7:
        return <Archive/>;
      case 8:
        return <Podryad/>;
      case 9:
        return <Task/>;
      case 10:
        return <Perevoz/>;
      case 11:
        return <Repos/>;
      default:
        return <div>Свод контейнеров</div>;
    }
  }

  return (
    <div className="object-2">
      {renderTableContent()}
    </div>
  );
}
