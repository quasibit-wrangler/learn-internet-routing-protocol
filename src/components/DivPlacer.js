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
  }
  renderCurrentRouters(){
    var stats = document.body.getBoundingClientRect();
    var scale=15;
    var widthOffset=0;
    console.log("Rendering these: ", this.props.routers);
    return _.map(this.props.routers,(el)=>{
        var classes="router";

        switch(el.name.length){
          case 1:
          classes+=" anchor";
          widthOffset=25;
            break;
          case 3:
          classes+=" parent";
          widthOffset=15;

            break;
          case 5:
            classes+=" subnet";
            widthOffset=7;
            break;
        }

        return(
          <div key={el.name} id={el.name} className={classes}
            style={{
               position:"absolute",
               left: ""+(el.loc.x*scale+stats.width/2-widthOffset)+"px",
               top: ""+(el.loc.y*scale+500-widthOffset)+"px"}
            }>
          </div>
        )
    });
  }
  render(){

    this.props.connectRouters(this.props.routers);

    return (
      <section id="miniworld">
        {this.renderCurrentRouters()}
      </section>
    )
  }
}

export {DivPlacer}
