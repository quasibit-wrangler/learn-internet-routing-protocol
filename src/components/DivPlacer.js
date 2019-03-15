import React, {Component} from "react";
import _ from "lodash";
import "../power/main.css"
// import {placeDivs} from "../power/clicker"



/* During the first half, the user clicks on the screen
Choosing where to place the routers, here we will place them on the
field as well, and when the number lines up with the
existing data, they field packs up all the locations
and sends that upstream baack to svgField*/

class DivPlacer extends Component{
  constructor(props){
    super(props);
    this.state={
      routers: []
    }
  }
  addRouter(event){
    if(!(this.state.routers.length>=this.props.limit) ){
      var location = {
        x: event.clientX,
        y: event.clientY
      }
      this.setState((prevState)=>{
        prevState.routers.push(location);
        return{
          routers: prevState.routers
        }
      });
    }
    else{
      this.props.connectRouters(this.state.routers);
    }
  }
  renderCurrentRouters(){
    return _.map(this.state.routers,(location)=>{
        return(
          <div key={""+location.x+location.y+""} className="router"
            style={{
               position:"relative",
               left: ""+location.x+"px",
               top: ""+location.y+"px"}
            }>
          </div>
        )
    });
  }
  render(){

    return (
      <section onClick={(event)=>{this.addRouter(event)}} id="miniworld">
      <p>Hello CLick anywhere to select the field.</p>
        {this.renderCurrentRouters()}
      </section>
    )
  }
}

export {DivPlacer}
