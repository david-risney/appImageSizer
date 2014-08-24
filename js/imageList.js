var ImageList = (function () {
    var ImageList = function () {
        var that = ArrayWithEvent.apply(null, arguments),
            nextId = 0,
            mapFileToEntryAsync = function (file) {
                var id = ++nextId,
                    entry = {
                        id: id,
                        list: that,
                        name: file.name || "Image " + id,
                        original: {
                            blob: file,
                            uri: URL.createObjectURL(file)
                        },
                        modified: {
                            blob: file,
                            uri: URL.createObjectURL(file)
                        }
                    },
                    deferral = new SignalPromise(),
                    image = document.createElement("img");

                image.onload = function () {
                    entry.modified.image = entry.original.image = image;
                    if (image.width !== 0 && image.height !== 0) {
                        deferral.complete(entry);
                    }
                    else {
                        deferral.error(new Error("Your browser has bugs with this image format. Please use different images or a different browser."));
                    }
                };
                image.onerror = function () {
                    deferral.error(new Error("Failed to open image."));
                };
                image.src = entry.modified.uri;
                return deferral.promise;
            },
            idToItem = function (id) {
                return that.filter(function (item) { return item.id === id; })[0];
            },
            idToIdx = function (id) {
                return that.indexOf(idToItem(id));
            };

        that.addFileAsync = function (file) {
            return mapFileToEntryAsync(file).then(function (entry) {
                that.push(entry);
            });
        };
        that.addModifiedImageAsync = function (originalEntry, imageBlob) {
            return mapFileToEntryAsync(imageBlob).then(function (entry) {
                entry.original = originalEntry.modified;
                that.push(entry);
                return entry;
            });
        };
        that.clear = function () {
            splice(0, that.length);
        };
        that.removeEntryById = function (id) {
            var idx = idToIdx(id);
            that.splice(idx, 1)
        };

        return that;
    };

    return ImageList;
})();
