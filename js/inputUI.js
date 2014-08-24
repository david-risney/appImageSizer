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
                Array.from(event.target.files).map(function (file) {
                    return function () {
                        return inputImageList.addFileAsync(file);
                    }
                }).reduce(function (total, next) { return total.then(next); }, WinJS.Promise.wrap());
            }
        });

        addWidgetElement = document.getElementById("addWidget");
        addWidgetElement.addEventListener("click", function () {
            fileInput.click();
        });

        document.location.search.substr(1).split("&").filter(function (part) { return part.length > 0; }).forEach(function (part) {
            var decodedNameAndValue = part.split("=").map(decodeURIComponent),
                name,
                value;

            try {
                name = decodedNameAndValue[0];
                value = decodedNameAndValue[1];

                switch (name) {
                    case "add":
                        value.split(",").map(decodeURIComponent).map(function (uri) {
                            return function () {
                                return WinJS.xhr({ url: uri, responseType: "blob" }).then(function (xhr) {
                                    return inputImageList.addFileAsync(xhr.response);
                                });
                            };
                        }).reduce(function (total, next) { return total.then(next); }, WinJS.Promise.wrap());
                        break;

                    default:
                        console.error("Unknown URI query parameter: " + decodedNameAndValue.join(", "));
                        break;
                }
            }
            catch (e) {
                console.error("Invalid URI query parameter: " + decodedNameAndValue.join(", "));
            }
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