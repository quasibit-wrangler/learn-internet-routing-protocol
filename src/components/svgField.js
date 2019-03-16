import React, {Component} from "react";
import _ from "lodash";
import Rect from "./Rect";
import Line from "./Line"
// import { NODE_INFO, ROUTERWIDTH, NODE_LINKS} from "../data/nodes";
import {ROUTERWIDTH} from "../data/nodes";

// returns the next character after c.
//inputs: 'A' -> outputs: 'B'
function nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
}

/* This local component in the /src/componenets folder
Will use the csv file (live object data actually .js)

*/
class SvgField extends Component {
  constructor(props){
    super(props);

    // combine the two dictionarys in the props
    this.connectionInfo = {};
    //combine the elements in both that we need to connec divs with lines
    // in an boject representing eac hkey
    for(var i=0;i<this.props.routers.length;i++){
      this.connectionInfo[""+this.props.routers[i].name] = Object.assign(
        {},this.props.routers[i],this.props.locations[i],{
          color:"#" + Math.random().toString(16).slice(2, 8)
        });
    }

    this.state={
      LinesToggle:false
    }
  }
  //connect sthe rects with lines
  renderLines(){
    var lines=[];
    _.mapKeys(this.connectionInfo,(value,key)=>{
      // for each item in the dictary, iteratve over the array "connections"
      _.map(value.connections,(conn)=>{
        var routerDict=this.connectionInfo;
        var connObj=routerDict[conn[0]];
        lines.push(
            <Line key={""+value.x+connObj.x+value.y+connObj.y} before={[value.x,value.y]}
             after={[connObj.x,connObj.y]}
             offset={ROUTERWIDTH/2} />
        );
      });
  });

    return lines;
  }
  // creates legends with connections indicatingthe routing tables
  renderRouterLegends(){
    // now we just need the connections, color, and name
    var legends = []
    _.mapValues(this.connectionInfo, (o)=>{
      legends.push(
        {
          color:o.color,
          name: o.name,
          conns:o.connections
        }
      );
    });
    var loc={
      x:30,
      y: 15
    }
    var count=0;
    return(
      <g>
        {  _.map(legends,
          (item)=>{
            console.log("current y: ",loc.y);
            let table =(
              <g>
                <Rect dims={this.props.TABLE_DIMS} y={loc.y} x={loc.x} color={item.color}/>
                <text x={loc.x+15} y={loc.y+15}
                  fontFamily="sans-serif" fontSize="12px" fill="grey">{item.name}</text>
                <text x={loc.x+15} y={loc.y+30}
                    fontFamily="sans-serif" fontSize="9px" fill="grey">Connections:</text>
                {this.renderConnTexts(item,loc)}
                </g>
            );
            loc.x+=this.props.TABLE_DIMS+15;
            if(count>6){
              count=0;
              loc.x=30;
              loc.y+=this.props.TABLE_DIMS+20
              console.log("next row:");
            }
            else{
              count++;
            }
            return table;
        })
      }
      </g>
    )
  }
  renderConnTexts(router,location){
    var texts=[];
    var y = location.y;
    router.conns.forEach((item,index)=>{
      texts.push(
        (<text x={location.x+25} y={y+40}
          fontFamily="sans-serif" fontSize="8px" fill="grey">
        {JSON.stringify(item)}
        </text>
      ));
      y+=15;
    })
    return texts;
  }
  // map the connectoins

  renderLabels(){

    var routerDict=this.connectionInfo;
    var labels = [];
    _.mapKeys(this.connectionInfo,(value,key)=>{
      return _.map(value.connections,(conn)=>{
        var connObj=routerDict[conn[0]];
        labels.push(
          <text
          key={""+value.x+connObj.x+value.y+connObj.y+"asdf"}
          x={value.x+(connObj.x-value.x)/2} y={value.y+(connObj.y-value.y)/2-15}
          fontFamily="sans-serif" fontSize="8px" fill="grey">
          {conn[1]}
          </text>);
      });
    });
    return labels;
  }

  renderNodes(){
    //will be difficults. need color and locations and names
    var c="A";
    var rectInfo = this.connectionInfo;
    var nodes=this.props.locations;
    for(var r = 0;r<nodes.length;r++){
      rectInfo[c].loc=nodes[r];
      nodes[r]=rectInfo[""+c]
      c=nextChar(c);
    }
    this.connectionInfo=rectInfo;
     return _.map(nodes, ({loc,color})=>{
       return (
           <Rect  x={loc.x} y={loc.y} color={color} dims={ROUTERWIDTH}/>
         );
     });
  }

  render(){
    return(
      <article style={{width:"100%"}}>
      <p> done adding divs, now look at that </p>
      <p> Not to Scale </p>
        <svg id="svgLegend">
          {this.renderRouterLegends() }
        </svg>
        <svg key="asdf" id="svgworld" >
          {this.renderLines()}
          {this.renderNodes()}
          {this.renderLabels()}
        </svg>
      </article>
    );
  }

}


export default SvgField;
