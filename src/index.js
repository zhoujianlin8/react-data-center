/**
 * Created by zhou on 17/3/1
 *模块实现原理
 */
import React, {Component, Children, PropTypes} from 'react';
import Message from 'message-event';
import Data from './data';
import saveRender from './safe-render';
const updateKey = Symbol('__UPDATE__ALL__Provider__');
//一个页面内只能使用一次
const DATA = new Data({
    update: (cb)=> {
        const listens =  DATA._listeners[updateKey];
        let n = listens && listens.length;
        DATA.fire(updateKey, ()=> {
            if (cb) {
                n--;
                if (n <=0) {
                    cb();
                }
            }
        })
    }
});

let compoents = {};
/*
*
* <Provider init = {}></Provider>
* */
const storeTypes = {
    Data: PropTypes.object.isRequired
};
//不通过这更新影响太大
class Provider extends Component {
    static defaultProps = {
        init: {},
        error: false,
        isSafeRender: true
    };
    constructor(props, conext) {
        super(props, conext);
        let init = props.init || {};
        if(typeof props.init === 'function'){
            init = props.init(DATA) || {};
        }
        if(props.error){
            DATA.error = props.error;
        }
        if(init && init.initState){
            DATA.state = init.initState;
        }
        if(props.isSafeRender === false){
            DATA.isSafeRender = false;
        }
    }
    getChildContext() {
        return {
            Data: DATA
        }
    }
    getData(){
        return DATA;
    }
    render() {
        return <div className={this.props.className}>{this.props.children}</div>
    }
}



// <Com type="module1"/> 数据从Data模块中获取 要求假设props不动态变化
class Com extends Component {
    static defaultProps = {
        module: '',
    };
    static propsTypes = {
        module: PropTypes.string.isRequired
    };
    constructor(props, context) {
        super(props, context);
        this.moduleObj = DATA.getModule(props.module);
        this.comp = props.component || this.moduleObj.component;
        //不可动态修改
        this.options = Object.assign({isPure: true, isOnlyFn: false,isSafeRender: null},props.options || this.moduleObj.options || {});
        if(typeof this.comp === 'string'){
            this.comp = compoents[this.comp];
        }
        if(!this.comp){
            return console.error('component cannot be null',this.moduleObj,props.module)
        }
        if(this.options.isSafeRender === true || (DATA.isSafeRender !== false && this.options.isSafeRender !== false)){
            this.comp = saveRender(this.comp,props.error || this.moduleObj.error || DATA.error);
        }
        this.state = this.getState();
        this.stateHashCode = this.createHashCode(this.state);
        this._update = (cb)=> {
            if(this.didMount){
                this.shouldSetState(this.getState(), cb)
            }else{
                this.arrUpdate.push(cb);
            }
        };
        //监听
        !this.options.isOnlyFn && DATA.on(updateKey, this._update);
        this.refObj = {};
        //动态ref不考虑
        if(props.ref){
            this.refObj = {ref: (c)=>{this.child = c}}
        }
    }
    shouldSetState(state,cb){
        if(this.isChangeState(state)){
            this.setState(state,cb)
        }else{
            cb && cb();
        }
    }
    getState (){
        let state = this.props.props || this.moduleObj.props || {};
        if(typeof state === 'function'){
            state = state(DATA) || {}
        }
        //添加这2方法
        state.state = state.state || this.moduleObj.state || {};
        if(this.moduleObj && this.moduleObj.setState){
            ['fire','setState'].forEach((key)=>{
                state[key] = state[key] || this.moduleObj[key].bind(this.moduleObj)
            });
        }
        return state;
    }
    arrUpdate = [];
    render() {
        const Comp = this.comp;
        const {module,ref,compoent,options,state,props,...prop} = this.props; //去除type
        return <Comp {...this.refObj} {...this.state} {...prop}/>
    }
    //不比较nextProps 假设 nextProps 不变
    shouldComponentUpdate(nextProps,nextState){
         if(this.isShouldComponentUpdate === true){
            this.isShouldComponentUpdate = false;
            return true
        }else if(this.options.isOnlyFn){
            return false
        }else if(this.options.isPure && !this.isChangeState(nextState,true)){
            return false
        }
        return true
    }
    createHashCode(state){
        let str = JSON.stringify(state);
        let hash = 0, i, chr, len;
        if (str.length === 0) return hash;
        for (i = 0, len = str.length; i < len; i++) {
            chr   = str.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }
    isChangeState(state,no){
        //state = state;
        let b = false;
        const hashState = this.createHashCode(state);
        if(this.stateHashCode !== hashState){
            !no && (this.isShouldComponentUpdate = true);
            this.stateHashCode = hashState;
            b = true;
        }
        return b;
    }
    componentDidMount(){
        this.didMount = true;
        const empty = (arr)=>{
            arr.forEach((cb)=>{
                return cb && cb();
            })
        };
        //重新更新
        if(this.arrUpdate && this.arrUpdate.length){
            const state = this.getState();
            this.shouldSetState(state,()=>{
                empty(this.arrUpdate)
            })
        }
    }
    componentWillUnmount() {
        !this.options.isOnlyFn && DATA.off(updateKey, this._update);
    }
};


//兼容模式
const connect = function (module) {
    //option
    let defaultProps = {};
    if(typeof module === 'string'){
        defaultProps.module = module;
    }else if(typeof module === 'object'){
        defaultProps = module;
    }else if(typeof module === 'function'){
        defaultProps = module(DATA);
    }else{
        return conole.error(`module参数错误${module}`)
    }
    let comp = defaultProps.component || DATA.getModule(defaultProps.module).component;
    if(typeof  comp === 'string'){
        comp = compoents[comp];
    }
    if(!comp){
        return conole.error(`component未找到${module}`)
    }
    const displayName = (comp.name || comp.displayName || 'connect') + 'Connect';
    return class displayName extends Com {
        static defaultProps = defaultProps
    };
};

const register = (obj,com)=>{
    if(typeof obj === 'object'){
        compoents = Object.assign(compoents,obj);
    }else if(typeof obj === 'string' && typeof com === 'function'){
        compoents[obj] = com;
    }
    return compoents
};

const combine = (obj = {})=>{
    if(obj.initState){
        DATA.state = obj.initState;
        delete obj.initState;
    }
    for (const key in obj){
        let item = obj[key] || {};
        if(typeof item === 'function'){
            item = item(DATA) || {};
        }
        //提前创建数据
        Object.assign(DATA.createModule(key,item.initState),item);
    }
    return {}
};
//Com 模块模式 比connect使用更简单
export {Provider,Com,combine,DATA,Message,connect,register,saveRender};
