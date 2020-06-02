import React, { Component } from 'react';
import './../index.css';
import { faChevronCircleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

class CreateAccountPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logValue: '',
            passValue: '',
            nameValue: '',
            subValue: 'Create',
            server: ''
        }

        this.submit = this.submit.bind(this);
        this.logHandleChange = this.logHandleChange.bind(this);
        this.passHandleChange = this.passHandleChange.bind(this);
        this.nameHandleChange = this.nameHandleChange.bind(this);
    }

    submit = async e => {
        e.preventDefault();

        var user = {
            name: this.state.nameValue,
            login : this.state.logValue,
            password: this.state.passValue
        }

        const response = await fetch('/create_account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        const body = await response.text();
        this.setState({ server: body });
    }

    nameHandleChange(event) {
        this.setState({ nameValue: event.target.value });
    }

    logHandleChange(event) {
        this.setState({ logValue: event.target.value });
    }

    passHandleChange(event) {
        this.setState({ passValue: event.target.value });
    }

    render() {
        return (
            <div className="app">
                <div className="logo">
                    <FontAwesomeIcon icon={faChevronCircleDown} />
                    <p>ToDo</p>
                </div>
                <div className="page-title">
                    <p>
                        Create Account
                    </p>
                </div>
                <form className="form" onSubmit={this.submit}>
                    <label>
                        <input type="text" value={this.state.nameValue} onChange={this.nameHandleChange} placeholder="Name"></input>
                    </label>
                    <label>
                        <input type="text" value={this.state.logValue} onChange={this.logHandleChange} placeholder="LogIn"></input>
                    </label>
                    <label>
                        <input type="password" value={this.state.passValue} onChange={this.passHandleChange} placeholder="Password"></input>
                    </label>
                    <button type="submit" className="subButton">{this.state.subValue}</button>
                </form>
                <p>{this.state.server}</p>
                <p className="link-text">Already have an account? <Link to="/">Authorization</Link></p>
            </div>
        );
    }
} 

export default CreateAccountPage;