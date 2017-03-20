/**
 * Created by zhou on 17/3/1
 *模块实现原理
 */
import React, {Component, Children, PropTypes} from 'react';
import Message from 'message-event';
import Data from './data';
const updateKey = Symbol('__UPDATE__ALL__Provider__');
/*
*
* <Provider init = {}></Provider>
* */
const storeTypes = {
    Data: PropTypes.object.isRequired
};

class Provider extends Component {
    static childContextTypes = storeTypes;
    static defaultProps = {
        init: {},
        className: ''
    };
    constructor(props, conext) {
        super(props, conext);
        let init = {};
        let isFn = true;
        if(typeof props.init !== 'function'){
            init = props.init;
            isFn = false;
        }
        this.Data = new this.DataClass({
            data: init.initState,
            update: (cb)=> {
                const listens =  this.Data._listeners[updateKey];
                let n = listens && listens.length;
                this.Data.fire(updateKey, ()=> {
                    if (cb) {
                        n--;
                        if (n <=0) {
                            cb();
                        }
                    }
                })
            }
        });
        if(isFn){
            const obj = props.init(this.Data);
            if(obj && !this.Data._hasInitState){
                this.Data.initState(obj.initState);
            }
        }
    }
    //外部可重置
    get DataClass(){
        return this.props.DataClass || Data;
    }

    getChildContext() {
        return {
            Data: this.Data
        }
    }
    getData(){
        return this.Data;
    }
    render() {
        return <div className={this.props.className}>{this.props.children}</div>
    }
}

/*const connect = function (fn = ()=> {
},option = {}) {
    //option
    return function (Com) {
        //todo return hoistStatics(displayName, Com) 支持热替换 目前忽略
        const displayName = (Com.name || Com.displayName || 'connect') + 'Connect';
        return class displayName extends Component {
            static contextTypes = storeTypes;
            constructor(props, context) {
                super(props, context);
                this.Data = props.Data || context.Data || {};
                this.state = this.getState();
                this._update = (cb)=> {
                    if(this.didMount){
                        this.setState(this.getState(), cb)
                    }else{
                        this.arrUpdate.push(cb);
                    }
                };
                //监听
                this.Data.on(updateKey, this._update);
                this.refObj = {};
                //动态ref不考虑
                if(props.ref){
                    this.refObj = {ref: (c)=>{this.child = c}}
                }
            }
            getState (){
                let state = fn;
                if(typeof fn === 'string'){
                    state = this.Data.getModule(fn).props;
                }
                if(typeof state === 'function'){
                    state = state(this.Data)
                }
                return state || {};
            }
            arrUpdate = [];
            render() {
                return <Com {...this.refObj} {...this.state} {...this.props}/>
            }
            componentDidMount(){
                this.didMount = true;
                //重新更新
                if(this.arrUpdate && this.arrUpdate.length){
                    this.setState(this.getState(),()=>{
                        this.arrUpdate.forEach((cb)=>{
                            return cb && cb();
                        })
                    })
                }
            }
            componentWillUnmount() {
                this.Data.off(updateKey, this._update);
            }
            //后续在这可以优化 是否需要更新 使用react默认处理
            //shouldComponentUpdate
        };
    }
};*/


// <Com type="module1"/>  数据从Data模块中获取
class Com extends Component {
    static contextTypes = storeTypes;
    static defaultProps = {
        type: '',
    };
    static propsTypes = {
        type: PropTypes.string.isRequired
    };
    constructor(props, context) {
        super(props, context);
        this.Data = props.Data || context.Data || {};
        this.typeObj = this.Data.getModule(props.type);
        if(!this.typeObj.component){
            return console.error('component cannot be null',this.typeObj,props.type)
        }
        this.state = this.getState();
        this._update = (cb)=> {
            if(this.didMount){
                this.setState(this.getState(), cb)
            }else{
                this.arrUpdate.push(cb);
            }
        };
        //监听
        this.Data.on(updateKey, this._update);
        this.refObj = {};
        //动态ref不考虑
        if(props.ref){
            this.refObj = {ref: (c)=>{this.child = c}}
        }
    }
    getState (){
        let state = this.typeObj.props;
        if(typeof state === 'function'){
            state = state(this.Data)
        }
        return state || {};
    }
    arrUpdate = [];
    render() {
        const Comp = this.typeObj.component;
        const {type,ref,...props} = this.props; //去除type
        return <Comp {...this.refObj} {...this.state} {...props}/>
    }
    componentDidMount(){
        this.didMount = true;
        //重新更新
        if(this.arrUpdate && this.arrUpdate.length){
            this.setState(this.getState(),()=>{
                this.arrUpdate.forEach((cb)=>{
                    return cb && cb();
                })
            })
        }
    }
    componentWillUnmount() {
        this.Data.off(updateKey, this._update);
    }
};


const combine = (obj = {})=>{
    return function (Data) {
        for (const key in obj){
            let item = obj[key];
            if(typeof item === 'function'){
               item = item(Data);
            }
            if(item){
                const newData = item.initState ? Data.initState(key,item.initState): Data.getModule(key);
                item.component && (newData.component =  item.component);
                item.props && (newData.props = item.props) ;
            }
        }

    }
};


//Com 模块模式 比connect使用更简单
export {Provider,Com,combine,Message};
