import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
// import Users from './components/user/pages/Users';
// import NewPlace from './components/places/pages/NewPlace';
import MainNavigation from './components/shared/Navigation/MainNavigation';
// import UserPlaces from './components/places/pages/UserPlaces';
// import UpdatePlace from './components/places/pages/UpdatePlace';
// import Auth from './components/user/pages/Auth';
import { AuthContext } from './components/shared/context/auth-context';
import { useAuth } from './components/shared/hooks/auth-hook';
import LoadingSpinner from './components/shared/UIElements/LoadingSpinner';

// not imported immediately only when necessary on the fly. users needed at the start but the other routes useful to lazy load.
// only need to do in App.js
const Users = React.lazy(() => import('./components/user/pages/Users'));
const NewPlace = React.lazy(() => import('./components/places/pages/NewPlace'));
const UserPlaces = React.lazy(() =>
  import('./components/places/pages/UserPlaces')
);
const UpdatePlace = React.lazy(() =>
  import('./components/places/pages/UpdatePlace')
);
const Auth = React.lazy(() => import('./components/user/pages/Auth'));

function App() {
  const { token, login, logout, userId } = useAuth();

  let routes;
  if (token) {
    routes = (
      <Switch>
        <Route path='/' exact>
          <Users />
        </Route>
        {/* colon encoded is dynamic segment. */}

        <Route path='/:userId/places' exact>
          <UserPlaces />
        </Route>
        <Route path='/places/new' exact>
          <NewPlace />
        </Route>
        {/* has to be after the previous route 'places/new' otherwise the route 'places/new will never be reached.  */}
        <Route path='/places/:placeId'>
          <UpdatePlace />
        </Route>
        <Redirect to='/' />
      </Switch>
    );
  } else {
    routes = (
      // {/* add switch to not evaluate routes after one route is true. */}

      <Switch>
        {/* by default without exact any path that starts with / will be render the component Users. */}

        <Route path='/' exact>
          <Users />
        </Route>
        {/* has to be after the previous route 'places/new' otherwise the route 'places/new will never be reached.  */}

        <Route path='/:userId/places' exact>
          <UserPlaces />
        </Route>
        <Route path='/auth'>
          <Auth />
        </Route>
        {/* if a different route, then it will automatically trigger it to route with just / */}

        <Redirect to='/auth' />
      </Switch>
    );
  }

  return (
    // wrap entire router with it. now every component has accesss to auth context. feed setUserId to context.
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        {/* if downloading on fly takes longer then react shows the jsx code you define in between fallback*/}
        <main>
          <Suspense
            fallback={
              <div className='center'>
                <LoadingSpinner />
              </div>
            }
          >
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
