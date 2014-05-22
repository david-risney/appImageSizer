(function () {
    document.addEventListener("DOMContentLoaded", function () {
        var inputImageList = new ImageList(),
            inputUI = new InputUI();

        WinJS.UI.processAll().then(function () {
            return inputUI.initializeAsync(inputImageList);
        });
    });

    window.onbeforeunload = function () {
        //return "Leaving will destroy your work.";
    };

    zip.workerScriptsPath = "lib/zip/";

    WinJS.Application.start();
}());
