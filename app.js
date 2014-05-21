(function () {
    document.addEventListener("DOMContentLoaded", function () {
        zip.workerScriptsPath = "lib/zip/";
    });

    window.onbeforeunload = function () {
        return "Leaving will destroy your work.";
    };
}());
