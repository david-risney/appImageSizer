var ZipPromise = (function () {
    var ZipPromise = {};

    // files is an array of file entries:
    //  [{name: "", blob: blob}, ...]
    ZipPromise.filesToZipBlobAsync = function (files) {
        var signal = new SignalPromise();

        function addFile(zipWriter, files) {
            var file = files[0];
            zipWriter.add(file.name, new zip.BlobReader(file.blob), function () {
                if (files.length > 1) {
                    addFile(zipWriter, files.slice(1));
                }
                else {
                    zipWriter.close(function (blob) {
                        signal.complete(blob);
                    });
                }
            });
        }

        zip.createWriter(new zip.BlobWriter("application/zip"), function (zipWriter) {
            addFile(zipWriter, files);
        }, function (error) {
            signal.error(error);
        });

        return signal.promise;
    }

    return ZipPromise;
})();