import { useState, useCallback, useEffect } from 'react';

// behind the scene data.
let logoutTimer; // not which will rerender component.

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();

  // wrap in useCallback so it doesn't get recreated unnecessarily and to avoid infinite loop.
  // dependency empty array means function will never be recreated.
  // with useCallback it will run only once.
  // either have existing expirationDate because automatically logged in because of stored in local storage.
  // or if we don't then generate tnew one.
  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    // now + 1 hour long.
    // shadow variable.
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);

    setTokenExpirationDate(tokenExpirationDate);

    // global js browser api.
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString(), // to ensure no data get lost when stringified. stores all the important date information and can be converted to date later.
      })
    );
  }, []);

  // because of useCallback it will never be recreated or infinite loop.
  const logout = useCallback(() => {
    setToken(token);
    setUserId(null);
    setTokenExpirationDate(null);
    localStorage.removeItem('userData');
  }, []);

  // either changed because we logged in through form or auto login.
  // or because logged out.
  // if token changes then work with timer.
  // when we logout clear timer. login set a timer.
  useEffect(() => {
    if (token && tokenExpirationDate) {
      // point at the logout function if the timeout triggers.
      // we get difference in milliseconds.
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    // converts it to date object.
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date() // means expiration date is greater so token is valid.
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration) // forward extracted expiration date.
      );
    }
  }, [login]);

  return { token, login, logout, userId };
};
