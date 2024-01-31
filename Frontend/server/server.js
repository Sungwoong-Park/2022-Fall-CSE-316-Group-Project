const express = require("express");
const mysql = require('mysql');
const app = express();
const PORT = process.env.PORT || 3306;
const cors = require("cors");

const corsOptions = {
    origin:"http://localhost:3000"
};

const db = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'semi9010~~',
    database: 'diary'
});

db.connect();

app.set('port', process.env.PORT || 3305);
app.use(cors(corsOptions));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/api/diary/users', (req, res) => {
    db.query("SELECT * FROM users;", (err, result) => {
        if(!err){
            res.json(result);
        }else{
            console.log(err);
        } 
    })
});

//login
app.get('/api/diary/users/id=:id&pw=:pw', (req, res) => {
    db.query("SELECT * FROM users Where user_id='"+req.id+"' and password='"+req.pwd+"';", (err, result) => {
        if(!err){
            res.json(result);
        }else{
            console.log(err);
        } 
    })
});

app.get('/api/diary/logday', (req, res) => {
    db.query("SELECT * FROM logday;", (err, result) => {
        if(!err){
            res.json(result);
        }else{
            console.log(err);
        } 
    })
});

app.get('/api/diary/questions', (req, res) => {
    db.query("SELECT * FROM questions;", (err, result) => {
        if(!err){
            res.json(result);
        }else{
            console.log(err);
        } 
    })
});

app.listen(app.get('port'), () => {
    console.log('Server is on' + app.get('port'));
})