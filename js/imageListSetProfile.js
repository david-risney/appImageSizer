var ImageListSetProfile = (function () {
    var that = this,
    partition = function (list, partitionMapFunction) {
        return list.map(partitionMapFunction).reduce(function (partitions, partitionId, index) {
            if (!partitions.has(partitionId)) {
                partitions.set(partitionId, []);
            }
            partitions.get(partitionId).push(list[index]);
            return partitions;
        }, new Map());
    },
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
            imageRatio = 100 * image.width / image.height;
        return clump(Math.abs(targetRatio - leftRatio), 10);
    },
    imageSizeSort = function (target, left, right) {
        var targetRatio = target.w * target.h,
            leftRatio = left.width * left.height,
            rightRatio = right.width * right.height;
        return Math.abs(targetRatio - leftRatio) - Math.abs(targetRatio - rightRatio);
    },
    keySort = function (left, right) {
        return left.key - right.key;
    },
    ImageListSetProfile = function () {
        this.sets = [
            { required: false, name: "Square 70x70 logo", type: ImageListSetProfile.smallLogo, preferredResolution: { w: 126, h: 126 }, resolutions: [{ w: 70, h: 70, f: "Square70x70Logo.scale-100.png" }, { w: 126, h: 126, f: "Square70x70Logo.scale-180.png" }, { w: 98, h: 98, f: "Square70x70Logo.scale-140.png" }, { w: 56, h: 56, f: "Square70x70Logo.scale-80.png" }] },
            { required: false, name: "Square 150x150 logo", type: ImageListSetProfile.largeLogo, preferredResolution: { w: 270, h: 270 }, resolutions: [{ w: 150, h: 150, f: "Squar150x150Logo.scale-100.png" }, { w: 270, h: 270, f: "Square150x150Logo.scale-180.png" }, { w: 210, h: 210, f: "Square150x150Logo.scale-140.png" }, { w: 120, h: 120, f: "Square150x150Logo.scale-80.png" }] },
            { required: false, name: "Wide 310x150 logo", type: ImageListSetProfile.largeLogo, preferredResolution: { w: 558, h: 270 }, resolutions: [{ w: 310, h: 150, f: "Square310x150Logo.scale-100.png" }, { w: 558, h: 270, f: "Square310x150Logo.scale-180.png" }, { w: 434, h: 210, f: "Square310x150Logo.scale-140.png" }, { w: 248, h: 120, f: "Square310x150Logo.scale-80.png" }] }
        ];

        this.guessBestImageForSetProfile = function (profileEntry, imageList) {
            var preferredResolution = profileEntry.preferredResolution,
                images = imageList.concat();

            aspectRatioDifferences = partition(images, aspectRatioDifference.bind(preferredResolution));
            return mapToArray(aspectRatioDifferences).sort(keySort)[0].sort(imageSizeSort.bind(preferredResolution))[0];
        };
        this.updateListSet = function (listSet, imageList) {
            while (listSet.length < that.sets.length) {
                listSet.push(new WinJS.Binding.List());
            }
            if (listSet.length > that.sets.length) {
                listSet.splice(that.sets.length, listSet.length - that.sets.length);
            }
            
        };
    };

    ImageListSetProfile.types = ["smallLogo", "largeLogo", "splashScreen"].reduce(function (types, typeName) { types[typeName] = typeName; return types; }, {});

    return ImageListSetProfile;
}());
