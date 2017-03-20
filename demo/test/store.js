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
