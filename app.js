// load package
const express = require('express');
const mysql = require('mysql');
const bodyParser = require("body-parser");

const PORT = 3000;
const HOST = '0.0.0.0';
const app = express();
app.use( bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Database Connection
const connection = mysql.createConnection({
    // host: '0.0.0.0'/localhost: Used to  locally run app
    host: "mysql1",
    user: "root",
    password: "admin"
  });

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Server!');
  }); 

//Creates a database called employeedb and a table called employeetable.
// The employeetable has 3 columns: id, username, and email.
// The id column is the primary key and is auto-incremented.
// The username and email columns are both varchar(100) and cannot be null.
app.get('/init', (req, res) => {
    connection.query(`CREATE DATABASE IF NOT EXISTS employeedb`,function (error,result) {
        if (error) console.log(error) });
    //Create Table
    connection.query(`USE employeedb`,function (error, results) {
        if (error) console.log(error);
    });
    connection.query(`CREATE TABLE IF NOT EXISTS employeetable 
    ( id int unsigned NOT NULL auto_increment, 
    username varchar(100)NOT NULL,
    email varchar(100) NOT NULL,
    PRIMARY KEY (id))`, function (error,result) {
        if (error) console.log(error)});
        res.send('Database and Table created!')
}); 

//Insert into Table
// Adds a new employee to the database.
app.post('/addemployee', (req,res) => {
    var name = req.body.fname;
    var email = name + "@gmail.com";
    var query = `INSERT INTO employeetable (username, email) VALUES ("${name}", "${email}")`;
    connection.query(query, function (error,result) {
        if (error) console.log(error);
        res.send('New employee inserted');
    });
});

//Get all employees
//A GET request that returns all the employees in the employeetable.
app.get('/getemployee', (req, res) => {
    const sqlQuery = 'SELECT * FROM employeetable';
    connection.query(sqlQuery, function (error,result) {
        if (error) console.log(error);
        res.json({ 'employees': result});
    });
});

//Get employee by id
//A get request that takes in an id and returns the employee with that id.
app.get('/getemployee/:id', function (req, res) {
    connection.query('SELECT * FROM employeetable WHERE id=?',
    [req.params.id], function (error, result, fields) {
       if (error) throw error;
       res.json({ 'employees': result});
       //res.end(JSON.stringify(result));
     });
 });
 //serves the static files in the public folder
app.use('/', express.static('public'));
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);