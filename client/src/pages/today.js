import React, { Component } from 'react';
import './../index.css';
import { faChevronCircleDown, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SideNav from './../сommon_component/sidenav';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Schedule(props) {
    let p = React.createElement('p', null, `${props.n}`);
    let time = React.createElement('div', { className: `time-${props.n}` }, p);
    let text_area = React.createElement('div', { className: `text-area-${props.n}`, onClick: props.e });

    return (React.createElement('div', { className: `element-${props.n}` }, [time, text_area]));
}

function DateInput(props) {
    return (<button id='date-input' onClick={props.onClick}>{props.value}</button>);
}

function ScheduleTask(props) {
    return (
        <form className="schedule-form">
            <input type="text" className="task-input"></input>
            <button className="schedule-btn ok">ok</button>
            <button className="schedule-btn cancel">not</button>
        </form>
    );
}

class TodayPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            navFlag: false,
            date: '',
            startDate: new Date(),
            elementCounter: '',
        }
        this.doNav = this.doNav.bind();
        this.renderSchedule = this.renderSchedule.bind();
        this.showScheduleTask = this.showScheduleTask.bind();
        this.addTask = this.addTask.bind();
    }

    showScheduleTask = () => {
        console.log('event');
    }

    renderSchedule = (value) => {
        return (<Schedule n={value} e={this.showScheduleTask} />)
    }

    addTask = () => {
        let root = document.querySelector('.existing-tasks');

        let button = document.createElement('button');
        let element = document.createElement('div');
        element.className = `element-`;
        element.innerHTML='<p>To finish this page!</p>';

        root.appendChild(element);
        console.log('new task');
    }

    doNav = () => {
        let sidenav = document.querySelector('.sidenav');
        let btn = document.querySelector('.sidenav-button');
        if (this.state.navFlag === false) {
            sidenav.style.width = "0px";
            this.setState({ navFlag: true });
            btn.innerHTML = '>';
        } else {
            sidenav.style.width = "250px";
            this.setState({ navFlag: false });
            btn.innerHTML = '<';
        }
    }

    render() {
        return (
            <div className="page">
                <header>
                    <div className="logo">
                        <FontAwesomeIcon icon={faChevronCircleDown} />
                        <p>ToDo</p>
                    </div>
                </header>
                <div className="today-page">
                    <SideNav />
                    <div className="main-content">
                        <div className="sidenavbutton">
                            <div className="sidenav-part">
                                <button className="sidenav-button" onClick={this.doNav}>></button>
                            </div>
                        </div>
                        <div className="part-1">
                            {this.renderSchedule(6)}
                            {this.renderSchedule(7)}
                            {this.renderSchedule(8)}
                            {this.renderSchedule(9)}
                            {this.renderSchedule(10)}
                            {this.renderSchedule(11)}
                            {this.renderSchedule(12)}
                            {this.renderSchedule(1)}
                            {this.renderSchedule(2)}
                            {this.renderSchedule(3)}
                            {this.renderSchedule(4)}
                            {this.renderSchedule(5)}
                            {this.renderSchedule(6)}
                            {this.renderSchedule(7)}
                            {this.renderSchedule(8)}
                            {this.renderSchedule(9)}
                            {this.renderSchedule(10)}
                            {this.renderSchedule(11)}
                            {this.renderSchedule(12)}
                        </div>
                        <div className="part-2">
                            <div id='date-picker'>
                                <DatePicker
                                    selected={this.state.startDate}
                                    onChange={date => this.setState({ startDate: date })}
                                    customInput={<DateInput />}
                                    dateFormat='MMMM d, yyyy'
                                />
                            </div>
                            <div className="tasks-list">
                                <div className='existing-tasks'>

                                </div>
                                <button id='new-task' onClick={this.addTask}><FontAwesomeIcon icon={faPlus} /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default TodayPage;