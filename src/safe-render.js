export default function (Com,errfn) {
        ['render',
        'componentWillMount',
        'componentDidMount',
        'componentWillReceiveProps',
        'componentWillUpdate',
        'componentDidUpdate',
        'componentWillUnmount'
        ].forEach(function (name) {
         const oFn = Com.prototype[name];
         if(oFn){
             Com.prototype[name] = function () {
                 try{
                     return oFn.apply(this,arguments)
                 }catch (e){
                    if(errfn){
                        errfn(e);
                    }else{
                        console.error(e)
                    }
                 }
             }
         }
         });
    return Com
}