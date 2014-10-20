/**
 * Created by Geolffrey on 27/02/14.
 */

/**Simple Profiling
 * @param type string
 * @constructor
 */


'use strict';
var Profiling;
Profiling = function (type) {
    var _proto = this.__proto__;

    this.type = !!type ? type : 'time';
    this.storage = new _.Repository;
    this.interval = null;
    this.process = null;
    this.init = 0;
    this.end = 0;

    /**Comienza el timer
     * @param type
     * @returns {number}
     */
    _proto.start = function (type) {
        var _self = this;
        type = !!type ? type : _self.type;
        _self.init = (this.getPerformanceTiming())[type];
        _self.storage.set(type, {start: _self.init}, false);
        return _self.init;
    };

    /**Event Handler
     * @param event
     * @param callback
     * @returns {*[]}
     */
    _proto.on = function (event, callback) {
        var self = this;
        return [{
            process: function () {
                if (callback) {
                    self.onprogress = callback;
                }
            }
        }[event]()];

    };

    /**Crea un break en el tiempo
     * @param type
     * @returns {number}
     */
    _proto.kerf = function (type) {
        var _self = this;
        type = !!type ? type : this.type;
        _self.end = (this.getPerformanceTiming())[type];
        _self.storage.append(type, {'end': _self.end});
        return _self.end;

    };

    _proto.getPerformanceTiming = function () {
        var _performance = performance.timing;
        return {
            'time': (new Date()).getTime(),
            'request': _performance.responseEnd,
            'connect': _performance.connectEnd,
            'navigation': _performance.loadEventEnd,
            'domload': _performance.domComplete
        };
    };

    /**Retorna el reporte del tiempo transcurrido
     * @param loop
     * @returns {boolean}
     */
    _proto.report = function (loop) {
        var _self = this,
            _data = _self.storage.get(_self.type),
            _ajax = new _.Ajax,
            _url_100KB = '/static/media/img/100_KB_sample.jpg',
            _final = (_data.end - _data.start) / 0x3E8;

        if (loop) {
            _self.interval = setInterval(function () {
                self.report(true);
            }, 0x3E8)
        }

        if (_self.type !== 'request' && _self.type !== 'connect') {
            if (self.process) {
                self.process({
                    'start': (_data.start / 0x3E8),
                    'end': (_data.end / 0x3E8),
                    'result': _final
                });
            }
            return false;
        }

        _ajax.request({
            url: _url_100KB,
            method: 'HEAD'
        }, function (m, t, r) {
            var _weight = +r.getResponseHeader('Content-Length'),
                _down_rate = ((_weight / 0x400) / _final);
            if (self.process) {
                self.process({
                    'start': (_data.start / 0x3E8),
                    'end': (_data.end / 0x3E8),
                    'result': _final,
                    'down_rate': _down_rate,
                    'bandwith': _down_rate * 0x40,
                    'down_speed': _down_rate * 0x8
                });
            }

        });

        // return _document_weigth;

    };

    //Stop Time
    _proto.stop = function () {
        var _self = this;
        clearInterval(_self.interval);
    };


};

Syrup.blend(Profiling);