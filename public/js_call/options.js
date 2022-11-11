const match = document.getElementById("match");
const message = document.getElementById("message");

const matchwindow = ()=>{
    match.classList.remove("hide");
    message.classList.add("hide");
    document.getElementById("matchwindow").classList.add("active");
    document.getElementById("messagewindow").classList.remove("active");
}

const messagewindow = ()=>{
    match.classList.add("hide");
    message.classList.remove("hide");
    document.getElementById("messagewindow").classList.add("active");
    document.getElementById("matchwindow").classList.remove("active");
}