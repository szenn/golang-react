import React from 'react'
import {
    Route,
    Redirect,
  } from "react-router-dom";
import { useGlobalState } from '../../globalState';

function AuthRoute({ children, ...rest }) {
    const [globalState] = useGlobalState()
    return (
      <Route
        {...rest}
        render={({ location }) =>
            globalState.authenticated ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }

  export default AuthRoute