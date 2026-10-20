const message = document.getElementById("message");
const loadButton = document.getElementById("loadbtn");
const profile = document.getElementById("profile");
const grade = document.getElementById("grade");
const schedule = document.getElementById("schedule");

loadButton.addEventListener("click", function () {
    message.textContent = "Loading Dashboard...";
    profile.textContent = "Profile: Waiting...";
    grade.textContent = "Grade: Waiting...";
    schedule.textContent = "Schedule: Waiting...";

    const profilePromise = new Promise(function (resolve) {
        setTimeout(function () {
            profile.textContent = "Profile: Loaded";
            resolve();
        }, 1000);
    });

    const gradePromise = new Promise(function (resolve) {
        setTimeout(function () {
            grade.textContent = "Grade: Loaded";
            resolve();
        }, 2000);
    });

    const schedulePromise = new Promise(function (resolve) {
        setTimeout(function () {
            schedule.textContent = "Schedule: Loaded";
            resolve();
        }, 3000);
    });

    Promise.all([profilePromise, gradePromise, schedulePromise]).then(function () {
        message.textContent = "Dashboard Ready!!!";
    });
});
