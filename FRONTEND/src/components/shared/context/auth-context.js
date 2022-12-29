// a function react offers.
import { createContext } from 'react';

// can call it to craete context object which we can share between components.

// initilize our context, login and logout are methods.
// object that we can share between components and we can update it, any component that listens to it will also get updated.
export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  token: null,
  login: () => {},
  logout: () => {},
});
