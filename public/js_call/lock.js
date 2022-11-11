var temp=window.location.href;
temp=temp.slice(27);
let lock=document.getElementById("emo-text");
lock.value=temp;
lock.disabled=true;
