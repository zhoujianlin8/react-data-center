
## react-data-center 模块
```
npm install react-data-center --save
```
* react 数据中心模块解决数据统一各模块通信问题

## 使用
* 主入口

````

import {Provider,Com} from '../src/index';
import initState from './test/store';
ReactDOM.render(<Provider init={initState}>
                <Com type="stage"/>
                <Com type="edit"/>
            </Provider>, document.getElementById('container'));

````

* test/store文件

````
import {combine} from '../../src/index';
import Edit from './edit';
import Stage from './stage';
//支持的模式
const obj = {
    edit: {
        initState: {
          name: 'zhou'
        },
        props: (Data)=>{
            var edit = Data.getModule('edit');
            return {
                setState: edit.setState.bind(edit),
                state: edit.state,
                age: Data.getModule('stage').state.age
            }
        },
        component: Edit

    }, 
    stage:(Data)=>{
        var stage = Data.initState('stage',{
            age: '11'
        });
        stage.props = (Data)=>{
            return{state: stage.state,
            name: Data.getModule('edit').state.name,
            setState: stage.setState.bind(stage)}
        }; 
        stage.component = Stage;
    }
};
export default combine(obj)

````


＊ 详细使用请看demo



