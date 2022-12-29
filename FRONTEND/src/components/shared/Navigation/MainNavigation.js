// part of the header which will be the shell which provides styling, the main
// navigation component later.
// main navigation componeont will be the component that has the links.
import MainHeader from './MainHeader';
import React, { Fragment, useState } from 'react';
import './MainNavigation.css';
import { Link } from 'react-router-dom';
import NavLinks from './NavLinks';
import SideDrawer from './SideDrawer';
import Backdrop from '../UIElements/Backdrop';

const MainNavigation = (props) => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const openDrawerHandler = () => {
    setDrawerIsOpen(true);
  };

  // a new component as background to the drawer. so that when we click the background we close the drawer.
  const closeDrawerHandler = () => {
    setDrawerIsOpen(false);
  };

  return (
    <Fragment>
      {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
      <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
        <nav className='main-navigation__drawer-nav'>
          <NavLinks />
        </nav>
      </SideDrawer>

      <MainHeader>
        {/* spans to render hamburger icon. */}
        <button
          className='main-navigation__menu-btn'
          onClick={openDrawerHandler}
        >
          {' '}
          <span />
          <span />
          <span />
        </button>
        {/* to take us to the main page when we click title of the app. */}
        <h1 className='main-navigation__title'>
          <Link to='/'>YourPlaces</Link>
        </h1>
        <nav className='main-navigation__header-nav'>
          <NavLinks />
        </nav>
      </MainHeader>
    </Fragment>
  );
};

export default MainNavigation;
