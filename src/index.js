// global array for setting alarms
let alarmList = [];

// targetting the select drops and setAlarm btn
const hoursSelectDrop = document.querySelector("#hours-input");
const minutesSelectDrop = document.querySelector("#minutes-input");
const secondsSelectDrop = document.querySelector("#seconds-input");
const periodSelectDrop = document.querySelector("#period-input");
const setAlarmbtn = document.querySelector("#setAlarmBtn")

// targetting the current time inputs
const currentHours = document.querySelector("#current-hours");
const currentMinutes = document.querySelector("#current-minutes");
const currentSeconds = document.querySelector("#current-seconds");
const currentPeriod = document.querySelector("#current-period");

// targetting the alarms container
const alarmListContainer = document.querySelector(".alarms");

// Get the dialog box element
const dialogBox = document.getElementById("dialog-box");
const dialogBoxOutput = document.getElementById("dialog-output");

// Get the confirm and cancel buttons
const confirmBtn = document.getElementById("confirm-btn");

// targeting audio tag for playing sound when alarm is active
const audio = document.querySelector("#audioTrack");

// scroll icon if list is scrollable
const scrollDownIcon = document.querySelector("#scroll-down");

// setting the select drop values with help of js to save lot of code in html document
(function () {
    for (let index = 1; index <= 59; index++) {
        let value = parseInt(index.toString().padStart(2, "0"));
        let child = `<option value="${value}">${value}</option>`;
        if (index <= 12) {
            hoursSelectDrop.innerHTML = hoursSelectDrop.innerHTML + child;
            // console.log(child);
        }
        minutesSelectDrop.innerHTML = minutesSelectDrop.innerHTML + child;
        secondsSelectDrop.innerHTML = secondsSelectDrop.innerHTML + child;
    }
})();

// rendrList functin for rendering alarms in ul i.e. alarms container
function renderList() {
    alarmListContainer.innerHTML = "";
    alarmList.map((child, index) => {
        let hours = child.time.getHours();
        if (hours == 0) {
            hours = 12;
        } else if (hours > 12) {
            hours = hours - 12;
        }
        let e = `<li class="alarm">${hours}:${child.time.getMinutes()}:${child.time.getSeconds()}${child.period
            }
        <button id="delete" class="btn btn-regular btn-dl" data-id="${child.id
            }">
            <img src="src/assets/bin.png" id="delete" width="20px" data-id="${child.id
            }" alt="Delete-icon">
        </button>
    </li>`;
        alarmListContainer.innerHTML = alarmListContainer.innerHTML + e;
    });
    if (alarmList.length > 3) {
        scrollDownIcon.style.display = "block";
    } else {
        scrollDownIcon.style.display = "none";
    }
    if (alarmList.length > 0) {
        localStorage.setItem('alarmList', JSON.stringify(alarmList));
    } else {
        localStorage.removeItem('alarmList');
    }
}

// element adding function to alarmList
function addToAlarmList(child) {
    alarmList.push({ ...child });
    renderList();
}

// element removing function to alarmList
function removeAlarm(id) {
    alarmList = alarmList.filter((item) => item.id != id);
    renderList();
}

// getting inputed data from select drops
function getSelectDropsData() {
    let hours = parseInt(hoursSelectDrop.value);
    let minutes = parseInt(minutesSelectDrop.value);
    let seconds = parseInt(secondsSelectDrop.value);
    let period = periodSelectDrop.value;
    return {
        hours,
        minutes,
        seconds,
        period,
    };
}

// defining get date function based on selectdrop values
function getDate({ hours, minutes, seconds, period }) {
    let date = new Date();
    date.setHours(hours + (period === "PM" && hours !== 12 ? 12 : 0));
    date.setMinutes(minutes);
    date.setSeconds(seconds);
    // console.log(date);
    return date;
}

// function for ringing the alarm and adding to dialogbox
function ringAlarm(time) {
    audio.play();
    let para = document.createElement("p");
    let alarmTime = time.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
    });
    para.innerHTML = alarmTime;
    dialogBoxOutput.append(para);
    dialogBox.style.display = "block";
}

// function for setting the alarm
function setAlarm(alarmTime) {
    let currentTime = new Date();
    // Calculate the difference between the input time and the current time, in milliseconds
    let diff = alarmTime.getTime() - currentTime.getTime();
    // The input time has already passed today, so add a day to the alarm time
    if (diff < 0) {
        diff += 24 * 60 * 60 * 1000;
    }
    setTimeout(() => {
        ringAlarm(alarmTime);
    }, diff);
}

// appening function in ul for alarms
function addAlarm() {
    let input = getSelectDropsData();
    if (input.hours <= 0) {
        alert("Please select hour value to set alarm");
        return;
    }
    let time = getDate({ ...input });
    let childObj = {};
    childObj.id = time.getTime().toString();
    childObj.description = "";
    childObj.time = time;
    childObj.period = input.period;
    addToAlarmList(childObj);
    setAlarm(time);
    // console.log(childObj);
}

// handling setAlarm click
setAlarmbtn.addEventListener("click", addAlarm);

// Hide the dialog box and stop ringing alarm
function handleCloseAlarm() {
    dialogBox.style.display = "none";
    dialogBoxOutput.innerHTML = "";
    audio.currentTime = 0;
    audio.pause();
}

// current time updating function
function currentTimeUpdater() {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let period = hours >= 12 ? "PM" : "AM";

    if (hours == 0) {
        hours = 12;
    } else if (hours > 12) {
        hours = hours - 12;
    }
    currentHours.value = hours;
    currentMinutes.value = minutes;
    currentSeconds.value = seconds;
    currentPeriod.value = period;
}

// set the interval for updation of time each second
(function () {
    setInterval(() => {
        currentTimeUpdater();
    }, 1000);
})();

// adding event delegation to save code writing and repeating
document.addEventListener("click", function (e) {
    // console.log(e.target);
    if (e.target.id == "delete") {
        let id = e.target.dataset.id;
        removeAlarm(id);
    }
});

// adding event listener to hide dialog box
confirmBtn.addEventListener("click", handleCloseAlarm);

// writing fe for alarms retention
(
    function () {
        const retrievedArray = JSON.parse(localStorage.getItem('alarmList'));
        if (retrievedArray == undefined) {
            return
        }
        let retrive = window.confirm("Do You want to recover previously saved alarms?");
        if (retrive) {
            for (const element of retrievedArray) {
                let todayTime = new Date();
                let shouldTime = new Date(element.time);
                todayTime.setHours(shouldTime.getHours());
                todayTime.setMinutes(shouldTime.getMinutes());
                todayTime.setSeconds(shouldTime.getSeconds());
                let child = { ...element, time: todayTime }
                alarmList.push(child);
            }
            renderList();
            for (const child of alarmList) {
                setAlarm(child.time);
            }
        } else {
            localStorage.removeItem("alarmList")
        }
    }
)();