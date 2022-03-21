const express = require('express');
const app = express();
const port = 8080;
const htmlUrl = __dirname + '/public/index.html';
const bodyParser = require('body-parser');
const { urlencoded, json } = require('body-parser');
const { reset } = require('nodemon');
var MYSQLCONNECTION;

/////////////////////////////////////////////////////////////////////
// DATABASE
/////////////////////////////////////////////////////////////////////
var mySqlConnection = () => {
  var mysql = require('mysql');
  var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
  });
  
  con.connect(err => {
    if (err) {
      console.log('error: ', err);
    }
  });
  return con;
};

const serviceDB = connection => {
  connection.query('use mvp;', [], err => {
    if (err) {
      console.log('mvp database does not exist!');
      connection.query('create database mvp', [], err => {
        connection.query('use mvp', [], err=>{});
      });
    }
    //now using mvp db
    // --check if tables exist

    //service the user table
    connection.query('select * from user', [], err => {
      if (err) {
        // create user table
        connection.query('create table user(id int primary key AUTO_INCREMENT, username VARCHAR(10), password VARCHAR(16), firstname VARCHAR(12), lastname VARCHAR(12))', [], err => {
          if (err) {
            console.log('err: ', err);
          }
        });
      }
    });

    //service the appointments table
    connection.query('describe appointments', [], (err, res) => {
      if (err) {
        //create appointments table
        connection.query('create table appointments(id int primary key AUTO_INCREMENT, firstname varchar(12), lastname varchar(12), date varchar(10), time varchar(10))', [], err => {
          if (err) {
            console.log('failed to make table!');
          }
        });
      }
    });
    //EVERYTHING HAS BEEN SERVICED!!
  });
};

const resetDB = connection => {
  connection.query('drop database mvp', [], err => {
    console.log('failed to drop db: ', err);
  });
};

/////////////////////////////////////////////////////////////
// CONTROLLERS
/////////////////////////////////////////////////////////////
const signup = (connection, username, password, fn, ln, response) => {
  connection.query(`select * from user where username = "${username}"`, [], (err, res) => {
    if (res.length === 0) {
      connection.query(`insert into user (username, password, firstname, lastname) value ("${username}", "${password}", "${fn}", "${ln}")`, [], err => {
        if (err) {
          console.log('error: ', err);
        } else {
          response.end('success');
        }
      });
    } else {
      console.log('user already exists!');
      response.end('username taken');
    }
  })
};

const login = (connection, username, password, response) => {
  connection.query(`select * from user where username = "${username}" and password = "${password}"`, [], (err, res) => {
    if (err || res.length === 0) {
      console.log('err: ', err);
      response.end('failed');
    } else {
      response.end(JSON.stringify(res));
    }
  });
};

const bookAppointment = (connection, fn, ln, date, time, response) => {
  // check if any appointments exist on said time
  connection.query(`select * from appointments where time="${time}" and date="${date}"`, [], (err, res) => {
    if (err) {
      console.log('err: ', err);
      response.end('failed');
    } else if (res.length === 0) {
      //make the appointment req
      connection.query(`insert into appointments (firstname, lastname, date, time) values("${fn}", "${ln}", "${date}", "${time}")`, [], (err, res) => {
        if (err) {
          console.log('err: ', err);
          response.end('failed');
        } else {
          response.end('success');
        }
      });
    } else {
      //appointment exists!
      console.log('appointment: ', res);
      response.end('failed');
    }
  });
};

const getAppointment = (connection, response, name) => {
  if (name) {
    connection.query(`select * from appointments where firstname = "${name.firstname}" && lastname = "${name.lastname}"`, [], (err, res) => {
      if (err) {
        console.log('err: ', err);
        return;
      }
      response.end(JSON.stringify(res));
    })
  } else {
    connection.query('select * from appointments', [], (err, res) => {
      if (err) {
        console.log('err: ', err);
        return;
      }
      response.end(JSON.stringify(res));
    });
  }
};

/////////////////////////////////////////////////////////////
// SERVER
/////////////////////////////////////////////////////////////
app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded())

app.get('/', (req, res) => {
  console.log('A new connection has arrived!');


  res.sendFile(htmlUrl);
});

app.post('/signup', (req, res) => {
  signup(MYSQLCONNECTION, req.body.username, req.body.password, req.body.firstname, req.body.lastname, res);
  //success or fail?
  // res.end();
});

app.post('/login', (req, res) => {
  login(MYSQLCONNECTION, req.body.username, req.body.password, res);
});

app.post('/book', (req, res) => {
  var data = req.body;
  bookAppointment(MYSQLCONNECTION, data.firstname, data.lastname, data.date, data.time, res);
});

app.post('/getappointment', (req, res) => {
  if (req.body.firstname === 'admin') {
    getAppointment(MYSQLCONNECTION, res);
  } else {
    //get & return specific user!
    getAppointment(MYSQLCONNECTION, res, {firstname: req.body.firstname, lastname: req.body.lastname});
  }
});

app.post('/delete', (req, res) => {
  MYSQLCONNECTION.query(`delete from appointments where firstname="${req.body.fn}" and lastname="${req.body.ln}" and date="${req.body.date}" and time="${req.body.time}"`, [], (err, response) => {
    if (err) {
      console.log('err: ', err);
      return;
    }
    res.end('200');
  });
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
  MYSQLCONNECTION = mySqlConnection();
  // resetDB(MYSQLCONNECTION);
  serviceDB(MYSQLCONNECTION);
});

