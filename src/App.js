import React, { Component } from 'react';
import './App.css';
import SvgField from "./components/svgField";

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      isDeciding:true
    }
  }
  render() {
    return (
      <SvgField routerarr={this.props.arr} TABLE_DIMS={135} routers={this.props.field}/>
    );
  }
}

export default App;
