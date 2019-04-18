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

    // combine the two dictionarys in the props
    this.connectionInfo = this.props.routers;


    this.state={
      LinesToggle:false
    }
  }
  //connect sthe rects with lines
  renderLines(){
    var lines=[];
    var stats = document.body.getBoundingClientRect();
    var scale=15;
    var widthOffset=0;
    _.mapKeys(this.connectionInfo,(value,key)=>{
      // for each item in the dictary, iteratve over the array "connections"
      _.map(value.connections,(conn)=>{
        var connObj=this.connectionInfo[conn];
        lines.push(
            <Line key={""+value.name+conn}
              before={[value.loc.x*scale+stats.width/2,value.loc.y*scale+500]}
              after={[connObj.loc.x*scale+stats.width/2,connObj.loc.y*scale+500-widthOffset]}
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
            if(item.name.length<4){
              let table =(
                <g
                key={""+loc.x+loc.y+Date.now()} >
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
            }
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
        (<text key={JSON.stringify(item)} x={location.x+25} y={y+40}
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
    console.log(this.connectionInfo);
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
    var stats = document.body.getBoundingClientRect();
    var scale=15;
   return _.map(this.props.routerarr, ({name,loc})=>{
       var classes="";

       switch(name.length){
         case 1:
         classes+="anchor";
           break;
         case 3:
         classes+="parent";

           break;
         case 5:
           classes+="subnet";
           break;
          default:
          break;
       }
       return (
           <Rect routerType={classes} key={name}
           x={loc.x*scale+stats.width/2}
           y={loc.y*scale+500} color={"#242424"} />
         );
     });
  }

  render(){
    // {this.renderLabels()}
    return(
      <article style={{width:"100%"}}>
      <p> done adding divs, now look at that </p>
      <p> Not to Scale </p>
        <svg key="asdf2" id="svgLegend">
          {this.renderRouterLegends() }
        </svg>
        <svg key="asdf" id="svgworld" >
          {this.renderLines()}
          {this.renderNodes()}
        </svg>
      </article>
    );
  }

}


export default SvgField;
