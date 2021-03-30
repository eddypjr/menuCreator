
if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}

const path = require('path');
const express = require('express');
// const cors = require('cors');

const passport = require('passport');
const session = require('express-session')
const bodyParser = require('body-parser');
const app = express();

const authRouter = require('./routes/auth')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
// app.use('*', cors());

/**
 * handle static files
 */
app.use(express.static(path.resolve(__dirname, '../build')));




/**
 * TODO: 
 *  -save to a session redis DB
 *  -set expiration
 */
require('./passport');
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:false,
  })
);

//intializes passport for all requests
app.use(passport.initialize())
app.use(passport.session())

//Router
app.use('/auth', checkNotAuthenticated, authRouter);

//Dashboard
app.get("/", 
  checkAuthenticated,  
  (req, res) => {
    req.session.viewCount +=1;
    res.sendFile(path.resolve(__dirname, "../index.html"));
});





// check to see if a user is authenticated
function checkAuthenticated(req,res,next){
  if (req.isAuthenticated()){
    return next()
  }
  res.redirect('/auth/login')
}
// check to see if a user is NOT authenticated
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { //passport feature
    return res.redirect('/')
  }
  next()
}


const PORT = 3000;
app.listen(PORT, console.log("listening on port: ", PORT));


module.exports = app;