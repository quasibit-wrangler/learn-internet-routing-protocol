import React, { Component } from 'react';
import './App.css';
import SvgField from "./components/svgField";
import {DivPlacer} from "./components/DivPlacer";

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      isDeciding:true
    }
  }
  renderRoutersConnected(){
    this.routers=this.props.field

    return (
      <SvgField TABLE_DIMS={135} routers={this.routers} locations={this.state.locations}/>
    );
  }

  renderChooseField(){
    return (
      <DivPlacer connectRouters={(locations)=>this.setRoutersToConnect(locations)} limit={this.props.field.length} />
    )
  }

  setRoutersToConnect(locs){
    this.setState((prevState)=>{
      return {
        locations: locs,
        isDeciding:!prevState.isDeciding
      };
    })
  }
  render() {
    return (
      <div className="App">
        {this.state.isDeciding && this.renderChooseField()}
        {!this.state.isDeciding && this.renderRoutersConnected()}

      </div>
    );
  }
}

export default App;
