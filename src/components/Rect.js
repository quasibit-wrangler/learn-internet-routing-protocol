import React from "react";


const Rect = ( { _id, x, y, dims } ) => {
  return (
    <rect  x={x} y={y} rx="10" ry="10"
    width={dims} height={dims} stroke="black"
    fill="transparent" strokeWidth="5" key={_id}/>
  )
}

export default Rect;
