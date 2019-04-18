import React from "react";
import "../power/main.css"

function dims(type){
  switch(type){
    case "anchor":
      return 50;
    case "parent":
     return 30;
    case "subnet":
      return 15;
    default:
     return 20;
  }
}

const Rect = ( { routerType, x, y, color } ) => {
  return (
    <rect x={x} y={y} rx="10" ry="10"
    width={dims(routerType)} height={dims(routerType)} stroke={color}
    fill="transparent" strokeWidth="5" />
  )
}

export default Rect;
