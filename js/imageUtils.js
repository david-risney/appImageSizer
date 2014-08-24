var ImageUtils = (function () {
    var ImageUtils = {};

    ImageUtils.canvasDataToColor = function(canvasData) {
        return "rgba(" + 
            canvasData.data[0] + ", " +
            canvasData.data[1] + ", " +
            canvasData.data[2] + ", " +
            canvasData.data[3] +
            ")";
    }

    // originalImage is scaled by originalImageScale and then placed on a canvas at originalImageOffsetX/Y. The canvas is size cropWidhtxcropHeight
    ImageUtils.scaleAndCropAsync = function (image, imageOffsetX, imageOffsetY, imageScaledWidth, imageScaledHeight, canvasWidth, canvasHeight, canvasColor) {
        var canvas = document.createElement("canvas"),
            context,
            deferral = new SignalPromise();

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        context = canvas.getContext("2d");
        try {
            if (!canvasColor) {
                context.drawImage(image, 0, 0, image.width, image.height, 0, 0, image.width, image.height);
                canvasColor = ImageUtils.canvasDataToColor(context.getImageData(0, 0, 1, 1));
                context.clearRect(0, 0, canvasWidth, canvasHeight);
            }
        }
        catch (e) {
            deferral.error(new Error("Your browser has bugs with this image format. Please use a different image or a different browser."));
            canvasColor = "rgb(0, 0, 0, 0)";
        }
        context.fillStyle = canvasColor;
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.drawImage(image, 0, 0, image.width, image.height, imageOffsetX, imageOffsetY, imageScaledWidth, imageScaledHeight);

        canvas.toBlob(deferral.complete.bind(deferral));

        return deferral.promise;
    };

    // image is an image with width & height
    // resolution has w & h
    ImageUtils.fitImageToResolutionAsync = function (image, resolution) {
        var scale = resolution.w / image.width,
            scaledImageWidth,
            scaledImageHeight,
            offsetX,
            offsetY;

        if (image.height * scale > resolution.h) {
            scale = resolution.h / image.height;
        }
        scaledImageWidth = image.width * scale;
        scaledImageHeight = image.height * scale;

        offsetX = resolution.w / 2 - scaledImageWidth / 2;
        offsetY = resolution.h / 2 - scaledImageHeight / 2;

        return ImageUtils.scaleAndCropAsync(image, offsetX, offsetY, scaledImageWidth, scaledImageHeight, resolution.w, resolution.h);
    };

    return ImageUtils;
}());