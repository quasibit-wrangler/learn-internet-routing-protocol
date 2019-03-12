import React, {Component} from "react";
import _ from "lodash";
import Rect from "./Rect";
import Line from "./Line"
import { NODE_INFO, ROUTERWIDTH, NODE_LINKS} from "../data/nodes";

class SvgField extends Component {
  constructor(props){
    super(props);
    this.state={
      LinesToggle:false
    }
  }
  renderLines(){
    return _.map(NODE_LINKS, (link) => {
      let a = NODE_INFO[link[0]]; // index the info with the linkes
      let b = NODE_INFO[link[1]];

      return (
        <Line  before={a} after={b} offset={ROUTERWIDTH/2}/>
      );
    });
  }

  renderNodes(){

     return _.map(NODE_INFO, (node) => {
        return (
          <Rect x={node.x} y={node.y} _id={node._id} dims={ROUTERWIDTH}/>
        );
      });

  }

  render(){
    return(
      <svg key="asdf" style={{width: "500px", height: "500px"}}>
        {this.renderNodes()}
        {this.renderLines()}
      </svg>
    );
  }

}


export default SvgField;
