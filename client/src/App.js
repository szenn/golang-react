import React from 'react';
import { BrowserRouter as Router, Route, Link,Switch } from "react-router-dom";

import './App.css';
import Login from './components/Login';
import Admin from './components/Admin';
import AuthRoute from './components/hoc/AuthRoute';

function App() {

  
  return (
    <Router>

    <div className="App">
       <Switch>
          {/* <Route path="/public">
            <PublicPage />
          </Route> */}

          <Route path="/login">
            <Login />
          </Route>
          <AuthRoute path="/admin">
            <Admin />
          </AuthRoute>
        </Switch>
    </div>
    </Router>
  );
}

export default App;
