import React, {Component} from "react";
import _ from "lodash";
import Rect from "./Rect";
import Line from "./Line"
import LookupTable from "./LookupTable";
import {connect} from 'react-redux';
import {ROUTERWIDTH} from "../data/nodes";
import {animateAction,doneAnimating} from "../actions/search"
import {PERFORMED} from "../actions/search"
// import { NODE_INFO, ROUTERWIDTH, NODE_LINKS} from "../data/nodes";



/* This local component in the /src/componenets folder
Will use the csv file (live object data actually .js)

*/
class SvgField extends Component {
  constructor(props){
    super(props);
    // combine the two dictionarys in the props
    this.connectionInfo = this.props.routers;
      this.state={
      LinesToggle:false,
      tableShown: {},
      holder: {},
    }
  }
  componentDidMount(){
    let locale = this.state.tableShown;
    this.props.routerarr.forEach( (el,index)=>{
      locale[el.name]=0;
    });
    this.setState({
      tableShown:locale
    })
    console.log(this.state.tableShown);
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
  showTable(info){
    let localTable = this.state.tableShown;
    localTable[info.name]=!this.state.tableShown[info.name];
    this.setState({
      tableShown: localTable
    })
    this.props.addToGroup(info);
  }

  renderNodes(){
    //will be difficults. need color and locations and names
    var stats = document.body.getBoundingClientRect();
    const scale=15;
   return _.map(this.props.routerarr, (router)=>{
       var classes="";
       var color =  this.state.tableShown[router.name] ? '#ffbf00' : "#242424";

       switch(router.name.length){
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
         <g key={router.name+"gorup"}>
           <Rect click={ ()=> this.showTable(router)} routerType={classes} key={router.name}
             x={router.loc.x*scale+stats.width/2}
             y={router.loc.y*scale+500} color={color} />
          </g>
         );
     });
  }
  renderTables(){
      return _.map(this.props.routerarr, (router)=>{
        if(this.state.tableShown[router.name])
          return (
              <LookupTable loc={router.loc} name={router.name+" Next Hop Table"} key={router.name+"Next Hop Table"}
              table={this.props.dickstra[router.name]} isSelected />
          );
        else {
          return;
        }
        });
  }

  /* animate one step:
  brings up the routing table one at atime and does some stuff.
  */
  animateOneStep(){
    let localTable = this.state.tableShown;
    console.log(this.props.message[0].name,this.props.holder.name);
    if(this.props.message[0].name===this.state.holder.name){
      console.log("first iteration");
      this.resetField();
    }
    this.setState({
      holder:{},
    })
    this.setState({
      tableShown: localTable
    })
  }

  resetField(){
    var el = this.state.tableShown;
    _.mapKeys( el, (key,value)=>{
      el[key]=0;
    })
    this.setState({
      tableShown: el,
    })
  }

  componentDidUpdate(prevProps){
    console.log("did we update?");
    if(this.props.message){
      this.setState({
        holder: this.props.holder
      })
      this.animateOneStep();
    }
  }
  render(){
    return(
      <article style={{width:"100%"}}>
      <p> Not to Scale </p>
        <svg key="asdf" id="svgworld" >
          {this.renderLines()}
          {this.renderNodes()}
        </svg>
        <div>
        {this.renderTables()}
        </div>
      </article>
    );
  }

}

function mapDispatchToProps(dispatch){
  return {
    animateAction: (arr,curr) => {
      dispatch(animateAction(arr,curr));
    },
    doneAnimating: ()=>{
      dispatch(doneAnimating());
    }
  }
}

function mapStateToProps(state){


  if(state.search.animating){
    console.log("ANIMATING");
  }

  return {
    message: state.search.data,
    holder: state.search.current,
    ...state.search
  }

}


export default connect(mapStateToProps,mapDispatchToProps)(SvgField);
