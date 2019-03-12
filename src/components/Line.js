import React from 'react'


const Line = ({before,after,offset}) => {
  return(
    <line
    key={before._id+after._id}
    x1={before.x+offset} y1={before.y+offset} x2={after.x+offset} y2={after.y+offset}
    style={{ stroke:"rgb(255,0,0)",strokeWidth:2}} />
  );
}


export default Line;
