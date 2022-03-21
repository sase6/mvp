import React, { Component} from "react";
import {hot} from "react-hot-loader";
const axios = require('axios');
// const Book = require('./Book.jsx');
import {Book} from './Book.jsx';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      admin: false,
      fn: null,
      ln: null,
      user: null,
      loggedIn: false,
      appointments: []
    }
  }

  render(){
    return(
      <div className="App">
        <div className="username-container">
        <div className="username-label">username:</div>
          <input type="text" className="username" required/>
        </div>

        <div className="password-container">
        <div className="password-label">password:</div>
          <input type="password" className="password" required/>
        </div>

        <div className="firstname-container">
        <div className="firstname-label">First Name:</div>
          <input type="text" className="firstname" />
        </div>

        <div className="lastname-container">
        <div className="lastname-label">Last Name:</div>
          <input type="text" className="lastname" />
        </div>

        <div className="login-signup-container">
          <button className="btn-login" onClick={() => this.sendLogin(this)}>Login</button>
          <button className="btn-signup" onClick={() => this.sendSignup(this)}>Create Account</button>
        </div>


        <div className="appointment-book-divider">BOOK AN APPOINTMENT: </div>

        <Book user={{fn: this.state.fn, ln: this.state.ln}} goFetch={() => {
          this.fetchAppointments(this.state.fn, this.state.ln, this);
        }}/>


        <div className="appointment-list-divider">APPOINTMENTS: </div>

        <div className="appointmentList">
          {this.state.appointments.map(appointment => {
            return (
              <div className="appointment">
                <div className="fn">First Name: {appointment.firstname}</div>
                <div className="ln">Last Name: {appointment.lastname}</div>
                <div className="date">Date: {appointment.date}</div>
                <div className="time">Time: {appointment.time}</div>
                <button onClick={() => {this.deleteAppointment(appointment.firstname, appointment.lastname, appointment.date, appointment.time, this)}} className="delete">Delete</button>
              </div>
            )
          })}
        </div>
      </div>    
    );
  }

  cleanInputField() {
    document.querySelector('.username').value = "";
    document.querySelector('.password').value = "";
    document.querySelector('.firstname').value = "";
    document.querySelector('.lastname').value = "";
  }

  sendSignup(ref) {
    axios({
      method: 'post',
      url: '/signup',
      data: {
        username: document.querySelector('.username').value,
        password: document.querySelector('.password').value,
        firstname: document.querySelector('.firstname').value,
        lastname: document.querySelector('.lastname').value
      }
    })
      .then(res => {
        console.log('response from server: ', res.data);
      });
    ref.cleanInputField();
  }

  sendLogin(ref) {
    axios({
      method: 'post',
      url: '/login',
      data: {
        username: document.querySelector('.username').value,
        password: document.querySelector('.password').value
      }
    })
      .then(res => {
        console.log('response from server: ', res.data);
        var name = {first: res.data[0].firstname, last: res.data[0].lastname, username: res.data[0].username}
        if (name.username === 'admin') {
          ref.setState({admin: true, fn: null, ln: null, loggedIn: false, user: name.username});
        } else {
          ref.setState({fn: name.first, ln: name.last, loggedIn: true, user: name.username});
        }
        ref.fetchAppointments(this.state.fn, this.state.ln, ref, this.state.user);
      });
    ref.cleanInputField();
  }

  fetchAppointments(firstname, lastname, ref, username) {
    axios({
      method: 'post',
      url: '/getappointment',
      data: {
        firstname: firstname || username,
        lastname: lastname
      }
    }) 
      .then(res => {
        //parse resp
        ref.setState({appointments: res.data});
        console.log(ref.state);
      });
  }

  deleteAppointment(fn, ln, date, time, ref) {
    console.log('trying to delete!');
    axios({
      method: 'post',
      url: '/delete',
      data: {
        fn: fn,
        ln: ln, 
        date: date,
        time: time
      }
    })
      .then(res => {
        console.log('succ, deleted appointment! ', res);
        ref.fetchAppointments(ref.state.fn, ref.state.ln, ref, ref.state.user);
      })
  }
}

export default hot(module)(App);