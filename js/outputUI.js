var OutputUI = function () {
    var that = this,
        outputImageListSetView,
        outputImageListSet;

    this.initializeAsync = function (inputImageList, imageListSetProfile) {
        outputImageListSetView = document.getElementById("outputImageListSetView");

        document.getElementById("updateOutputFromInput").addEventListener("click", function () {
            imageListSetProfile.updateListSetAsync(outputImageListSet, inputImageList).then(function () {
                outputImageListSet.notifyReload();
            });
        });

        return imageListSetProfile.updateListSetAsync(outputImageListSet, inputImageList).then(function (outputImageListSetIn) {
            outputImageListSet = outputImageListSetIn;
            outputImageListSetView.winControl.data = outputImageListSet;
        });
    };
};
