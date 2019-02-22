const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
//include cors to avoid cors error
//const cors = require("cors");
const knex = require('knex');
const register = require('./controllers/register');
const login = require('./controllers/login');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const app = express();
const database = knex({
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      user : 'root',
      password : '',
      database : 'bincom'
    }
  });
//console.log(database.select().table('users').then(data => console.log(data)).catch(err => console.log(err)));
//use cors as a midddleware
//app.use(cors());
app.use(bodyParser.json());

app.get("/", (req,res) => {
    res.send(database.users);
})

app.post("/login", (req,res) => {login.handleLogin(req,res, database, bcrypt)})
app.post("/register", (req, res) => {register.handleRegister(req,res, database, bcrypt)});
app.get("/profile/:id", (req, res) => {profile.handleProfile(req,res, database)});
app.put("/image", image.handleImage(database));

console.log(process.env.PORT);
app.listen("3006", () => {
    console.log("server started on port 3006");
});