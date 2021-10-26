// server.jsnpm install

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 7030;
const MongoClient = require('mongodb').MongoClient
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

var db

// configuration ===============================================================
mongoose.connect(configDB.url, (err, database) => {
  if (err) return console.log(err)
  db = database
  require('./app/routes.js')(app, passport, db);
}); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))


app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'rcbootcamp2021b', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);

//================================
// const express = require('express')
// const app = express()
// const bodyParser = require('body-parser')
// const MongoClient = require('mongodb').MongoClient

// var db, collection;

// const url = "mongodb+srv://demo:demo@cluster0-q2ojb.mongodb.net/test?retryWrites=true";
// //const url = "mongodb+srv://la:LAtest@cluster0.gneh9.mongodb.net/test?retryWrites=true"

// const dbName = "demo";

// app.listen(3001, () => {
//     MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
//         if(error) {
//             throw error;
//         }
//         db = client.db(dbName);
//         console.log("Connected to `" + dbName + "`!");
//     });
// });

// app.set('view engine', 'ejs')
// app.use(bodyParser.urlencoded({extended: true}))
// app.use(bodyParser.json())
// app.use(express.static('public'))

// app.get('/', (req, res) => {
//   db.collection('tasks').find().toArray((err, result) => {
//     if (err) return console.log(err)
//     res.render('index.ejs', {tasks: result})
//   })
// })

// app.get('/new', (req, res) => {
//   db.collection('tasks').find().toArray((err, result) => {
//     if (err) return console.log(err)
//     res.render('new.ejs')
//   })
// })

// app.post('/tasks', (req, res) => {
//   db.collection('tasks').insertOne({name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown:0}, (err, result) => {
//     if (err) return console.log(err)
//     console.log('saved to database')
//     res.redirect('/')
//   })
// })

// app.put('/tasks', (req, res) => {
//   db.collection('tasks')
//   .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
//     $set: {
//       thumbUp:req.body.thumbUp + 1
//     }
//   }, {
//     sort: {_id: -1},
//     upsert: true
//   }, (err, result) => {
//     if (err) return res.send(err)
//     res.send(result)
//   })
// })


// app.put('/downtasks', (req, res) => {
//   db.collection('tasks')
//   .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
//   }, {
//     sort: {_id: -1},
//     upsert: true
//   }, (err, result) => {
//     if (err) return res.send(err)
//     res.send(result)
//   })
// })

// app.post('/save', (req, res) => {
//   db.collection('tasks').insertOne({ name: req.body.name, msg: req.body.msg }, (err, result) => {
//     if (err) return console.log(err)
//     console.log('saved to database')
//     res.redirect('/')
//   })
// })

app.delete('/delete', (req, res) => {
  db.collection('tasks').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
