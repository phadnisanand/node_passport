const express = require('express');
const app = express();
const passport =require("passport");
const {connectMongoose , User} = require("./database.js");
const {initializingPassport, isAuthenticated} = require('./passportConfig.js');
const expressSession = require("express-session");
connectMongoose();
initializingPassport(passport);
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(expressSession({secret: 'secret', resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
const ejs = require("ejs");
app.set("view engine", "ejs");
app.get('/', (req, res) => {
  res.render('index')
});

app.get('/register', (req, res) => {
  res.render('register')
});

app.get('/login', (req, res) => {
  res.render('login')
});


app.get('/profile',isAuthenticated, (req, res) => {
  res.send(req.user)
});

app.post('/register', async (req, res) => {
  const user = await User.findOne({username: req.body.username});
  if(user) return res.status(400).send("User already exists");
  const newUser = await User.create(req.body);
  res.status(201).send(newUser);
});

// app.post('/login', passport.authenticate('local', {failureRedirect: '/register'}), async (req, res) => {
//   const user = await User.findOne({username: req.body.username});
//   if(user) return res.status(400).send("User already exists");
//   const newUser = await User.create(req.body);
//   res.status(201).send(newUser);
// });

app.post('/login',passport.authenticate('local', {failureRedirect: '/register',successRedirect: "/"}));


app.listen(3000, () => {
  console.log('listening on port 3000');
});
