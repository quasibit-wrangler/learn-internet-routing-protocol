import React, {Component} from "react";
import _ from "lodash";


function tabledata(props){
  var els = [];
  // _.mapKeys(props.routTable, (item,key)=>{
  //   els.push([key.toString(),item]);
  // })
  // return _.map(els,(item)=>{
  //   return (
  //       <tr key={""+item[0]+item[1]}>
  //       <td>{item[0]}</td>
  //       <td>{item[1]}</td>
  //       </tr>
  //     );
  // })
  _.mapKeys(props, (item,key)=>{
    els.push((
        <tr key={""+key+item}>
        <td>{key}</td>
        <td>{item}</td>
        </tr>
      ))
  });
  return els;
}

class LookupTable extends Component {

  constructor(props){
    super(props);
    this.state={active: null};
  }

  render(){
    const scale=15;
    var {width} = document.body.getBoundingClientRect();
    const bubble=20;
    return(
      <table className={"lookup"}
        style={{ top: `${this.props.loc.y*scale+500+bubble}px`,  left: `${this.props.loc.x*scale+width/2+bubble*1.25}px`,
         height:(20+15*5)+`px`}}>
        <thead>
          <tr>
            <th colSpan={"2"}>{this.props.name}</th>
          </tr>
          <tr>
            <th>Prefix</th>
            <th>Next Hop</th>
          </tr>
        </thead>
        <tbody>
        {tabledata(this.props.table)}
        </tbody>
      </table>
    )



  }
}


export default LookupTable;
