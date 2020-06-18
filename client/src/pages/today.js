import React, { Component } from 'react';
import './../index.css';
import { faChevronCircleDown, faPlus, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
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

function CreateNewTask(props) {
    return (
        <form onSubmit={props.submit} className="new-task-form">
            <input type="text" className="new-task-input" placeholder="Enter task..." onChange={props.inputHandler}></input>
            <div className="new-task-btn">
                <button type="submit" className="ok-btn"><FontAwesomeIcon icon={faCheck} />   </button>
                <button type="reset" className="cancel-btn"><FontAwesomeIcon icon={faTimes} /></button>
            </div>

        </form>
    );
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

function NewTask(props) {
    return (
        <div className={`element-${props.id}`}>
            <button class={`done-task${props.id}`} onClick={props.submit}></button>
            <p class={`text-task${props.content}`}>{props.status}</p>
        </div>
    );
}

class TodayPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            navFlag: false,
            date: '',
            startDate: new Date(),
            elementCounter: 0,
            newTaskInputValue: '',
            btnTaskStatus: ['done', 'ndone'],
            addBtnFlag: 'false',
        }
        this.doNav = this.doNav.bind(this);
        this.renderSchedule = this.renderSchedule.bind(this);
        this.showScheduleTask = this.showScheduleTask.bind(this);
        this.addTask = this.addTask.bind(this);
        this.submitNewTask = this.submitNewTask.bind(this);
        this.convertDate = this.convertDate.bind(this);
        this.loadPageContent = this.loadPageContent.bind(this);
        this.dateSwitch = this.dateSwitch.bind(this);
        this.taskAsDone = this.taskAsDone.bind(this);
    }

    componentDidMount() {
        this.loadPageContent(this.state.startDate);
    }

    loadPageContent = async (date) => {
        document.querySelector('.existing-tasks').innerHTML = '';

        const response = await fetch('/today-page', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ date: this.convertDate(date) }),
        });

        let body = await (response.json() || response.text());

        if (body.length === 0) {
            document.querySelector('.existing-tasks').innerHTML = '';
            return;
        } else {
            let numberOfTasks = body.length;

            this.setState({ elementCounter: numberOfTasks });

            for (let i = 0; i < body.length; i++) {
                this.renderTask(body[i].task_id, body[i].task_content, body[i].status)
                for (let key in body[i]) {
                    console.log(`${key} : ${body[i][key]}`)
                }
            }
        }
    }

    dateSwitch = (date) => {
        this.setState((state) => { return { startDate: date } });
        this.loadPageContent(date);
    }

    showScheduleTask = () => {
        console.log(`task`);
    }

    convertDate = (value) => {

        let date = new Date(value);

        let year, month, day;
        year = date.getFullYear();
        month = date.getMonth() + 1;
        if (month.length === 1) {
            month = 0 + month;
        }
        day = date.getDate();
        if (day.length === 1) {
            day = "0" + day;
        }
        return (`${year}-${month}-${day}`);
    }

    renderSchedule = (value) => {
        return (<Schedule n={value} e={this.showScheduleTask} />)
    }

    addTask = (e) => {

        //let newTaskFormElement = document.querySelector('.new-task-form');

        if (!this.state.addBtnFlag) {
            //newTaskFormElement.style.display = 'block';
            this.setState({addBtnFlag: true});
        } else {
            //newTaskFormElement.style.display = 'none';
            this.setState({addBtnFlag: false});
        }
    }

    newTaskInputHandler = (event) => {
        this.setState({ newTaskInputValue: event.target.value });
    }

    submitNewTask = async e => {

        e.preventDefault();

        this.setState((state) => {
            return { addBtnFlag: state.elementCounter};
        })

        let newTaskFormElement = document.querySelector('.new-task-form');
        let newTaskFormInput = document.querySelector('.new-task-input');

        const response = await fetch('/new-task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ date: this.convertDate(this.state.startDate), task: this.state.newTaskInputValue, status: this.state.btnTaskStatus[1] }),
        });

        const body = await (response.json());

        if (body.msg === 'Inserted') {
            this.renderTask(body.rowsNumber[0].rowsNumber, this.state.newTaskInputValue, this.state.btnTaskStatus[1]);

            //this.loadPageContent(this.state.startDate);

            newTaskFormInput.value = '';
            newTaskFormElement.style.display = "none";
        } else {
            console.log(body)
        }

    }

    taskAsDone = async (e, id, status) => {

        e.preventDefault();

        const response = await fetch('/task-done', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id: id, status: status}),
        });

        const body = await response.text();

        if(body === 'Updates') {
            this.loadPageContent(this.state.startDate)
        } else {
            console.log(body)
        }


    }

    renderTask = (id, content, status) => {
        let root = document.querySelector('.existing-tasks');

        let element = document.createElement('div');
        element.className = `element-${id}`;

        let button = document.createElement('button');
        button.className = `done-task-${id}`;
        

        let p = document.createElement('p');
        p.className = `text-task-${id}`;
        p.innerHTML = `${content}`;


        if (status === 'done') {
            button.style.background = '#67C50A';
            button.onclick = (e) => {this.taskAsDone(e, id, this.state.btnTaskStatus[1])};
        } else {
            button.onclick = (e) => {this.taskAsDone(e, id, this.state.btnTaskStatus[0])};
            button.innerHTML = '';
        }

        element.appendChild(button);
        element.appendChild(p);
        root.appendChild(element);
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
        let addButton;
        let newTaskForm;
        if(!this.state.addBtnFlag) {
            addButton = <button id='new-task' onClick={this.addTask}><FontAwesomeIcon icon={faTimes} /></button>
            newTaskForm = <CreateNewTask submit={this.submitNewTask} inputHandler={this.newTaskInputHandler} />
        } else{
            newTaskForm='';
            addButton = <button id='new-task' onClick={this.addTask}><FontAwesomeIcon icon={faPlus} /></button>
        }

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
                                <button className="sidenav-button" onClick={this.doNav}>&gt;</button>
                            </div>
                        </div>
                        <div className="part-1" onLoad={this.state.scheduleLoading}>
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
                                    onChange={this.dateSwitch}
                                    customInput={<DateInput />}
                                    dateFormat='MMMM d, yyyy'
                                />
                            </div>
                            <div className="tasks-list">
                                <div className='existing-tasks'>
                                </div>
                                {addButton}
                                {newTaskForm}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default TodayPage;