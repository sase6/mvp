
import axios from 'axios';
import React, {Component} from 'react';

class Book extends Component {
  constructor(props) {
    super(props);
    //props.user exists!
  }

  render() {
    return (
      <div className="appointments-container">
        <div className="appointments-msg">Open 9am-5pm <br /> Choose a time (hourly) </div>
        <select name="select" id="time">
        <option value="9am">9am</option>
        <option value="10am">10am</option>
        <option value="11am">11am</option>
        <option value="12pm">12pm</option>
        <option value="1pm">1pm</option>
        <option value="2pm">2pm</option>
        <option value="3pm">3pm</option>
        <option value="4pm">4pm</option>
        <option value="5pm">5pm</option>
        </select>

        <select name="select" id="month">
        <option value="01">Jan</option>
        <option value="02">Feb</option>
        <option value="03">Mar</option>
        <option value="04">Apr</option>
        <option value="05">May</option>
        <option value="06">Jun</option>
        <option value="07">Jul</option>
        <option value="08">Aug</option>
        <option value="09">Sep</option>
        <option value="10">Oct</option>
        <option value="11">Nov</option>
        <option value="12">Dec</option>
        </select>

        <input type="text" id="day" />

        <div className="book-button">
          <button className="btn-book" onClick={() => this.book(this)}>Book</button>
        </div>
      </div>
    )
  }

  book(ref) {

    var month = document.querySelector('#month').value.toString();
    var day = document.querySelector('#day').value;
    if (day.length < 2) {
      day = '0' + day;
    }
    const parsedDay = parseInt(day);
    if (parsedDay <= 0 || parsedDay > 32) {
      console.log('check day');
      return;
    }

    var date = (month.toString() + '/' + day.toString() + '/' + new Date().getFullYear().toString());
    var time = document.querySelector('#time').value;
    var firstname = ref.props.user.fn;
    var lastname = ref.props.user.ln;

    if (firstname === null) {
      console.log('not logged in!');
      return;
    }

    axios({
      method: 'post',
      url: '/book',
      data: {
        firstname: firstname,
        lastname: lastname,
        date: date,
        time: time,
      }
    })
      .then(res => {
        //re fetch the list & rerender
        this.props.goFetch();
      });
  }
}

export {Book}