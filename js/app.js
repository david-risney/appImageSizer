(function () {
    document.addEventListener("DOMContentLoaded", function () {
        var inputImageList = new ImageList(),
            inputUI = new InputUI(),
            outputUI = new OutputUI(),
            imageListSetProfile = new ImageListSetProfile();

        WinJS.UI.processAll().then(function () {
            return inputUI.initializeAsync(inputImageList);
        }).then(function () {
            return outputUI.initializeAsync(inputImageList, imageListSetProfile);
        });
    });

    window.onbeforeunload = function () {
        //return "Leaving will destroy your work.";
    };

    zip.workerScriptsPath = "lib/zip/";

    WinJS.Application.start();
}());
