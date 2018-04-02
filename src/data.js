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
class childData extends Message {
    constructor(obj = {}) {
        super();
        this._$$update = obj.update;
        this._$$data = Object.assign({}, obj.data || {});
        this._$$DATA = obj.top;
    }
    get DATA(){
        return this._$$DATA;
    }
    set state (value){
        this._$$data = value;
        return this._$$data;
    }
    get state() {
        return this._$$data;
    }
    setState (obj, cb){
        Object.assign(this._$$data, obj || {});
        this.forceUpdate(cb);
        return this;
    }
    forceUpdate(cb){
        this._$$update && this._$$update(cb);
    }
}

class Data extends childData{
    _$$allModule = {};
    get DATA (){
        return this
    }
    createModule(key,data){
        const that = this;
        if(this.existModule(key)){
            console.log(`key ${key} found in ${this._$$allModule}`);
            data && (this._$$allModule[key].state = data);
        }else{
            this._$$allModule[key] = new childData({
                data: data,
                update: that._$$update,
                top: that,
            })
        }
        return this._$$allModule[key]
    }
    existModule(key){
        return !!this._$$allModule[key]
    }
    removeModule(key){
        delete this._$$allModule[key];
        return this
    }
    getModule(key) {
        const that = this;
        if (key === undefined) return this._$$allModule;
        if (!this.existModule(key)) {
            //that._$$allModule[key] = that._$$allModule(key);
            //console.log(`key ${key} not found in ${this._$$allModule}`)
            return this.createModule(key)
        }
        return that._$$allModule[key];
    }
}
export default Data;