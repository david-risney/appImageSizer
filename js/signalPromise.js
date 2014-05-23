var SignalPromise = function () {
    var complete,
        error,
        progress,
        promise = new WinJS.Promise(function init(c, e, p) {
            complete = c;
            error = e;
            progress = p;
        });

    this.complete = complete;
    this.error = error;
    this.progress = progress;
    this.promise = promise;
};