
let handleChannelMessage = async (messageData, MemberId) => {
  console.log("------------------------------------------------------------------------------------------------A new message was received");
  let data = JSON.parse(messageData.text)
  console.log('message:',data)
  if (data.type === 'chat') {
    trans(data.displayName,data.message)
    // addMessageToDom(data.displayName, data.message)
  }

  if (data.type === 'user_left') {
    document.getElementById(`user-container-${data.uid}`).remove()

    if (userIdInDisplayFrame === `user-container-${uid}`) {
      displayFrame.style.display = null

      for (let i = 0; videoFrames.length > i; i++) {
        videoFrames[i].style.height = '500px'
        videoFrames[i].style.width = '500px'
      }
    }
  }
}

let sendMessage = async (e) => {
  console.log(e.target[2]);
  e.preventDefault()
  let message=e.target.message.value
  channel.sendMessage({
    text: JSON.stringify({
      'type': 'chat',
      'message': message,
      'displayName': displayName
    })
  })
  // trans(message);
  addMessageToDom(displayName, message)
  e.target[2].value=""
}

let addMessageToDom = (name, text) => {
  // console.log("1",message)
  let messagesWrapper = document.getElementById('messages')
  // trans(message);
  // console.log("4",message)
  let newMessage = `<div class="message__wrapper">
                        <div class="message__body">
                            <strong class="message__author">${name}</strong>
                            <p class="message__text">${text}</p>
                        </div>
                    </div>`

  messagesWrapper.insertAdjacentHTML('beforeend', newMessage)

  let lastMessage = document.querySelector('#messages .message__wrapper:last-child')
  if (lastMessage) {
    lastMessage.scrollIntoView()
  }
}


let addBotMessageToDom = (botMessage) => {
  let messagesWrapper = document.getElementById('messages')

  let newMessage = `<div class="message__wrapper">
                        <div class="message__body__bot">
                            <strong class="message__author__bot">🤖 Cupit Bot</strong>
                            <p class="message__text__bot">${botMessage}</p>
                        </div>
                    </div>`

  messagesWrapper.insertAdjacentHTML('beforeend', newMessage)

  let lastMessage = document.querySelector('#messages .message__wrapper:last-child')
  if (lastMessage) {
    lastMessage.scrollIntoView()
  }
}

let leaveChannel = async () => {
  await channel.leave()
  await rtmClient.logout()
}

window.addEventListener('beforeunload', leaveChannel)
let messageForm = document.getElementById('message__form')
messageForm.addEventListener('submit', sendMessage)
