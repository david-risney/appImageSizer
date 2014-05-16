appImageSizer
=============

Given your app's logo, produces the myriad of images at various resolutions required by your app platform.

## Plan
 - Accept a set of images from the user using <input type=file or drag and drop (http://www.html5rocks.com/en/tutorials/file/dndfiles/)
 - Images profile consisting of type (logo, splashscreen etc), resolutions, and scale factors. One profile per app platform. Not user defined. Initially just  Windows Store Apps, but easily modifiable for other app platforms in source and maybe eventually user chooses between a set of profiles.
 - Fit best input image to each image combo from profile.
 - Canvas to scale the images and turn into Blob pngs.
 - Create a zip of the Blobs (via http://gildas-lormeau.github.io/zip.js/core-api.html)
 - Use saveAs / FileWriter.saveOrOpenBlob (via https://github.com/eligrey/FileSaver.js) to allow the user to download the zip of images.
