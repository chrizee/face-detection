const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
//include cors to avoid cors error
//const cors = require("cors");
const knex = require('knex');


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

app.post("/login", (req,res) => {
    const { email, password } = req.body;
    database.select('*').from("users")
    .where('email', email)
    .then(data => {
        const isValid = bcrypt.compareSync(password, data[0].password);
        if(isValid) {
            res.json({success: true, user: data[0]});
        } else{
            res.status(400).json({success: false});
        }
    })
    .catch(err => res.status(400).json({success: false}))
})

app.post("/register", (req,res) => {
    const {email, name, password} = req.body;
    database('users')
    .returning("*") //for postgress, doesn't work with mysql
    .insert({
        email,name,password: bcrypt.hashSync(password)
    })
    .then(response => {
        const user = {
            name,email,entries: 0,created_at: new Date()
        }
        res.json({success: true, user})
    })
    .catch(err => res.status(400).json({success: false, message: "Failed to register"}))
})

app.get("/profile/:id", (req,res) => {
    const {id} = req.params;
    database.select("*").from('users').where('id', id)
    .then(user => {
        if(user.length > 0) {
            res.json(user[0]);
        }else {
            res.status(400).json("Not found");
        }
    })
    .catch(err => res.status(400).json('error getting  user'))
})

app.put("/image", (req, res) => {
    const {id} = req.body;
    database('users').where('id', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        console.log(entries);
        res.json({success : true, entries});
    })
    .catch(err => res.status(400).json("not found"))
})
app.listen("3006", () => {
    console.log("server started on port 3006");
});