var express = require('express');
var router = express.Router();
const db = require("../db");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.get('/calendar', function(req, res, next) {
  res.render('calendar');
});

router.get('/new', function(req, res, next) {
  res.render('new',{message: ""});
});

router.get('/login', function(req, res, next) {
  res.render('enter',{message: ""});
});

router.post('/calendarNew', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var passwordChk = req.body.passwordCheck;
  if(password !== passwordChk){
    res.render("new", {message: "Senhas diferentes!"});
  }
  db.findUser(username)
    .then(user => {
      console.log(user);
      if(user[0] == null){
        db.addUser(username, password);
        var user = {username: username, password: password, events: []};
        res.render("calendar", {user: user});
      }
      else{
        res.render("new", {message: "Usuário já existe!"});
      }
    })
    .catch(error => console.log(error));
});

router.post('/calendarLogin', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  db.findUser(username)
    .then(user => {
      console.log(user);
      if(user[0] == null){
        res.render("enter", {message: "Usuário Inválido!"});
      }
      else{
        if(user[0].password != password){
          res.render("enter", {message: "Senha inválida!"});
        }
        else{
          res.render("calendar", {user: user[0]});
        }
      }
    })
    .catch(error => console.log(error));
});

router.post('/calendarUpdate', function(req, res, next) {
  var username = req.body.username;
  var events = req.body.events;
  console.log(req.body);
  db.updateUser(username, events);
  res.redirect('/');
});

router.post('/new', function(req, res, next) {
  console.log("POST new");
  res.redirect('/new');
});

router.post('/login', function(req, res, next) {
  console.log("POST enter");
  res.redirect('/login');
});


module.exports = router;
