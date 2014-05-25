var InputUI = function () {
    var that = this,
        fileInput,
        inputImageListElement,
        fileInputChangeHandler,
        addWidgetElement;

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

        addWidgetElement = document.getElementById("addWidget");
        addWidgetElement.addEventListener("click", function () {
            fileInput.click();
        });

        inputImageListElement.winControl.data = inputImageList.list;

        function handleDrop(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            Array.from(evt.dataTransfer.files).forEach(inputImageList.addFileAsync.bind(inputImageList));
        }

        function handleDragOver(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
        }

        // Setup the dnd listeners.
        addWidgetElement.addEventListener('dragover', handleDragOver, false);
        addWidgetElement.addEventListener('drop', handleDrop, false);

        return WinJS.Promise.wrap();
    };
};