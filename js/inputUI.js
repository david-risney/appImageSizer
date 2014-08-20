var InputUI = function () {
    var that = this,
        fileInput,
        inputImageListElement,
        fileInputChangeHandler,
        addWidgetElement;

    this.initializeAsync = function (inputImageList) {
        fileInput = document.getElementById("fileInput");
        inputImageListView = document.getElementById("inputImageListView");
        fileInput.addEventListener("change", function (event) {
            var files;
            if (event.target && event.target.files) {
                Array.from(event.target.files).forEach(function (file) {
                    inputImageList.addFileAsync(file);
                });
            }
        });

        addWidgetElement = document.getElementById("addWidget");
        addWidgetElement.addEventListener("click", function () {
            fileInput.click();
        });

        function handleDrop(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            Array.from(evt.dataTransfer.files).forEach(function(file) {
                inputImageList.addFileAsync(file);
            });
        }

        function handleDragOver(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
        }

        // Setup the dnd listeners.
        addWidgetElement.addEventListener('dragover', handleDragOver, false);
        addWidgetElement.addEventListener('drop', handleDrop, false);

        inputImageList.addEventListener("changed", function () {
            Array.from(inputImageListView.querySelectorAll(".image-entry")).forEach(function (element) {
                element.parentElement.removeChild(element);
            });

            inputImageList.map(function(imageEntry) {
                return ObjectToHtml({
                    section: { class: "inline-block image-entry", id: imageEntry.id }, c: [
                        { div: { class: "inline-block image-container inline-center-container bordered" }, c: [
                            { img: { class: "block image-content center-content", src: imageEntry.modified.uri } }
                        ] },
                        { div: { class: "inline-block" }, c: [
                            { div: {}, t: imageEntry.name || "Image" },
                            { div: {}, t: imageEntry.modified.image.width + "px x " + imageEntry.modified.image.height + "px" },
                            { a: { class: "block removeImage control" }, e: { click: inputImageList.removeEntryById.bind(inputImageList, imageEntry.id) }, t: "Remove" }
                        ] }
                    ] });
            }).forEach(function(imageEntryElement) {
                inputImageListView.appendChild(imageEntryElement);
            });
        });

        return WinJS.Promise.wrap();
    };
};