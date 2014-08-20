var ImageList = (function () {
    var ImageList = function () {
        var that = ArrayWithEvent.apply(null, arguments),
            nextId = 0,
            mapFileToEntryAsync = function (file) {
                var entry = {
                    id: nextId++,
                    list: that,
                    name: file.name,
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
                    deferral.complete(entry);
                };
                image.onerror = function () {
                    deferral.error();
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
