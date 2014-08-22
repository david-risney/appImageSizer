var ImageListListProfile = (function () {
    var partition = function (list, partitionMapFunction) {
        return list.map(partitionMapFunction).reduce(function (partitions, partitionId, index) {
            if (!partitions.has(partitionId)) {
                partitions.set(partitionId, []);
            }
            partitions.get(partitionId).push(list[index]);
            return partitions;
        }, new Map());
    },
    placeholderImageEntry,
    mapToArray = function (map) {
        var array = [];
        map.forEach(function (value, key) {
            array.push({ value: value, key: key });
        });
        return array;
    },
    clump = function (value, clumpSize) {
        return value - (value % clumpSize);
    },
    aspectRatioDifference = function (target, image) {
        var targetRatio = 100 * target.w / target.h,
            imageRatio = 100 * image.modified.image.width / image.modified.image.height;
        return clump(Math.abs(targetRatio - imageRatio), 10);
    },
    imageSizeSort = function (target, left, right) {
        var targetRatio = target.w * target.h,
            leftRatio = left.modified.image.width * left.modified.image.height,
            rightRatio = right.modified.image.width * right.modified.image.height;
        return Math.abs(targetRatio - leftRatio) - Math.abs(targetRatio - rightRatio);
    },
    keySort = function (left, right) {
        return left.key - right.key;
    },
    ImageListListProfile = function () {
        var that = this,
            explicitGuesses = {},
            sets,
            outputImageListList = new ImageListList(),
            inputImageList;

        // Win8 app logo profile
        sets = new ArrayWithEvent(
            { name: "Square 150x150 logo", type: ImageListListProfile.largeLogo, resolutions: [{ w: 270, h: 270, f: "Square150x150Logo.scale-180.png" }, { w: 210, h: 210, f: "Square150x150Logo.scale-140.png" }, { w: 150, h: 150, f: "Square150x150Logo.scale-100.png" }, { w: 120, h: 120, f: "Square150x150Logo.scale-80.png" }] },
            { name: "Wide 310x150 logo", type: ImageListListProfile.largeLogo, resolutions: [{ w: 558, h: 270, f: "Wide310x150Logo.scale-180.png" }, { w: 434, h: 210, f: "Wide310x150Logo.scale-140.png" }, { w: 310, h: 150, f: "Wide310x150Logo.scale-100.png" }, { w: 248, h: 120, f: "Wide310x150Logo.scale-80.png" }] },
            { name: "Square 30x30 logo", type: ImageListListProfile.smallLogo, resolutions: [
                { w: 54, h: 54, f: "Square30x30Logo.scale-180.png" }, { w: 42, h: 42, f: "Square30x30Logo.scale-140.png" }, { w: 30, h: 30, f: "Square30x30Logo.scale-100.png" }, { w: 24, h: 24, f: "Square30x30Logo.scale-80.png" },
                { w: 256, h: 256, f: "Square30x30Logo.target-256.png" }, { w: 48, h: 48, f: "Square30x30Logo.target-48.png" }, { w: 32, h: 32, f: "Square30x30Logo.target-32.png" }, { w: 16, h: 16, f: "Square30x30Logo.target-16.png" }
            ] },
            { name: "Store logo", type: ImageListListProfile.smallLogo, resolutions: [{ w: 90, h: 90, f: "StoreLogo.scale-180.png" }, { w: 70, h: 70, f: "StoreLogo.scale-140.png" }, { w: 50, h: 50, f: "StoreLogo.scale-100.png" }] }
        );

        // Win8.1 app logo profile
        sets = new ArrayWithEvent(
            { name: "Square 70x70 logo", type: ImageListListProfile.smallLogo, resolutions: [{ w: 126, h: 126, f: "Square70x70Logo.scale-180.png" }, { w: 98, h: 98, f: "Square70x70Logo.scale-140.png" }, { w: 70, h: 70, f: "Square70x70Logo.scale-100.png" }, { w: 56, h: 56, f: "Square70x70Logo.scale-80.png" }] },
            { name: "Square 150x150 logo", type: ImageListListProfile.largeLogo, resolutions: [{ w: 270, h: 270, f: "Square150x150Logo.scale-180.png" }, { w: 210, h: 210, f: "Square150x150Logo.scale-140.png" }, { w: 150, h: 150, f: "Square150x150Logo.scale-100.png" }, { w: 120, h: 120, f: "Square150x150Logo.scale-80.png" }] },
            { name: "Wide 310x150 logo", type: ImageListListProfile.largeLogo, resolutions: [{ w: 558, h: 270, f: "Wide310x150Logo.scale-180.png" }, { w: 434, h: 210, f: "Wide310x150Logo.scale-140.png" }, { w: 310, h: 150, f: "Wide310x150Logo.scale-100.png" }, { w: 248, h: 120, f: "Wide310x150Logo.scale-80.png" }] },
            { name: "Square 310x310 logo", type: ImageListListProfile.largeLogo, resolutions: [{ w: 558, h: 558, f: "Square310x310Logo.scale-180.png" }, { w: 434, h: 434, f: "Square310x310Logo.scale-140.png" }, { w: 310, h: 310, f: "Square310x310Logo.scale-100.png" }, { w: 248, h: 248, f: "Square310x310Logo.scale-80.png" }] },
            { name: "Square 30x30 logo", type: ImageListListProfile.smallLogo, resolutions: [
                { w: 54, h: 54, f: "Square30x30Logo.scale-180.png" }, { w: 42, h: 42, f: "Square30x30Logo.scale-140.png" }, { w: 30, h: 30, f: "Square30x30Logo.scale-100.png" }, { w: 24, h: 24, f: "Square30x30Logo.scale-80.png" },
                { w: 256, h: 256, f: "Square30x30Logo.target-256.png" }, { w: 48, h: 48, f: "Square30x30Logo.target-48.png" }, { w: 32, h: 32, f: "Square30x30Logo.target-32.png" }, { w: 16, h: 16, f: "Square30x30Logo.target-16.png" }
            ] },
            { name: "Store logo", type: ImageListListProfile.smallLogo, resolutions: [{ w: 90, h: 90, f: "StoreLogo.scale-180.png" }, { w: 70, h: 70, f: "StoreLogo.scale-140.png" }, { w: 50, h: 50, f: "StoreLogo.scale-100.png" }] },
            { name: "Badge logo", type: ImageListListProfile.smallLogo, resolutions: [{ w: 43, h: 43, f: "BadgeLogo.scale-180.png" }, { w: 33, h: 33, f: "BadgeLogo.scale-140.png" }, { w: 24, h: 24, f: "BadgeLogo.scale-100.png" }] },
            { name: "Splash screen", type: ImageListListProfile.splashScreen, resolutions: [{ w: 1116, h: 540, f: "SplashScreen.scale-180.png" }, { w: 868, h: 420, f: "SplashScreen.scale-140.png" }, { w: 620, h: 300, f: "SplashScreen.scale-100.png" }] },
            { name: "Promotional Image 1", type: ImageListListProfile.promotional, resolutions: [{ w: 414, h: 180, f: "Promotional-414x180.png" }] },
            { name: "Promotional Image 2", type: ImageListListProfile.promotional, resolutions: [{ w: 414, h: 468, f: "Promotional-414x468.png" }] },
            { name: "Promotional Image 3", type: ImageListListProfile.promotional, resolutions: [{ w: 558, h: 558, f: "Promotional-558x558.png" }] },
            { name: "Promotional Image 4", type: ImageListListProfile.promotional, resolutions: [{ w: 558, h: 756, f: "Promotional-558x756.png" }] },
            { name: "Promotional Image 5", type: ImageListListProfile.promotional, resolutions: [{ w: 846, h: 468, f: "Promotional-846x468.png" }] }
        );

        this.initializeAsync = function (inputImageList) {
            var result = WinJS.Promise.wrap();
            placeholderImageEntry = {
                id: -1,
                original: {
                    blob: null,
                    uri: "images/placeholder.png",
                    image: null
                }
            };
            placeholderImageEntry.modified = placeholderImageEntry.original;
            result = WinJS.xhr({ url: "images/placeholder.png", responseType: "blob" }).then(function (xhr) {
                var deferral = new SignalPromise();
                placeholderImageEntry.original.blob = xhr.response;
                placeholderImageEntry.original.image = document.createElement("img");
                placeholderImageEntry.original.image.onload = function () {
                    deferral.complete();
                };
                placeholderImageEntry.original.image.onerror = function () {
                    deferral.error();
                };
                placeholderImageEntry.original.image.src = "images/placeholder.png";

                return deferral.promise;
            });

            return result.then(function () {
                bindToInputImageList(inputImageList);
                return outputImageListList;
            });
        };

        function ensureInt(value) {
            if (typeof value === "string") {
                value = parseInt(value, 10);
            }
            return value;
        }

        this.getBestGuessForProfile = function (profileEntryName) {
            return explicitGuesses[profileEntryName];
        }

        this.setBestGuessForProfile = function (profileEntryName, imageEntryId) {
            var oldProfileEntryValue = explicitGuesses[profileEntryName];
            if (imageEntryId >= 0) {
                explicitGuesses[profileEntryName] = ensureInt(imageEntryId);
            }
            else {
                delete explicitGuess[profileEntryName];
            }

            if (oldProfileEntryValue != explicitGuesses[profileEntryName]) {
                profileSetInfoChange();
            }
        };

        function guessBestImageForSetProfile(profileEntry, imageList) {
            var preferredResolution = profileEntry.resolutions[0],
                images = imageList.concat(),
                aspectRatioDifferences,
                arr,
                imageEntry;

            if (explicitGuesses.hasOwnProperty(profileEntry.name)) {
                imageEntry = images.filter(function (imageEntry) { return imageEntry.id === explicitGuesses[profileEntry.name]; })[0];
                console.log(" - using explicit entry for " + profileEntry.name + " = " + imageEntry.id);
            }
            else {
                if (images.length) {
                    aspectRatioDifferences = partition(images, aspectRatioDifference.bind(null, preferredResolution));
                    arr = mapToArray(aspectRatioDifferences).sort(keySort);
                    imageEntry = arr[0].value.sort(imageSizeSort.bind(null, preferredResolution))[0];
                    console.log(" - using guess for " + profileEntry.name + " = " + imageEntry.id);
                }
                else {
                    console.log(" - using placeholder for " + profileEntry.name + " = placeholder");
                    imageEntry = placeholderImageEntry;
                }
            }
            return imageEntry;
        };

        function profileSetToOutputImageListAsync(set, inputImageList, outputImageList) {
            var sourceImage = guessBestImageForSetProfile(set, inputImageList),
                promises = [];

            outputImageList.splice(0, outputImageList.length);

            if (sourceImage) {
                promises = set.resolutions.map(function (resolution) {
                    return ImageUtils.fitImageToResolutionAsync(sourceImage.modified.image, resolution).then(function (fittedImage) {
                        return outputImageList.addModifiedImageAsync(sourceImage, fittedImage);
                    }).then(function (entry) {
                        entry.resolution = resolution;
                        console.log("Added modified image.");
                    });
                });
            }

            return WinJS.Promise.join(promises).then(function () {
                console.log("join complete");
                outputImageList.set = set;
                outputImageList.sourceImage = sourceImage;
                return outputImageList;
            });
        };

        function profileSetInfoChange() {
            outputImageListList.splice(0, outputImageListList.length);
            WinJS.Promise.join(sets.map(function (set) { return profileSetToOutputImageListAsync(set, inputImageList, new ImageList()); })).then(function (imageLists) {
                imageLists.forEach(function (imageList) {
                    outputImageListList.push(imageList);
                })
            });
        }

        function bindToInputImageList(inputImageListIn) {
            inputImageList = inputImageListIn;
            sets.addEventListener("changed", function () { profileSetInfoChange(); });
            profileSetInfoChange();

            inputImageList.addEventListener("changed", function () {
                WinJS.Promise.join(sets.map(function (set, setIndex) { return profileSetToOutputImageListAsync(set, inputImageList, outputImageListList[setIndex]); })).then(function (imageLists) {
                    console.log("update finished.");
                });
            });

            return outputImageListList;
        };
    };

    ImageListListProfile.types = ["smallLogo", "largeLogo", "splashScreen", "promotional"].reduce(function (types, typeName) { types[typeName] = typeName; return types; }, {});

    return ImageListListProfile;
}());
