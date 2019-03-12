

var nodes=[];
var thenode;
var dict={};

function paste(event) {
  // if(nodes.length==rooms.length){
  if(nodes.length==2){
    alert("too many dots");
    console.log(dict);
    thenode.removeEventListener('click', paste);
    connectNodes();
    return;
  }

  var coords={
    "x":event.clientX,
    "y":event.clientY
  }
  var el =document.createElement("div");
  el.style.position="absolute";
  el.classList.add("router");
  el.style.left=""+coords.x+"px";
  el.style.top=""+coords.y+"px";

 thenode.appendChild(el);
 nodes.push(el);

 addFromList(el);
  return;

}


function connectNodes(){
  var numLines=0;
  var linz=document.querySelectorAll(".line");

// for every router, we a line for each CanAddConnection
  for(var router=0;router<rooms.length;router++){
    for(conn=0;conn<rooms[router].connections.length;conn++){
      console.log("Connect {0} to {1}".format(rooms[router].name,rooms[router].connections[conn][0]));
      lineMaker(dict[rooms[router].name],dict[rooms[router].connections[conn][0]],linz[numLines]);
      numLines++;


    }
  }

}


function lineMaker(div1,div2,line) {

  console.log("line: ",line);

var x1 = div1.offsetLeft;// + (div1.width()/2);
var y1 = div1.offsetTop;// + (div1.height()/2);
var x2 = div2.offsetLeft;// + (div2.width()/2);
var y2 = div2.offsetTop;// + (div2.height()/2);

line.setAttribute('x1',x1);
line.setAttribute('x2',x2);
line.setAttribute('y1',y1);
line.setAttribute('y2',y2);
}

function addFromList(router) {
  var copy= rooms[nodes.length-1];
  router.textContent=copy.name;

  dict[copy.name]=router;

}







function ClickReady(event) {
 thenode=document.querySelector("#miniworld");
 thenode.addEventListener('click', paste);

 //add the x number of <line>'s'
 var svg=document.querySelector("#svg");
 for(var i=0;i<rooms.length;i++){

    for(var j=0;j<rooms[i].connections.length;j++){
     var el=document.createElement("line");
     el.classList.add("line");
     svg.appendChild(el);
   }

 }
//////////////////

}
window.addEventListener("load",ClickReady);
