var ImageList = function () {
    var that = this,
        nextId = 0,
        mapFileToEntryAsync = function (file) {
            var entry = {
                id: nextId++,
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
        idToItem = function(id) {
            return that.list.filter(function(item) { return item.id === id; })[0];
        },
        idToIdx = function(id) {
            return that.list.indexOf(idToItem(id));
        };

    this.list = new WinJS.Binding.List();
    this.addFileAsync = function (file) {
        return mapFileToEntryAsync(file).then(function (entry) {
            that.list.push(entry);
        });
    };
    this.addModifiedImageAsync = function (originalEntry, imageBlob) {
        return mapFileToEntryAsync(imageBlob).then(function (entry) {
            entry.original = originalEntry.modified;
            that.list.push(entry);
        });
    };
    this.removeEntryById = function (id) {
        var idx = idToIdx(id);
        that.list.splice(idx, 1)
    };
};
