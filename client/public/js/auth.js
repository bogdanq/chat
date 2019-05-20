function response(data) {
  let resp = data.responseText
  try {
    if (data.message != void 0) {
      resp = data.message
    } else {
      resp = JSON.parse(data.responseText)
      resp = resp.message
    }
  } catch (e) {}
  return resp
}

$('.logout-btn').on('click', (e) => {
  e.preventDefault()
  $.ajax({
    url: '/logout',
    type: 'POST',
    data: {},
    success: (res) => {
      console.log(response(res))
      location.reload()
    }
  })
})

$(document).ready(() => {
  let socket = io.connect('http://localhost:3000')
  socket.on('connected', function(msg) {
    socket.emit('receiveHistory')
  })

  socket.on('message', addMessage)

  socket.on('history', (messages) => {
    for (let message of messages) {
      addMessage(message)
    }
  })

  $('.chat-message button').on('click', (e) => {
    e.preventDefault()

    let selector = $("textarea[name='message']")
    let messageContent = selector.val().trim()
    if (messageContent !== '') {
      socket.emit('msg', messageContent, $.cookie('name'))
      selector.val('')
    }
  })

  function encodeHTML(str) {
    return $('<div />')
      .text(str)
      .html()
  }

  function addMessage(message) {
    message.date = new Date(message.date).toLocaleString()
    message.username = encodeHTML(message.username)
    message.content = encodeHTML(message.content)

    let html = `
    <li>
        <div class="message-data">
            <span class="message-data-name">${message.username}</span>
            <span class="message-data-time">${message.date}</span>
        </div>
        <div class="message my-message" dir="auto">${message.content}</div>
    </li>`

    $(html)
      .hide()
      .appendTo('.chat-history ul')
      .slideDown(200)
    
    $('.chat-history').animate(
      { scrollTop: $('.chat-history')[0].scrollHeight },
      100,
    )
  }
})
