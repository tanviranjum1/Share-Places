import React from 'react';
import './MainHeader.css';

const MainHeader = (props) => {
  return (
    <header className='main-header'>
      {/* // allow any html elements or any custom components to be renderable here. */}
      {props.children}
    </header>
  );
};

export default MainHeader;
