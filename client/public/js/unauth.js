$('form .message a').on('click', (e) => {
  e.preventDefault()
  if ($('.login:visible').length > 0) {
    $('.login').css('display', 'none')
    $('.register').css('display', 'block')
  } else {
    $('.register').css('display', 'none')
    $('.login').css('display', 'block')
  }
})

$('input').on('blur', () => {
  hasError('')
})

function hasError(res) {
  const err = document.querySelectorAll('#hasError')
  for(let i = 0; i < err.length; i++) {
    err[i].innerText = response(res) || ''
  }
}

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

$('form').on('submit', (e) => {
  e.preventDefault()
  let value = $(e.target).attr('class')
  let selector = '.' + value
  $.ajax({
    url: '/' + value,
    type: 'POST',
    data: {
      username: $(selector + ' [name=username]').val(),
      password: $(selector + ' [name=password]').val(),
    },
    beforeSend: () => {
      $(selector + ' button').prop('disabled', true)
    },
    success: (res) => {
      console.log(res)
      location.reload()
    },
    error: (res) => {
      hasError(res)
    },
    complete: () => {
      $(selector + ' button').prop('disabled', false)
    },
  })
})
