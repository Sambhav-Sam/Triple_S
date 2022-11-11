const socket=io();
var url;
var send=document.getElementById("socket-chat");
var area=document.getElementById("messages");
var call=document.getElementById("call");
var calla=document.getElementById("calla");

send.addEventListener('keyup',(e)=>{
  console.log(e.target.value);
  if(e.key==='Enter'){
    sendmessage(e.target.value);
    sendData(e.target.value);
    e.target.value='';
  }
});

//sending message to the server
const sendData = (message)=>{
  const url=window.location.href;
  const roomId=url.slice(27);
  fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      msg: message,
      roomId : roomId
    })
  }).then((res) => {
    return res.json();
  }).then((fres) => {
    console.log(fres);
  });
}

call.addEventListener("click",start_call);

function start_call(){
  var temp=window.location.href;
  temp=temp.slice(27);
  console.log(temp);
  calla.href="/call/"+temp;
  var t="http://localhost:3000/call/"+temp
  window.location = t;
  console.log(calla.href);
}


function sendmessage(msg){
  url=window.location.href;
  var roomId = url;
  let obj=msg;
  append(obj,"outgoing");
  socket.emit("message",obj,roomId);
}

function append(msg,type){
  console.log("called");
  let maindiv=document.createElement('div');
  let classname=type;
  maindiv.classList.add(classname,'message');
  let markup;
  if(type==="incoming"){
    markup=`
      <div class="mess_o">
        <p>${msg}</p>
      </div>
    `
  }
  else{
    markup=`
      <div class="mess_i">
        <p>${msg}</p>
      </div>
    `
  }

  maindiv.innerHTML=markup;
  area.appendChild(maindiv);
}



socket.on("message",(msg)=>{
  append(msg,"incoming");
})
