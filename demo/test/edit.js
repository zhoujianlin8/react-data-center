import React, {Component} from 'react';
class Edit extends Component {
    static defaultProps = {
        state: {}, //模块数据
        setState: ()=>{}, //修改props.state
        //...props
    };
    render() {
        return (<div className="">
            {this.props.age}
            <input type="text" value={this.props.state.name} onChange={this.onChangeName.bind(this)}/>
            <div onClick = {this.onClick.bind(this)}>btn</div>
        </div>)
    }
    onClick(){
        console.log(22)
    }
    onChangeName(e){
        this.props.setState({
            name: e.target.value
        })
    }
}
export default Edit;
