

import React from 'react';

interface HeaderProps {
  toggleModal: any;
  nbOfContacts: any;
}

const Header: React.FC<HeaderProps> = ({ toggleModal, nbOfContacts }) => {
  return (
    <header className='header'>
      <div className='container'>
        <h3>Proejct List ({nbOfContacts})</h3>
        <button onClick={() => toggleModal(true)} className='btn'>
          <i className='bi bi-plus-square'></i> Add New Project
        </button>
      </div>
    </header>
  );
}

export default Header;

