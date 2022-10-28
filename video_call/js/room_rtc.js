const APP_ID = "4ca19df909834e54b772cb84043812d3"
let uid = sessionStorage.getItem('uid')
if (!uid) {
  uid = String(Math.floor(Math.random() * 10000))
  sessionStorage.setItem('uid', uid)
}
let token = null;
let client;


const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
let roomId = urlParams.get('room')

if (!roomId) {
  roomId = 'main'
}
console.log(roomId)

let localTracks = []
let remoteUsers = {}
let localScreenTracks;
let sharingScreen = false;



let joinRoomInit = async () => {
  client = AgoraRTC.createClient({
    mode: 'rtc',
    codec: 'vp8'
  })

  await client.join(APP_ID, roomId, token, uid)
  client.on('user-published', handleUserPublished)
  client.on('user-left', handleUserLeft)
  joinStream()
}

let joinStream = async () => {
  localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()
  let player = `<div class="video__container" id="user-container-${uid}">
                    <div class="video-player" id="user-${uid}"></div>
                 </div>`

  document.getElementById('streams__container').insertAdjacentHTML('beforeend', player)
  localTracks[1].play(`user-${uid}`)
  await client.publish([localTracks[0], localTracks[1]])
}

let switchToCamera = async () => {
    let player = `<div class="video__container" id="user-container-${uid}">
                    <div class="video-player" id="user-${uid}"></div>
                 </div>`
    await localTracks[0].setMuted(true)
    await localTracks[1].setMuted(true)

    document.getElementById('mic-btn').classList.remove('active')
    document.getElementById('screen-btn').classList.remove('active')

    localTracks[1].play(`user-${uid}`)
    await client.publish([localTracks[1]])
}


let handleUserPublished = async (user, mediaType) => {
  remoteUsers[user.uid] = user

  await client.subscribe(user, mediaType)

  let player = document.getElementById(`user-container-${user.uid}`)
  if (player === null) {
    player = `<div class="video__container" id="user-container-${user.uid}">
                <div class="video-player" id="user-${user.uid}"></div>
            </div>`

    document.getElementById('streams__container').insertAdjacentHTML('beforeend', player)
  }
  if (mediaType === 'video') {
    user.videoTrack.play(`user-${user.uid}`)
  }

  if (mediaType === 'audio') {
    user.audioTrack.play()
  }

}

let handleUserLeft = async (user) => {
  delete remoteUsers[user.uid]
  let item = document.getElementById(`user-container-${user.uid}`).remove()
}

// -------------------------------mic and camera toggling------------------------------------------
let toggleMic = async (e) => {
  let button = e.currentTarget

  if (localTracks[0].muted) {
    await localTracks[0].setMuted(false)
    button.classList.add('active')
  } else {
    await localTracks[0].setMuted(true)
    button.classList.remove('active')
  }
}

let toggleCamera = async (e) => {
  let button = e.currentTarget

  if (localTracks[1].muted) {
    await localTracks[1].setMuted(false)
    button.classList.add('active')
  } else {
    await localTracks[1].setMuted(true)
    button.classList.remove('active')
  }
}

let toggleScreen = async (e) => {
  let screenButton = e.currentTarget
  let cameraButton = document.getElementById('camera-btn')

  if (!sharingScreen) {
    sharingScreen = true

    screenButton.classList.add('active')
    // cameraButton.classList.remove('active')
    // cameraButton.style.display = 'none'

    localScreenTracks = await AgoraRTC.createScreenVideoTrack()

    // document.getElementById(`user-container-${uid}`).remove()
    displayFrame.style.display = 'block'

    let player = `<div class="video__container" id="user-container-${uid}">
                <div class="video-player" id="user-${uid}"></div>
            </div>`

    displayFrame.insertAdjacentHTML('beforeend', player)
    // document.getElementById(`user-container-${uid}`).addEventListener('click', expandVideoFrame)

    userIdInDisplayFrame = `user-container-${uid}`
    localScreenTracks.play(`user-${uid}`)

    await client.unpublish([localTracks[1]])
    await client.publish([localScreenTracks])

    // let videoFrames = document.getElementsByClassName('video__container')
    // for(let i = 0; videoFrames.length > i; i++){
    //     if(videoFrames[i].id != userIdInDisplayFrame){
    //       videoFrames[i].style.height = '100px'
    //       videoFrames[i].style.width = '100px'
    //     }
    //   }


  } else {
    sharingScreen = false
    cameraButton.style.display = 'block'
    screenButton.classList.remove('active')
    // document.getElementById(`user-container-${uid}`).remove()
    await client.unpublish([localScreenTracks])
    displayFrame.style.display = 'none'
    switchToCamera()
  }
}



document.getElementById('camera-btn').addEventListener('click', toggleCamera)
document.getElementById('mic-btn').addEventListener('click', toggleMic)
document.getElementById('screen-btn').addEventListener('click', toggleScreen)
joinRoomInit()
