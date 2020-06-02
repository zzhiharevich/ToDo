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
import './index.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={AuthorizationPage} />
        <Route path="/create_account" component={CreateAcc} />
        <Route path="/today" component={TodayPage}/>
      </Switch>
    </Router >
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);  
