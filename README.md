[appImageSizer](http://david-risney.github.io/appImageSizer)
=============

Given your app's logo, produces the myriad of images at various resolutions required by the Windows Store and all on your browser's client side JavaScript. [For example](https://david-risney.github.io/appImageSizer/?add=example/smallLogo.png,example/squareLogo.png,example/wideLogo.png)

Implementation
==============

The whole thing runs client side in your browser's JavaScript in the following fashion:

 - Accepts a set of images using <[input type=file or drag and drop](http://www.html5rocks.com/en/tutorials/file/dndfiles/)
 - You select from a set of app platform profiles that describe that platform's visual asset requirements.
 - Guesses best input image for each image combo from the profile. However, you can manually set to whatever you like.
 - Uses canvas to scale the input images and turns them into Blob pngs (using [Blob.js](http://purl.eligrey.com/github/Blob.js) and [canvas-toBlob.js](http://purl.eligrey.com/github/canvas-toBlob.js) to shim / normalize the associated DOM APIs).
 - Create a [zip of the Blobs](http://gildas-lormeau.github.io/zip.js/core-api.html) that you can [download via saveAs](https://github.com/eligrey/FileSaver.js)
 - Also uses [WinJS base.js](https://github.com/winjs/winjs/) for promises, and [ES5](https://github.com/es-shims/es5-shim/) and [ES6](https://github.com/paulmillr/es6-shim/) shims for good measure.

