'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _messageEvent = require('message-event');

var _messageEvent2 = _interopRequireDefault(_messageEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 模拟react数据更新api
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by zhou on 17/3/6.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * data: {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *      type: 'xxxx'
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * };
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * state = {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *      value: stage.data,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var childData = function (_Message) {
    _inherits(childData, _Message);

    function childData() {
        var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, childData);

        var _this = _possibleConstructorReturn(this, (childData.__proto__ || Object.getPrototypeOf(childData)).call(this));

        _this._$$update = obj.update;
        _this._$$data = Object.assign({}, obj.data || {});
        _this._$$DATA = obj.top;
        return _this;
    }

    _createClass(childData, [{
        key: 'setState',
        value: function setState(obj, cb) {
            Object.assign(this._$$data, obj || {});
            this.forceUpdate(cb);
            return this;
        }
    }, {
        key: 'forceUpdate',
        value: function forceUpdate(cb) {
            this._$$update && this._$$update(cb);
        }
    }, {
        key: 'DATA',
        get: function get() {
            return this._$$DATA;
        }
    }, {
        key: 'state',
        set: function set(value) {
            this._$$data = value;
            return this._$$data;
        },
        get: function get() {
            return this._$$data;
        }
    }]);

    return childData;
}(_messageEvent2.default);

var Data = function (_childData) {
    _inherits(Data, _childData);

    function Data() {
        var _ref;

        var _temp, _this2, _ret;

        _classCallCheck(this, Data);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this2 = _possibleConstructorReturn(this, (_ref = Data.__proto__ || Object.getPrototypeOf(Data)).call.apply(_ref, [this].concat(args))), _this2), _this2._$$allModule = {}, _temp), _possibleConstructorReturn(_this2, _ret);
    }

    _createClass(Data, [{
        key: 'createModule',
        value: function createModule(key, data) {
            var that = this;
            if (this.existModule(key)) {
                console.log('key ' + key + ' found in ' + this._$$allModule);
                data && (this._$$allModule[key].state = data);
            } else {
                this._$$allModule[key] = new childData({
                    data: data,
                    update: that._$$update,
                    top: that
                });
            }
            return this._$$allModule[key];
        }
    }, {
        key: 'existModule',
        value: function existModule(key) {
            return !!this._$$allModule[key];
        }
    }, {
        key: 'removeModule',
        value: function removeModule(key) {
            delete this._$$allModule[key];
            return this;
        }
    }, {
        key: 'getModule',
        value: function getModule(key) {
            var that = this;
            if (key === undefined) return this._$$allModule;
            if (!this.existModule(key)) {
                //that._$$allModule[key] = that._$$allModule(key);
                //console.log(`key ${key} not found in ${this._$$allModule}`)
                return this.createModule(key);
            }
            return that._$$allModule[key];
        }
    }, {
        key: 'DATA',
        get: function get() {
            return this;
        }
    }]);

    return Data;
}(childData);

exports.default = Data;