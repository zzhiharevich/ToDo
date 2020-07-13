import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import CreateAcc from './pages/create_account';
import AuthorizationPage from './pages/authorization';
import TodayPage from './pages/today';
import HomePage from './pages/home';
import ProtectedRoute from './utility/protectedRoutes';
import './index.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <ProtectedRoute path="/authorization" component={AuthorizationPage} />
        <ProtectedRoute path="/create_account" component={CreateAcc} />
        <ProtectedRoute path="/today" component={TodayPage}/>
      </Switch>
    </Router >
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);  
