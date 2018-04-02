import {combine} from '../../src/index';
import Edit from './edit';
import Stage from './stage';
//支持的模式
const obj = {
    initState: {
        yes: 'asasa'
    },
    edit: {
        initState: {
          name: 'zhou'
        },
        option: {},
        component: Edit
    },
    stage:(Data)=>{
        const stage = Data.createModule('stage',{
            age: '11'
        });
        stage.props = (Data)=>{
            return{
                state: stage.state,
            name: Data.getModule('edit').state.name,
            setState: stage.setState.bind(stage)}
        };
        stage.component = Stage;

    }
};
export default combine(obj)
