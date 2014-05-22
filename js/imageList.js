var ImageList = function () {
    var that = this,
        nextId = 0,
        mapFileToEntry = function (file) {
            return {
                id: nextId++,
                original: {
                    blob: file,
                    uri: URL.createObjectURL(file)
                },
                modified: {
                    blob: file,
                    uri: URL.createObjectURL(file)
                }
            };
        },
        idToItem = function(id) {
            return that.list.filter(function(item) { return item.id === id; })[0];
        },
        idToIdx = function(id) {
            return that.list.indexOf(idToItem(id));
        };

    this.list = new WinJS.Binding.List();
    this.addFile = function (file) {
        that.list.push(mapFileToEntry(file));
    };
    this.removeEntryById = function (id) {
        var idx = idToIdx(id);
        that.list.splice(idx, 1);
    };
};
