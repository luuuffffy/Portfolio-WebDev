$(document).ready(function () {
    $("#change-title").on("click", function () {
        $("#title").text("Welcome To My Interactive Profile");
    });

    $("#hide-profile").on("click", function () {
        $("#profile").hide("slow");
    });

    $("#show-profile").on("click", function () {
        $("#profile").show("slow");
    });

    $("#course").on("change", function () {
        $("#selected-course").text($(this).val());
    });

    $("#color-odd").on("click", function () {
        $("#data-table tbody tr").removeClass("even-row").filter(":even").addClass("odd-row");
    });

    $("#color-even").on("click", function () {
        $("#data-table tbody tr").removeClass("odd-row").filter(":odd").addClass("even-row");
    });

    $("#hide-table").on("click", function () {
        $("#table-section").hide("slow");
    });

    $("#show-table").on("click", function () {
        $("#table-section").show("slow");
    });
});
