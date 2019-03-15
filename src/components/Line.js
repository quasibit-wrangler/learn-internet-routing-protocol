import React from 'react'


const Line = ({before,after,offset}) => {


  return(
    <line
    key={before._id+after._id}
    x1={before[0]+offset} y1={before[1]+offset} x2={after[0]+offset} y2={after[1]+offset}
    style={{ stroke:"rgb(255,0,0)",strokeWidth:2}} />
  );
}


export default Line;
