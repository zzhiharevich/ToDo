import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route
} from "react-router-dom";
import CreateAcc from './create_account';
import AuthorizationPage from'./authorization';
import './index.css';

function App(){
  return(
    <Router>
        <Route path="/" exact exact component={AuthorizationPage} />
        <Route path="/create_account" exact component={CreateAcc} />
     </Router>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);  
