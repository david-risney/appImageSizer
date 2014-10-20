var InputUI = function () {
    var that = this,
        fileInput,
        inputImageListElement,
        fileInputChangeHandler,
        addWidgetElement,
        addUriElement,
        imageListListProfile;

    function updateProfileList() {
        var profileListElement = document.getElementById("profileList");
        profileListElement.innerHTML = "";
        imageListListProfile.getDefaultProfiles().map(function (profile) {
            return ObjectToHtml({ option: { value: profile.id }, t: profile.name });
        }).forEach(function (e) { profileListElement.appendChild(e); });

        profileListElement.addEventListener("change", function () {
            var id = parseInt(this.querySelector("option:checked").getAttribute("value"), 10);
            imageListListProfile.setProfile(imageListListProfile.getDefaultProfiles().filter(function (profile) { return profile.id === id })[0]);
        });
    }

    function displayError(error) {
        var message = "A poorly specific error has occured. Please file a bug at http://github.com/david-risney/appImageSizer and describe how to recreate this issue."
        while (error instanceof [].constructor && error.length) {
            error = error[0];
        }
        if (error && error.message) {
            message = error.message;
        }
        document.getElementById("user-message").textContent = message;
    }

    this.initializeAsync = function (inputImageList, imageListListProfileIn) {
        imageListListProfile = imageListListProfileIn;

        updateProfileList();

        imageListListProfile.addEventListener("error", displayError);

        fileInput = document.getElementById("fileInput");
        inputImageListView = document.getElementById("inputImageListView");
        fileInput.addEventListener("change", function (event) {
            var files;
            if (event.target && event.target.files) {
                Array.from(event.target.files).map(function (file) {
                    return function () {
                        return inputImageList.addFileAsync(file);
                    }
                }).reduce(function (total, next) { return total.then(next, displayError); }, WinJS.Promise.wrap());
            }
        });

        addWidgetElement = document.getElementById("addWidget");
        addWidgetElement.addEventListener("click", function () {
            fileInput.click();
        });

        function onAddImageUrl() {
            inputImageList.addUriAsync(addUriElement.value).then(undefined, displayError);
        }
        addUriElement = document.getElementById("addUrl");
        addUriElement.addEventListener("keydown", function (event) {
            var charCode = event.charCode || event.keyCode;
            if (charCode == 0xD) {
                onAddImageUrl();
            }
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
                        }).reduce(function (total, next) { return total.then(next, displayError); }, WinJS.Promise.wrap());
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

            Array.from(evt.dataTransfer.files).map(function (file) {
                return function () {
                    return inputImageList.addFileAsync(file);
                }
            }).reduce(function (total, next) { return total.then(next, displayError); }, WinJS.Promise.wrap());
        }

        function handleDragOver(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
        }

        // Setup the dnd listeners.
        addWidgetElement.addEventListener('dragover', handleDragOver, false);
        addWidgetElement.addEventListener('drop', handleDrop, false);

        inputImageList.addEventListener("change", function () {
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
