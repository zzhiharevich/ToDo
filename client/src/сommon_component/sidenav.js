import React, { Component } from 'react';
import './../index.css';
import { Link } from 'react-router-dom';
import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class SideNav extends Component {

    render() {
        return (
            <div className="sidenav">
                <Link to="/today" className="links"><FontAwesomeIcon icon={faCalendarCheck} />  Today</Link>
            </div>
        );
    }
}

export default SideNav;