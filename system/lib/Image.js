/**
 * Created by gmena on 02-19-15.
 */

"use strict";

var Image;

Image = function () {
    var _self = this,
        _proto = _self.__proto__;

    _proto.validateImage = function (img) {
        return img.type.match('image.*');
    };

    _proto.getImage = function (event) {
        var img = event.target.files;
        return img[0];
    };

    _proto.requestResult = function (img, result) {
        var reader = new FileReader();

        reader.addEventListener('load', function (e) {
            result.attr('src', e.target.result);
        });

        reader.readAsDataURL(img)

    };

};