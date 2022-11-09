const socket=io();

var send=document.getElementById("socket-chat");
var area=document.getElementById("messages");
send.addEventListener('keyup',(e)=>{
  console.log(e.target.value);
  if(e.key==='Enter'){
    sendmessage(e.target.value);

  }
});

function sendmessage(msg){
  let obj=msg;
  append(obj,"outgoing");
  socket.emit("message",obj);
}

function append(msg,type){
  console.log("called");
  let maindiv=document.createElement('div');
  let classname=type;
  maindiv.classList.add(classname,'message');
  let markup=`
    <h3>sarthak</h3>
    <p>${msg}</p>
  `
  maindiv.innerHTML=markup;
  area.appendChild(maindiv);
}

socket.on("message",(msg)=>{
  append(msg,"incoming");
})
