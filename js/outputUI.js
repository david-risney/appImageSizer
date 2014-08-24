var OutputUI = function () {
    var that = this,
        outputImageListListView,
        inputImageList,
        outputImageListList,
        imageListListProfile;

    function handleDownloadZip() {
        var files = outputImageListList.map(function (outputImageList) {
                return outputImageList.map(function (outputImage) {
                    return { name: outputImage.resolution.f, blob: outputImage.modified.blob };
                });
            }).reduce(function (total, next) {
                return total.concat(next);
            }, []);
        ZipPromise.filesToZipBlobAsync(files).then(function (zipBlob) {
            saveAs(zipBlob, "appImages.zip");
        });
    }

    function selectionChangedHandler() {
        var id = parseInt(this.querySelector("option:checked").getAttribute("value"), 10),
            setName = this.getAttribute("data-set-name");
        console.log("Setting guess for " + setName + " to " + id);
        imageListListProfile.setBestGuessForProfile(setName, id);
    }

    function outputImageListToOptions(outputImageList) {
        var foundASelection = false,
            explicitSelection = imageListListProfile.getBestGuessForProfile(outputImageList.set.name),
            inputImageOptionElements = inputImageList.map(function (inputImage) {
                var optionObj = { option: { value: inputImage.id }, t: inputImage.name };
            
                if (explicitSelection === inputImage.id) {
                    foundASelection = true;
                    optionObj.option.selected = "";
                }
                return optionObj;
            }),
            guessForMe = { option: { value: -1 }, t: "Guess for me" };

        if (!foundASelection) {
            guessForMe.option.selected = "";
        }

        return [guessForMe].concat(inputImageOptionElements);
    }

    function updateAll() {
        outputImageListListView.innerHTML = "";
        outputImageListList.map(function (outputImageList) {
            var inputImageOptionElements = outputImageListToOptions(outputImageList),
                containerHtml = ObjectToHtml(
                    { div: { class: "flex-list vertical-nowrap" }, c: [
                        { h2: {}, t: outputImageList.set.name },
                        { select: { class: "block", size: 1, "data-set-name": outputImageList.set.name }, e: { change: selectionChangedHandler }, c: inputImageOptionElements },
                        { div: { class: "flex-list horizontal-wrap image-list-container"} }
                    ] }),
                containerNode = containerHtml.querySelector(".image-list-container");

            function updateImageList() {
                containerNode.innerHTML = "";

                outputImageList.map(function (imageEntry) {
                    return ObjectToHtml({ section: { class: "inline-block", id: imageEntry.id}, c: [
                        { div: { class: "image-container center-container bordered" }, c: [
                            { img: { class: "block image-content center-content", src: imageEntry.modified.uri } }
                        ] },
                        { div: { }, t: imageEntry.modified.image.width + " x " + imageEntry.modified.image.height }
                    ] });
                }).forEach(function (imageListHtml) {
                    containerNode.appendChild(imageListHtml);
                });
            }

            outputImageList.addEventListener("change", updateImageList);
            // imageList.addEventListener("changed", updateAll);
            updateImageList();

            return containerHtml;
        }).forEach(function(setElement) {
            outputImageListListView.appendChild(setElement);
        });
    }

    this.initializeAsync = function (inputImageListIn, imageListListProfileIn, outputImageListListIn) {
        var downloadWidgetElement;

        inputImageList = inputImageListIn;
        imageListListProfile = imageListListProfileIn;
        outputImageListList = outputImageListListIn;        

        outputImageListListView = document.getElementById("outputImageListListView");
        
        downloadWidgetElement = document.getElementById("downloadWidget");
        downloadWidgetElement.addEventListener("click", handleDownloadZip);

        outputImageListList.addEventListener("change", updateAll);
        inputImageList.addEventListener("change", updateAll);
        updateAll();
    };
};
