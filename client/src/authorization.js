import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
  Link
} from "react-router-dom";
import './index.css';
import { faChevronCircleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class AuthorizationPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      logValue: '',
      passValue: '',
      subValue: 'LogIn',
      server: ''
    };

    this.submit = this.submit.bind(this);
    this.logHandleChange = this.logHandleChange.bind(this);
    this.passHandleChange = this.passHandleChange.bind(this);
  }

  submit = async e => {
    e.preventDefault();

    const response = await fetch('/authorization', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ login: this.state.logValue, password: this.state.passValue }),
    });
    
    const body = await response.text();
    this.setState({server: body});
  }

  logHandleChange(event){
    this.setState({logValue: event.target.value});
  }

  passHandleChange(event){
    this.setState({passValue: event.target.value});
  }


  render() {
    return (
      <div className="app">
        <div className="logo">
        <FontAwesomeIcon icon={faChevronCircleDown} />
        <p>ToDo</p>
        </div>
        <div className="links">
          <p>
            LogIn
          </p>
        </div>
        <form className="form" onSubmit={this.submit}>
          <label>
            <input type="text" value={this.state.logValue} onChange={this.logHandleChange} placeholder="LogIn"></input>
          </label>
          <label>
            <input type="password" value={this.state.passValue} onChange={this.passHandleChange} placeholder="Password"></input>
          </label>
          <button type="submit" className="subButton">{this.state.subValue}</button>
        </form>
        <div className="sep">
          <div className="separator"></div>
          <div className="middle_separator">OR</div>
          <div className="separator"></div>
        </div>
        <div className="g-signin2" data-width="380" data-height="40" data-longtitle="true" data-onsuccess="onSignIn"></div>
        <p>{this.state.server}</p>
        <p className="create_account_text">No account? <Link to="/create_account">Create account</Link></p>
      </div>
    );
  }
}

export default AuthorizationPage;