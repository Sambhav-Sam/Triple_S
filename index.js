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


app.get("*",async (req,res)=>{
    res.status(404).render("error404/error.ejs");
});
app.get("/call/room.html",(req,res)=>{
  res.sendFile(__dirname+"/room.html");
})

app.get("/working", async (req, res) => {
  try {
    const user = await isAuth(req);
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(401).send("bad request");
    }
  } catch (err) {
    res.status(401).send(err);
  }
});



var room;

app.get("/chat/:roomId", (req, res) => {
  room = req.params.roomId;
  res.sendFile(__dirname + "/chat.html");
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


//port----------------------------------------------------
const PORT = 3000;
http.listen(PORT, (req, res) => {
  console.log(`server started on port:${PORT}`);
});
