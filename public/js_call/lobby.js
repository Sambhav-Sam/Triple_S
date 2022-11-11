let form = document.getElementById('lobby__form')
let displayName = sessionStorage.getItem('display_name')
if (displayName) {
  form.name.value = displayName
}

form.addEventListener('submit', (e) => {
  e.preventDefault()

  sessionStorage.setItem('display_name', e.target.name.value)
  var inviteCode=window.location.href;
  inviteCode=inviteCode.slice(27);
  if (!inviteCode) {
    inviteCode = String(Math.floor(Math.random() * 10000))
  }
  window.location = `room.html?room=${inviteCode}`
})
