// that will be collection of links which we will render in main navigation.
// useContext allows us to tap into context and listen to it.
import React, { useContext } from 'react';
import './NavLinks.css';
// special link which can analyze the url and allow us to color the link differently
// if we are on the page the link leads to, to show th  user currently active link.
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/auth-context';

const NavLinks = (props) => {
  // get back object which holds the latest context. the component will rerender whenever the context changes.
  const auth = useContext(AuthContext);

  return (
    <ul className='nav-links'>
      <li>
        <NavLink to='/' exact>
          {' '}
          ALL USERS
        </NavLink>
      </li>
      {/* my places rendered when logged in only. */}
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to='/places/new'> ADD PLACES</NavLink>
        </li>
      )}
      {/* render if we are not logged in. */}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to='/auth'> AUTHENTICATE</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>LOGOUT</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
