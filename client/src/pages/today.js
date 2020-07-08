import React, { Component } from 'react';
import Select from 'react-select'
import './../index.css';
import { faChevronCircleDown, faPlus, faCheck, faTimes, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SideNav from './../сommon_component/sidenav';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Schedule(props) {
    let p = React.createElement('button', { className: `time-button-${props.n}`, onClick: (e) => { props.e(e, props.n) } }, `${props.n}`);
    let time = React.createElement('div', { className: `time-${props.n}` }, p);
    let text_area = React.createElement('div', { className: `text-area-${props.n}`, });

    return (React.createElement('div', { className: `schedule-element-${props.n}` }, [time, text_area]));
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
        <div className={`add-schedule-task`}>
            <form onSubmit={props.submit} className={`schedule-form`}>
                <button className="close-form-btn cancel-btn" onClick={props.close}><FontAwesomeIcon icon={faTimes} /></button>
                <h1>Schedule Task</h1>
                <div className='schedule-task-settings'>
                    <input type="time" className="schedule-task-time" required min={`00:00`} max={`23:59`} onChange={props.timeHandler} />
                    <input type="text" className={`task-input`} required placeholder="Enter task..." onChange={props.inputHandler}></input>
                </div>
                <div className="schedule-task-btn">
                    <button type="submit" className="ok-btn"><FontAwesomeIcon icon={faCheck} />   </button>
                    <button type="reset" className="cancel-btn"><FontAwesomeIcon icon={faTimes} /></button>
                </div>
            </form>
        </div>
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
            newTaskInputValue: '',
            scheduleInputValues: '',
            timeInputValue: '',
            btnTaskStatus: ['done', 'ndone'],
            addBtnFlag: false,
            addScheduleTaskFlag: false,
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
        this.deleteTask = this.deleteTask.bind(this);
        this.renderScheduleTask = this.renderScheduleTask.bind(this);
        this.submitScheduleTask = this.submitScheduleTask.bind(this);
        this.closeScheduleForm = this.closeScheduleForm.bind(this);
        this.loadScheduleTasks = this.loadScheduleTasks.bind(this);
        this.renderNewScheduleTask = this.renderNewScheduleTask.bind(this);
        this.renderTask = this.renderTask.bind(this);
        this.deleteScheduleTask = this.deleteScheduleTask.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        this.loadPageContent(this.state.startDate);
        this.loadScheduleTasks(this.state.startDate);
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
            for (let i = 0; i < body.length; i++) {
                this.renderTask(body[i].task_id, body[i].task_content, body[i].status)
            }
        }
    }

    loadScheduleTasks = async (date) => {

        for (let i = 0; i < 24; i++) {
            document.querySelector(`.text-area-${i}`).innerHTML = '';
        }

        const response = await fetch('/schedule-tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ date: this.convertDate(date) }),
        });

        let body = await (response.json() || response.text());

        if (body.length === 0) {
            return;
        } else {
            for (let i = 0; i < body.length; i++) {
                let array = String(body[i].time).split('');
                let time;
                if (array.length === 3) {
                    array.unshift("0");
                }
                time = `${array[0]}${array[1]}:${array[2]}${array[3]}`;
                this.renderNewScheduleTask(body[i].schedule_task_id, time, body[i].content);
            }
        }
    }

    dateSwitch = (date) => {
        this.setState((state) => { return { startDate: date } });
        this.loadPageContent(date);
        this.loadScheduleTasks(date);
    }


    showScheduleTask = (e, n) => {
        e.preventDefault()
        let element = document.querySelector(`.add-schedule-task`);
        let style = element.style.display;
        element.style.display = 'block';
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

        if (!this.state.addBtnFlag) {
            this.setState({ addBtnFlag: true });
        } else {
            this.setState({ addBtnFlag: false });
        }
    }

    newTaskInputHandler = (event) => {
        this.setState({ newTaskInputValue: event.target.value });
    }

    scheduleInputHandler = (e) => {
        this.setState({ scheduleInputValues: e.target.value });
    }

    timeInputHandler = (e) => {
        this.setState({ timeInputValue: e.target.value })
    }

    submitNewTask = async e => {

        e.preventDefault();

        const response = await fetch('/new-task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ date: this.convertDate(this.state.startDate), task: this.state.newTaskInputValue, status: this.state.btnTaskStatus[1] }),
        });

        const body = await (response.json());

        console.log(body.session);

        if (body.msg === 'Inserted') {
            this.renderTask(body.rowsNumber[0].rowsNumber, this.state.newTaskInputValue, this.state.btnTaskStatus[1]);
        }

        this.setState((state) => {
            return { addBtnFlag: false };
        })

    }

    submitScheduleTask = async (e) => {
        e.preventDefault();

        let hours;
        let minutes = this.state.timeInputValue.split(':')[1];

        if (this.state.timeInputValue.split(':')[0].split('')[0] === "0") { hours = this.state.timeInputValue.split(':')[0].split('')[1]; }
        else { hours = this.state.timeInputValue.split(':')[0]; };

        let time = Number(`${hours}${minutes}`);

        const response = await fetch('/new-schedule-task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ time: time, date: this.convertDate(this.state.startDate), task: this.state.scheduleInputValues }),
        });

        const body = await (response.json());

        if (body.msg === 'Inserted') {
            this.renderNewScheduleTask(body.rowsNumber[0].rowsNumber, this.state.timeInputValue, this.state.scheduleInputValues);
            this.closeScheduleForm();
        } else {
            alert('You already have plans at this time. Choose anoser');
        }
    }

    deleteScheduleTask = async (e, id) => {
        e.preventDefault();

        const response = await fetch('/delete-schedule-task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id }),
        });

        const body = await response.text();

        if (body === 'Deleted') {
            document.querySelector(`.task-${id}`).remove();
        }
    }

    taskAsDone = async (e, id, status) => {

        e.preventDefault();

        const response = await fetch('/task-done', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id, status: status }),
        });

        const body = await response.text();

        if (body === 'Updates') {
            this.loadPageContent(this.state.startDate)
        }


    }

    deleteTask = async (e, id) => {
        e.preventDefault();

        const response = await fetch('/delete-task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id }),
        });

        const body = await response.text();

        if (body === 'Deleted') {
            this.loadPageContent(this.state.startDate)
        }
    }

    renderTask = (id, content, status) => {
        let root = document.querySelector('.existing-tasks');

        let element = document.createElement('div');
        element.className = `task-element-${id}`;

        let button = document.createElement('button');
        button.className = `done-task-${id}`;


        let p = document.createElement('p');
        p.className = `text-task-${id}`;
        p.innerHTML = `${content}`;

        let delete_button = document.createElement('button');
        delete_button.className = `delete-btn-task-${id}`;
        delete_button.textContent = 'Delete';
        delete_button.onclick = (e) => { this.deleteTask(e, id) };


        if (status === 'done') {
            button.style.background = '#67C50A';
            button.onclick = (e) => { this.taskAsDone(e, id, this.state.btnTaskStatus[1]) };
        } else {
            button.onclick = (e) => { this.taskAsDone(e, id, this.state.btnTaskStatus[0]) };
            button.innerHTML = '';
        }

        element.appendChild(button);
        element.appendChild(p);
        element.appendChild(delete_button);
        root.appendChild(element);
    }

    renderNewScheduleTask = (id, time, content) => {
        let hours;
        let minutes = time.split(':')[1];

        if (time.split(':')[0].split('')[0] === "0") { hours = time.split(':')[0].split('')[1]; }
        else { hours = time.split(':')[0]; }

        let root = document.querySelector(`.text-area-${hours}`);

        let task_div = document.createElement('div');
        task_div.className = `task-${id}`;

        let p_time = document.createElement('p');
        p_time.className = `min-${id}`;
        p_time.textContent = `:${minutes}`

        let p_content = document.createElement('p');
        p_content.className = `content-${id}`;
        p_content.textContent = `${content}`;

        let delete_button = document.createElement('button');
        delete_button.className = `delete-${id}`;
        delete_button.onclick = (e) => { this.deleteScheduleTask(e, Number(`${id}`)) };

        task_div.appendChild(p_time);
        task_div.appendChild(p_content);
        task_div.appendChild(delete_button)
        root.appendChild(task_div);
    }

    closeScheduleForm = () => {
        let element = document.querySelector(`.add-schedule-task`);
        let time = document.querySelector('.schedule-task-time');
        let input = document.querySelector('.task-input');

        time.value = '';
        input.value = '';
        element.style.display = 'none';
    }

    renderScheduleTask = () => {
        return (<ScheduleTask submit={this.submitScheduleTask} close={this.closeScheduleForm} inputHandler={this.scheduleInputHandler} timeHandler={this.timeInputHandler} />)
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

    logout = async (e) => {
        e.preventDefault();

        const response = await fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: "logout" }),
        });

        const body = await response.text();
        if(body === 'ok') {
            window.location.assign('/authorization');
        }
    }

    render() {
        let addButton;
        let newTaskForm;
        if (this.state.addBtnFlag) {
            addButton = <button id='new-task' onClick={this.addTask}><FontAwesomeIcon icon={faTimes} /></button>
            newTaskForm = <CreateNewTask submit={this.submitNewTask} inputHandler={this.newTaskInputHandler} />
        } else {
            newTaskForm = '';
            addButton = <button id='new-task' onClick={this.addTask}><FontAwesomeIcon icon={faPlus} /></button>
        }

        return (
            <div className="page">
                <header className='page-header'>
                    <div className="logo" onClick={() => {window.location.assign('/')}}>
                        <FontAwesomeIcon icon={faChevronCircleDown} />
                        <p>ToDo</p>
                    </div>
                    <button className='logout-button' onClick={this.logout}><FontAwesomeIcon icon={faSignOutAlt} /></button>
                </header>
                <div className="today-page">
                    <div className="main-content">

                        <div className="part-1" onLoad={this.state.scheduleLoading}>
                            {this.renderSchedule(0)}
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
                            {this.renderSchedule(13)}
                            {this.renderSchedule(14)}
                            {this.renderSchedule(15)}
                            {this.renderSchedule(16)}
                            {this.renderSchedule(17)}
                            {this.renderSchedule(18)}
                            {this.renderSchedule(19)}
                            {this.renderSchedule(20)}
                            {this.renderSchedule(21)}
                            {this.renderSchedule(22)}
                            {this.renderSchedule(23)}
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
                        {this.renderScheduleTask()}
                    </div>
                </div>
            </div>
        )
    }
}

export default TodayPage;