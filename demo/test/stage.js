import React, {Component} from 'react';
class Stage extends Component {
    static defaultProps = {
        state: {},
        setState: ()=>{},
        //...props
    };
    componentDidMount(){
        throw  new Error('x ')
    }
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
