appImageSizer
=============

Given your app's logo, produces the myriad of images at various resolutions required by your app platform.

## Plan
Accept a set of images from the user (<input type=file), have an images profile consisting of type (logo, splashscreen etc), resolutions, and scale factors,  mechanism to fit best input image to each image type/resolution/scale combo, canvas to scale the images and turn into Blob pngs, create a zip of the images (via http://gildas-lormeau.github.io/zip.js/core-api.html), and use saveAs / FileWriter.saveOrOpenBlob (via https://github.com/eligrey/FileSaver.js) to allow the user to download the zip of images.
