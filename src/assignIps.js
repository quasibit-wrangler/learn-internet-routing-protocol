import React , {Component} from 'react';
import _ from 'lodash'


function parseRouterdata(routers){
  // this funciton maps a new array of objects that will be used
  // in the longest prefix protocal
  var routerIpInfo=[];

  routers.forEach((router)=>{
    routerIpInfo.push({
      name: router.name,
      conns: router.connections,
      addr: router.address
      loc: router.loc
    });
  });

}
function returnIPAddress(decimalIP){
  
}
/* infoObj:
name: router.name,
conns: router.connections,
addr: router.address
*/
function renderAddressesAsEl(infoArray){
  return _.map(infoArray,(router)=>{
    return (
      <text key={""+JSON.stringify(router.conns)+""+router.name}
        x={100+router.loc.x} y={20+router.loc.y}>

      </text>
    );
  });
}




//funcoitnal component that returns new tag,
//higher order function that returns functions
function attachToLegend(){


}
