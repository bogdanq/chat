const UsersModel = require('./models/users.js')
const _ = require('lodash')
const config = require('./config.js')
const bcrypt = require('bcryptjs')
const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')

function checkAuth(req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, decryptToken, jwtError) => {
    if(jwtError != void(0) || err != void(0)) {
      return res.render('index.html', { error: err || jwtError })
    } else {
      req.user = decryptToken
      next()
    }
  })(req, res, next)
}

function createToken(body) {
  return jwt.sign(
    body,
    config.jwt.secretOrKey,
    { expiresIn: config.expiresIn }
  )
}

module.exports = app => {
  app.use('/assets', express.static('./client/public'))
  
  app.get('/', checkAuth, (req, res) => {
    res.render('index.html', { username: req.cookies.name })
  })

  app.post('/login', async (req, res) => {
    try {
      let user = await UsersModel.findOne({ username: {$regex: _.escapeRegExp(req.body.username), $options: 'i'} }).lean().exec()
      
      if(user != void(0) && bcrypt.compareSync(req.body.password, user.password)) {
        const token = createToken({id: user._id, username: user.username})
        res.cookie('token', token, {
          httpOnly: true
        })

        res.cookie('name', user.username)

        res.send(200, {message: 'User log in success'})

      } else {
        res.send(400,{ message: 'User already exist'})
      }

    } catch(err) {
      console.log(err)
      res.send(500, { message: 'some error' })
    }
  })

  app.post('/register', async (req, res) => {
    try {
      let user = await UsersModel.findOne({ username: {$regex: _.escapeRegExp(req.body.username), $options: 'i'} }).lean().exec()
      if(user != void(0)) {
        return res.send(400,{ message: 'User already exist'})
      } else {
        user = await UsersModel.create({
          username: req.body.username,
          password: req.body.password
        })

        const token = createToken({id: user._id, username: user.username})

        res.cookie('token', token, {
          httpOnly: true
        })

        res.send(200, {message: 'User created'})
      }
    } catch(err) {
      console.log('register error', err)
      res.send(500, { message: 'some error' })
    }
  })

  app.post('/logout', (req, res) => {
    res.clearCookie('token')
    res.clearCookie('name')
    res.send(200, { message: 'out success' })
  })
}