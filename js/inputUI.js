var InputUI = function () {
    var that = this,
        fileInput = document.getElementById("fileInput"),
        inputImageList = document.getElementById("inputImageList"),
        mapFileToEntry = function (file) {
            return {
                file: file,
                uri: URL.createObjectURL(file)
            };
        },
        fileInputChangeHandler = function (event) {
            var files = event.target && event.target.files;
            if (files) {
                that.list.splice.apply(that.list, [0, that.list.length].concat(files.map(mapFileToEntry)));
            }
        };

    fileInput.addEventListener("change", fileInputChangeHandler, false);

    this.list = new WinJS.Binding.List();
    inputImageList.winControl.data = this.list;
};