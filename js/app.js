(function () {
    document.addEventListener("DOMContentLoaded", function () {
        var inputImageList = new ImageList(),
            inputUI = new InputUI(),
            outputUI = new OutputUI(),
            imageListListProfile = new ImageListListProfile(),
            outputImageListList;

        imageListListProfile.initializeAsync(inputImageList).then(function (outputImageListListIn) {
            outputImageListList = outputImageListListIn;
            return inputUI.initializeAsync(inputImageList, imageListListProfile);
        }).then(function () {
            return outputUI.initializeAsync(inputImageList, imageListListProfile, outputImageListList);
        });
    });

    zip.workerScriptsPath = "lib/zip/";
}());
