import React, { Component } from 'react';
import { faChevronCircleDown} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
    }

    login = async (e) => {
        e.preventDefault();

        const response = await fetch('/start', {
            method: 'POST',
        });

        const body = await response.text();
        if (body === 'redirect') {
            window.location.assign('/authorization');
        } else if (body === 'ok') {
            window.location.assign('/today');
        }
    }

    render() {
        return (
            <div className='home-page'>
                <header className='page-header'>
                    <div className="logo" onClick={() => {window.location.assign('/')}}>
                        <FontAwesomeIcon icon={faChevronCircleDown} />
                        <p>ToDo</p>
                    </div>
                </header>
                <p className='description'>To Do is a web-site that gives opportunity to plan your days and create checklists
                for important occasions. To Do is a web-site that will help you to
                organise your life and not to forget anything.
                </p>
                <button className='start-button' onClick={this.login}>Start</button>
            </div>
        )
    }
}

export default HomePage;