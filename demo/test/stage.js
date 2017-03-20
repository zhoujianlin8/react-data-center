import React, {Component} from 'react';
class Stage extends Component {
    static defaultProps = {
        state: {}, //模块数据
        setState: ()=>{}, //修改props.state
        //...props
    };
    render() {
        return (<div className="">
            {this.props.name}
            {this.props.state.age}
        </div>)
    }
    onChangeName(e){
        this.props.setState({
        })
    }
}
export default Stage;
