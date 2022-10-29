//mobile otp verification
const sendOtp = () => {
    const number = document.getElementById("num").value;
    fetch('/api/verifynumber', {

        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({ number: number })
    }).then((res) => {
        return res.json();
    }).then((fres) => {
        console.log(fres);
    });

}

//getting the coordinates of the user
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(sendPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function sendPosition(position) {
    fetch('/api/coordinates', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({ latitude: position.coords.latitude , longitude : position.coords.longitude })
    }).then((res) => {
        return res.json();
    }).then((fres) => {
        console.log(fres);
    });
}
getLocation();