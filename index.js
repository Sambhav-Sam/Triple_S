//requiring external pakages
require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const passport = require("passport");
const http = require("http").Server(app);
const io = require("socket.io")(http);


// const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(cookieSession({
    maxAge :24*60*60*1000,
    keys : ['sambhavsarthaksambhav']
}));

//initialize
app.use(passport.initialize());
app.use(passport.session());


//requiring internal dependencies
const userdetails = require("./routes/user/user");
const viewprofile = require("./routes/viewprofiles");
const Auth = require("./routes/auth/auth");
const api = require("./src/api/api");
const sos = require("./routes/sos/sos");
const UserDetail = require("./src/models/userDetails");
const isAuth = require("./routes/auth/isauth");
const Chat = require("./src/models/chat");

//-----------------------------------------
app.use("/auth", Auth);
app.use("/api", api);
app.use("/buildprofile", userdetails);
app.use("/sos",sos);
app.use("/",viewprofile);


//routes--------------------------------------------------

app.get("/",async (req,res)=>{
    try{
        res.status(200).render("homepage/home.ejs");
    
  } catch (err) {
    res.status(401).send(err);
  }
});



app.get("/call/room.html",(req,res)=>{
  res.sendFile(__dirname+"/room.html");
});



var room;

app.get("/chat/:roomId", async (req, res) => {
  const user = await isAuth(req); 
  const roomId = req.params.roomId;
  const data = await UserDetail.findOne({_id : user._id}).select({matches : 1});
  const matches = data.matches;
  const object = matches.filter(element => element.roomId == roomId);
  const anotherUser = await UserDetail.findOne({_id : object[0].userId}).select({moreDetail : {name : 1}});
  console.log(anotherUser);
  const name = anotherUser.moreDetail.name;
  const chats = await Chat.findOne({roomId : roomId});
  if(chats)
  {
  res.render("chat/chat.ejs",{name : name , chats : chats.chat , id : user._id});
  }
  else{
    res.render("chat/chat.ejs",{name : name , chats : [] , id : user._id});
  }
});

app.get("/call/:callid", (req, res) => {
  console.log("callng");
  room = req.params.roomId;
  res.sendFile(__dirname + "/lobby.html");
});


io.on("connection", function(socket) {
  console.log("socket connected");
  var room_name = socket.request.headers.referer; // link of page, where user connected to socket
  console.log(room_name);
  //connecting to room
  socket.join(room_name);
  socket.on('message', function(msg,id) {
    socket.to(id).emit('message', msg);
  });
  // socket.on("message", (msg) => {
  //   socket.broadcast.emit("message", msg, room);
  // })
});

//wild route
app.get("*",async (req,res)=>{
  res.status(404).render("error404/error.ejs");
});

//port----------------------------------------------------
const PORT = 3000;
http.listen(PORT, (req, res) => {
  console.log(`server started on port:${PORT}`);
});
