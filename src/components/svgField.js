import React, {Component} from "react";
import _ from "lodash";
import Rect from "./Rect";
import Line from "./Line"
// import { NODE_INFO, ROUTERWIDTH, NODE_LINKS} from "../data/nodes";
import {ROUTERWIDTH} from "../data/nodes";
/* This local component in the /src/componenets folder
Will use the csv file (live object data actually .js)

*/
class SvgField extends Component {
  constructor(props){
    super(props);
    this.state={
      LinesToggle:false
    }
  }
  renderLines(){
    this.connectionInfo = {};


    //combine the elements in both that we need to connec divs with lines
    // in an boject representing eac hkey
    for(var i=0;i<this.props.routers.length;i++){
      this.connectionInfo[""+this.props.routers[i].name] = Object.assign({},this.props.routers[i],this.props.locations[i]);
    }
    var lines = []
    console.log("ultimate dict:",this.connectionInfo);
    _.mapKeys(this.connectionInfo,(value,key)=>{
      console.log("connections total:",value.connections);
      // for each item in the dictary, iteratve over the array "connections"
      _.map(value.connections,(conn)=>{
        var selfName=value.name;
        var routerDict=this.connectionInfo;
        var connObj=routerDict[conn[0]];
        lines.push(
            <Line key={""+value.x+connObj.x+value.y+connObj.y} before={[value.x,value.y]}
             after={[connObj.x,connObj.y]}
             offset={ROUTERWIDTH/2} />
        )
        // for each of its connections value has,we create a line to that node.
        //
        return (lines.length);
      });
    });
    console.log("the lines.: ", lines);
    return lines;

    // return _.map(NODE_LINKS, (link) => {
    //   let a = NODE_INFO[link[0]]; // index the info with the linkes
    //   let b = NODE_INFO[link[1]];
    //
    //   return (
    //     <Line  before={a} after={b} offset={ROUTERWIDTH/2}/>
    //   );
    // });
  }

  renderNodes(){
     return _.map(this.props.locations, (coords)=>{
       return (
           <Rect key={""+coords.x+coords.y+"xp"} x={coords.x} y={coords.y} dims={ROUTERWIDTH}/>
         );
     });
  }

  render(){
    return(
      <svg key="asdf" id="svgworld" style={{width: "100%", height: "500px"}}>
        <p> done adding divs, now look at that </p>
        {this.renderNodes()}
        {this.renderLines()}
      </svg>
    );
  }

}


export default SvgField;
