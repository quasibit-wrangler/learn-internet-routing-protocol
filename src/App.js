import React, { Component } from 'react';
import './App.css';
import SvgField from "./components/svgField";

import filterDickstraTable from "./power/longestPrefixFilter";
import {animateAction} from "./actions/search"
import {connect} from 'react-redux'
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      doneComputing: false,
      table: this.props.lookup,
      listening: false,
    }
    this.setDoneComp=this.setDoneComp.bind(this);
    this.numSelected=0;
    this.fromTo=[];
  }

  componentDidMount(){
    /// send in the data, and the callback
    filterDickstraTable(this.props.lookup,this.setDoneComp);
  }

  setDoneComp(data){
    this.setState({
      doneComputing: true,
      table: data,
      animating: false,
    })
  }
  animate(){
    // does the sequece of events
    this.setState({
      animating: true
    })
    }

  /*When the user clicks a router and they are in listening mode,
  it will wait for 2 clicks, which specifiy a to, from,
  after that iwill set listening to FALSE and reset the numSelected
  */
  addToAnimateList(info){
    if(this.state.listening){
      if(!this.state.animating){
        if(this.numSelected===1){
          this.fromTo.push(info);
          console.log("FROMTO: ", this.fromTo);
          this.animate();
          this.numSelected=0;

          this.setState({
            listening: false
          });
          this.props.animateAction(this.fromTo,this.fromTo[0])
        }
        else{
          this.fromTo.push(info);
          this.numSelected++;
        }
      }
    }
    else{
      return;
    }
  }

  listenForTwo(){
    this.setState({
      listening: true
    });
    console.log("time to listen");
  }

  render() {

    return (
      <div>
        {this.state.doneComputing && <SvgField addToGroup={(info)=>{this.addToAnimateList(info)} } dickstra={this.state.table} routerarr={this.props.arr} TABLE_DIMS={135} routers={this.props.field}/>}
        {!this.state.doneComputing && <h4> Loading... </h4> }
        <div className="interact-button">
        <input onClick={()=>{this.listenForTwo()} } type={"button"} name={"select-route"} />
        <label htmlFor={'select-route'}>to, from</label>
        <p>Click here to start the selection process</p>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state){
  console.log("is animting done?", !state.search.animating);
  return {
    animating: state.search.animating
  }
}

function mapDispatchToProps(dispatch){
  return {
    animateAction: (arr,curr) => {
      dispatch(animateAction(arr,curr))
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(App);
