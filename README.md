appImageSizer
=============

Given your app's logo, produces the myriad of images at various resolutions required by your app platform.

 - Accepts a set of images using <[input type=file or drag and drop](http://www.html5rocks.com/en/tutorials/file/dndfiles/)
 - Select from a set of profiles that describe visual asset requirements for a particular app platform. Consists of type (logo, splashscreen etc), resolutions, and scale factors.
 - Fits best input image to each image combo from the profile but the user can override to whatever they like.
 - Uses canvas to scale the input images and turns them into Blob pngs.
 - Create a [zip of the Blobs](http://gildas-lormeau.github.io/zip.js/core-api.html) that the user can [download via saveAs / FileWriter.saveOrOpenBlob](https://github.com/eligrey/FileSaver.js)
