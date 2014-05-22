var ImageUtils = (function () {
    var ImageUtils = {};

    ImageUtils.scale = function(image, scaleFactor) {
        return ImageUtils.scaleAndCrop(image, scaleFactor, 0, 0, image.width * scaleFactor, image.height * scaleFactor);
    };

    ImageUtils.scaleAndCrop = function (image, imageScale, cropX, cropY, cropWidth, cropHeight) {
        var canvas = document.createElement("canvas"),
            context;
        canvas.width = cropWidth;
        canvas.height = cropHeight;
        context = canvas.getContext("2d");
        context.drawImage(image, )
    };

    return ImageUtils;
}());