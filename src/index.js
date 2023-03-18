// targetting the select drops
const hoursSelectDrop = document.querySelector("#hours-input");
const minutesSelectDrop = document.querySelector("#minutes-input");
const secondsSelectDrop = document.querySelector("#seconds-input");
// setting the select drop values with help of js to save lot of code in html document
(
    function () {
        for (let index = 1; index <= 59; index++) {
            let value = parseInt(index.toString().padStart(2, '0'));
            let child = `<option value="${value}">${value}</option>`
            if (index <= 12) {
                hoursSelectDrop.innerHTML = hoursSelectDrop.innerHTML + child;
                // console.log(child);
            }
            minutesSelectDrop.innerHTML = minutesSelectDrop.innerHTML + child;
            secondsSelectDrop.innerHTML = secondsSelectDrop.innerHTML + child;
        }
    }
)();