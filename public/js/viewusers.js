//currUser
var currUser = "";

//getting element from javascript
const showUserPic = document.getElementById("userpic");
const userName = document.getElementById("username");
const userAge = document.getElementById("userage");
const dist = document.getElementById("distance");

//getting user data

const getUser = () => {
  fetch('/api/userpic', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      number: "number"
    })
  }).then((res) => {
    return res.json();
  }).then((fres) => {
    // console.log(fres);
    showUserPic.src = fres.imgurl;
    userName.innerHTML = fres.name;
    userAge.innerHTML = fres.age;
    currUser = fres.userid;
    dist.innerHTML = fres.distance;
  });
}

//liking the user
const addUsertolikedList = async () => {
  fetch('/api/likeuser', {

    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      userid: currUser
    })
  }).then((res) => {
    return res.json();
  }).then((fres) => {
    console.log(fres);
  });
}

//superliking the user
const addUsertosuperlikedList = async () => {
  fetch('/api/superlikeuser', {

    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      userid: currUser
    })
  }).then((res) => {
    return res.json();
  }).then((fres) => {
    console.log(fres);
  });
}

//saving the viewed user
const saveUser = async () => {
  fetch('/api/saveuser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      userid: currUser
    })
  }).then((res) => {
    return res.json();
  }).then((fres) => {
    console.log(fres);
  });
}

//getting previous user
const previousUser = async () => {
  fetch('/api/getprevioususer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      number: "number"
    })
  }).then((res) => {
    return res.json();
  }).then((fres) => {
    // console.log(fres);
    showUserPic.src = fres.imgurl;
    userName.innerHTML = fres.name;
    userAge.innerHTML = fres.age;
    dist.innerHTML = fres.distance;
    currUser = fres.userid;
  });
}

//intial getUser calling
getUser();

//function calling on keyboard key press
document.addEventListener("keydown", function(event) {
  const key = event.key;
  console.log(key);
  if (key == "ArrowRight")
    likeUser();
  if (key == "ArrowLeft")
    skipUser();
});

//when we skip the user
const skipUser = async () => {
  await saveUser();
  getUser();
  console.log(`you skip the user : ${currUser}`);
}


//when we like the user
const likeUser = async () => {
  await addUsertolikedList();
  await saveUser();
  await getUser();

  console.log(`you liked the user : ${currUser}`);
  console.log("now you can go ahead");
}

//when we press the undo key
const undo = async () => {
  previousUser();
}

//when we press the superlike key
const superlikeuser = async () => {
  console.log("super like button is pressed");
  await addUsertolikedList();
  await addUsertosuperlikedList();
  await saveUser();
  getUser();

}
