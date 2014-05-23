var OutputUI = function () {
    var that = this,
        outputImageListSetView,
        outputImageListSet;

    this.initializeAsync = function (inputImageList, imageListSetProfile) {
        outputImageListSetView = document.getElementById("outputImageListSetView");
        outputImageListSet = imageListSetProfile.updateListSet(outputImageListSet, inputImageList);
        outputImageListSetView.winControl.data = outputImageListSet;
        document.getElementById("updateOutputFromInput").addEventListener("click", function () {
            imageListSetProfile.updateListSet(outputImageListSet, inputImageList);
        });
        return WinJS.Promise.wrap();
    };
};
