'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.saveRender = exports.register = exports.connect = exports.Message = exports.DATA = exports.combine = exports.Com = exports.Provider = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _messageEvent = require('message-event');

var _messageEvent2 = _interopRequireDefault(_messageEvent);

var _data = require('./data');

var _data2 = _interopRequireDefault(_data);

var _safeRender = require('./safe-render');

var _safeRender2 = _interopRequireDefault(_safeRender);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by zhou on 17/3/1
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *模块实现原理
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var updateKey = Symbol('__UPDATE__ALL__Provider__');
//一个页面内只能使用一次
var DATA = new _data2.default({
    update: function update(cb) {
        var listens = DATA._listeners[updateKey];
        var n = listens && listens.length;
        DATA.fire(updateKey, function () {
            if (cb) {
                n--;
                if (n <= 0) {
                    cb();
                }
            }
        });
    }
});

var compoents = {};
/*
*
* <Provider init = {}></Provider>
* */
var storeTypes = {
    Data: _react.PropTypes.object.isRequired
};
//不通过这更新影响太大

var Provider = function (_Component) {
    _inherits(Provider, _Component);

    function Provider(props, conext) {
        _classCallCheck(this, Provider);

        var _this = _possibleConstructorReturn(this, (Provider.__proto__ || Object.getPrototypeOf(Provider)).call(this, props, conext));

        var init = props.init || {};
        if (typeof props.init === 'function') {
            init = props.init(DATA) || {};
        }
        if (props.error) {
            DATA.error = props.error;
        }
        if (init && init.initState) {
            DATA.state = init.initState;
        }
        if (props.isSafeRender === false) {
            DATA.isSafeRender = false;
        }
        return _this;
    }

    _createClass(Provider, [{
        key: 'getChildContext',
        value: function getChildContext() {
            return {
                Data: DATA
            };
        }
    }, {
        key: 'getData',
        value: function getData() {
            return DATA;
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: this.props.className },
                this.props.children
            );
        }
    }]);

    return Provider;
}(_react.Component);

// <Com type="module1"/> 数据从Data模块中获取 要求假设props不动态变化


Provider.defaultProps = {
    init: {},
    error: false,
    isSafeRender: true
};

var Com = function (_Component2) {
    _inherits(Com, _Component2);

    function Com(props, context) {
        _classCallCheck(this, Com);

        var _this2 = _possibleConstructorReturn(this, (Com.__proto__ || Object.getPrototypeOf(Com)).call(this, props, context));

        _this2.arrUpdate = [];

        _this2.moduleObj = DATA.getModule(props.module);
        _this2.comp = props.component || _this2.moduleObj.component;
        //不可动态修改
        _this2.options = Object.assign({ isPure: true, isOnlyFn: false, isSafeRender: null }, props.options || _this2.moduleObj.options || {});
        if (typeof _this2.comp === 'string') {
            _this2.comp = compoents[_this2.comp];
        }
        if (!_this2.comp) {
            var _ret;

            return _ret = console.error('component cannot be null', _this2.moduleObj, props.module), _possibleConstructorReturn(_this2, _ret);
        }
        if (_this2.options.isSafeRender === true || DATA.isSafeRender !== false && _this2.options.isSafeRender !== false) {
            _this2.comp = (0, _safeRender2.default)(_this2.comp, props.error || _this2.moduleObj.error || DATA.error);
        }
        _this2.state = _this2.getState();
        _this2.stateHashCode = _this2.createHashCode(_this2.state);
        _this2._update = function (cb) {
            if (_this2.didMount) {
                _this2.shouldSetState(_this2.getState(), cb);
            } else {
                _this2.arrUpdate.push(cb);
            }
        };
        //监听
        !_this2.options.isOnlyFn && DATA.on(updateKey, _this2._update);
        _this2.refObj = {};
        //动态ref不考虑
        if (props.ref) {
            _this2.refObj = { ref: function ref(c) {
                    _this2.child = c;
                } };
        }
        return _this2;
    }

    _createClass(Com, [{
        key: 'shouldSetState',
        value: function shouldSetState(state, cb) {
            if (this.isChangeState(state)) {
                this.setState(state, cb);
            } else {
                cb && cb();
            }
        }
    }, {
        key: 'getState',
        value: function getState() {
            var _this3 = this;

            var state = this.props.props || this.moduleObj.props || {};
            if (typeof state === 'function') {
                state = state(DATA) || {};
            }
            //添加这2方法
            state.state = state.state || this.moduleObj.state || {};
            if (this.moduleObj && this.moduleObj.setState) {
                ['fire', 'setState'].forEach(function (key) {
                    state[key] = state[key] || _this3.moduleObj[key].bind(_this3.moduleObj);
                });
            }
            return state;
        }
    }, {
        key: 'render',
        value: function render() {
            var Comp = this.comp;

            var _props = this.props,
                module = _props.module,
                ref = _props.ref,
                compoent = _props.compoent,
                options = _props.options,
                state = _props.state,
                props = _props.props,
                prop = _objectWithoutProperties(_props, ['module', 'ref', 'compoent', 'options', 'state', 'props']); //去除type


            return _react2.default.createElement(Comp, _extends({}, this.refObj, this.state, prop));
        }
        //不比较nextProps 假设 nextProps 不变

    }, {
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps, nextState) {
            if (this.isShouldComponentUpdate === true) {
                this.isShouldComponentUpdate = false;
                return true;
            } else if (this.options.isOnlyFn) {
                return false;
            } else if (this.options.isPure && !this.isChangeState(nextState, true)) {
                return false;
            }
            return true;
        }
    }, {
        key: 'createHashCode',
        value: function createHashCode(state) {
            var str = JSON.stringify(state);
            var hash = 0,
                i = void 0,
                chr = void 0,
                len = void 0;
            if (str.length === 0) return hash;
            for (i = 0, len = str.length; i < len; i++) {
                chr = str.charCodeAt(i);
                hash = (hash << 5) - hash + chr;
                hash |= 0; // Convert to 32bit integer
            }
            return hash;
        }
    }, {
        key: 'isChangeState',
        value: function isChangeState(state, no) {
            //state = state;
            var b = false;
            var hashState = this.createHashCode(state);
            if (this.stateHashCode !== hashState) {
                !no && (this.isShouldComponentUpdate = true);
                this.stateHashCode = hashState;
                b = true;
            }
            return b;
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this4 = this;

            this.didMount = true;
            var empty = function empty(arr) {
                arr.forEach(function (cb) {
                    return cb && cb();
                });
            };
            //重新更新
            if (this.arrUpdate && this.arrUpdate.length) {
                var state = this.getState();
                this.shouldSetState(state, function () {
                    empty(_this4.arrUpdate);
                });
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            !this.options.isOnlyFn && DATA.off(updateKey, this._update);
        }
    }]);

    return Com;
}(_react.Component);

Com.defaultProps = {
    module: ''
};
Com.propsTypes = {
    module: _react.PropTypes.string.isRequired
};
;

//兼容模式
var connect = function connect(module) {
    var _class, _temp;

    //option
    var defaultProps = {};
    if (typeof module === 'string') {
        defaultProps.module = module;
    } else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object') {
        defaultProps = module;
    } else if (typeof module === 'function') {
        defaultProps = module(DATA);
    } else {
        return conole.error('module\u53C2\u6570\u9519\u8BEF' + module);
    }
    var comp = defaultProps.component || DATA.getModule(defaultProps.module).component;
    if (typeof comp === 'string') {
        comp = compoents[comp];
    }
    if (!comp) {
        return conole.error('component\u672A\u627E\u5230' + module);
    }
    var displayName = (comp.name || comp.displayName || 'connect') + 'Connect';
    return _temp = _class = function (_Com) {
        _inherits(displayName, _Com);

        function displayName() {
            _classCallCheck(this, displayName);

            return _possibleConstructorReturn(this, (displayName.__proto__ || Object.getPrototypeOf(displayName)).apply(this, arguments));
        }

        return displayName;
    }(Com), _class.defaultProps = defaultProps, _temp;
};

var register = function register(obj, com) {
    if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
        compoents = Object.assign(compoents, obj);
    } else if (typeof obj === 'string' && typeof com === 'function') {
        compoents[obj] = com;
    }
    return compoents;
};

var combine = function combine() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (obj.initState) {
        DATA.state = obj.initState;
        delete obj.initState;
    }
    for (var key in obj) {
        var item = obj[key] || {};
        if (typeof item === 'function') {
            item = item(DATA) || {};
        }
        //提前创建数据
        Object.assign(DATA.createModule(key, item.initState), item);
    }
    return {};
};
//Com 模块模式 比connect使用更简单
exports.Provider = Provider;
exports.Com = Com;
exports.combine = combine;
exports.DATA = DATA;
exports.Message = _messageEvent2.default;
exports.connect = connect;
exports.register = register;
exports.saveRender = _safeRender2.default;