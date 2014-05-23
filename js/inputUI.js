var InputUI = function () {
    var that = this,
        fileInput,
        inputImageListElement,
        fileInputChangeHandler;

    this.initializeAsync = function (inputImageList) {
        fileInputChangeHandler = function (event) {
            var files;
            if (event.target && event.target.files) {
                Array.from(event.target.files).forEach(inputImageList.addFileAsync.bind(inputImageList));
            }
        };
        fileInput = document.getElementById("fileInput");
        inputImageListElement = document.getElementById("inputImageListView");
        fileInput.addEventListener("change", fileInputChangeHandler, false);

        inputImageListElement.winControl.data = inputImageList.list;
        return WinJS.Promise.wrap();
    };
};