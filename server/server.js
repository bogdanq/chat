const express = require('express')
const app = express()
const nunjucks = require('nunjucks')
const server = require('http').Server(app)
const io = require('socket.io')(server, { serveClient: true })
const mongoose = require('mongoose')

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const passport = require('passport')
const { Strategy } = require('passport-jwt')

const MONGO_URI = 'mongodb://bogdan:1111111Q@ds157864.mlab.com:57864/todos'

new Promise((res, rej) => {
  mongoose
    .connect(MONGO_URI,  { useNewUrlParser: true })
    .then(mongodb => {
      res(mongodb)
      console.log('connected mongo users')
    })
    .catch(err => {
      console.log('mongo not connect users')
    })
})

const { jwt } = require('./config.js')
passport.use(new Strategy(jwt, function(jwt_payload, done) {
  if(jwt_payload != void(0)) {
   return done(false, jwt_payload) 
  } else {
    done()
  }
}))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cookieParser())

require('./socket')(io)
require('./router')(app)

nunjucks.configure('./client/views', {
  autoescape: true,
  express: app
})

server.listen(3000, () => console.log('listen on port 3000'))