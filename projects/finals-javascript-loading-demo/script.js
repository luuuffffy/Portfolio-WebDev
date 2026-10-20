const studentForm = document.getElementById("student-form");
const studentList = document.getElementById("student-list");
const darkModeButton = document.getElementById("dark-mode");
const originalModeButton = document.getElementById("original-mode");

darkModeButton.addEventListener("click", function () {
    document.body.classList.add("dark-mode");
    darkModeButton.setAttribute("aria-pressed", "true");
    originalModeButton.setAttribute("aria-pressed", "false");
});

originalModeButton.addEventListener("click", function () {
    document.body.classList.remove("dark-mode");
    darkModeButton.setAttribute("aria-pressed", "false");
    originalModeButton.setAttribute("aria-pressed", "true");
});

studentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(studentForm);
    const row = document.createElement("tr");

    ["studentNumber", "firstName", "lastName", "course"].forEach(function (field) {
        const cell = document.createElement("td");
        cell.textContent = formData.get(field).trim();
        row.appendChild(cell);
    });

    studentList.appendChild(row);
    studentForm.reset();
});
