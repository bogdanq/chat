const MessageModel = require('./models/messages.js')

module.exports = io => {
  io.on('connection', (socket) => {
    socket.emit('connected', 'you connected')
    socket.join('all')
    socket.on('msg', (content, name) => {
      const obj = {
        date: new Date(),
        content: content,
        username: name
      }
      
      MessageModel.create(obj, (err) => {
        if(err) return console.error(err)
        socket.emit('message', obj)
        socket.to('all').emit('message', obj)
      })
    })

    socket.on('receiveHistory', () => {
      MessageModel
        .find({})
        .sort({ date: -1 })
        .limit(50)
        .sort({ date: 1 })
        .lean()
        .exec((err, messages) => {
          if(!err) {
            socket.emit('history', messages)
            socket.to('all').emit('message', messages)
          }
        })
    })
  })
}