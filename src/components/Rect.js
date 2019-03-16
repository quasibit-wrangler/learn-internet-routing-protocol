import React from "react";


const Rect = ( { x, y, dims,color } ) => {
  return (
    <rect  x={x} y={y} rx="10" ry="10"
    width={dims} height={dims} stroke={color}
    fill="transparent" strokeWidth="5" />
  )
}

export default Rect;
