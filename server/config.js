function ExtractJwt(req) {
  let token = null

  if(req.cookies && req.cookies.token != void(0)) {
    return token = req.cookies['token']
  } else {
    return token
  }
}

module.exports = {
 jwt: {
  jwtFromRequest: ExtractJwt,
  secretOrKey: 'secret'
 },

 expiresIn: '1 day'
}
