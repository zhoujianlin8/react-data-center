/**
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
import Message from 'message-event';
class Data extends Message{
    _data = {};
    _all = {};
    constructor(obj = {}) {
        super();
        this._update = obj.update;
        this._data = Object.assign({}, obj.data || {});
    }
    get state() {
        return this._data;
    }
    initState(type, obj) {
        if (typeof type === 'string') {
            if (this._data[type]) {
                return console.error('it has already init state' + this._data[type])
            } else {
                this._data[type] = Object.assign({}, obj || {});
            }
        } else {
            if (this._hasInitState) {
                return console.error('it has already init state all' + obj)
            } else {
                this._hasInitState = true;
            }
            type = undefined;
            obj = type;
            this._data = Object.assign(this._data, obj || {});
        }
        return this.getModule(type);
    }

    forceUpdate(cb) {
        this._update && this._update(cb);
        return this;
    }

    setState(obj, cb) {
        this._data = Object.assign(this.state, obj);
        this.forceUpdate(cb);
        return this;
    }
    _create(key) {
        const that = this;
        class Child extends Message{
            forceUpdate (...props) {
                that.forceUpdate.apply(that, props);
                return this;
            }
            clear (i) {
                if (i === undefined) {
                    delete that._data[i]
                } else {
                    delete this.state[i]
                }
                return this;
            }
            get state() {
                return that._data[key]
            }
            setState (obj, cb){
                that._data[key] = Object.assign(this.state, obj);
                that.setState({}, cb);
                return this;
            }
            top = that;
        }
        return new Child();
    }
    getModule(key) {
        var that = this;
        if (key === undefined) return that;
        if (!that._all[key]) {
            that._all[key] = that._create(key);
        }
        return that._all[key];
    }
};
export default Data;