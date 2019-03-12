String.prototype.format = function() {
  a = this;
  for (k in arguments) {
    a = a.replace("{" + k + "}", arguments[k])
  }
  return a
}

// returns the next character after c.
//inputs: 'A' -> outputs: 'B'
function nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
}


//getIP
// desc: generates a 3 portion IP address  each using a nibble. 1.5 bytes

function getIP(){
  var ips=[];

  for(var i=0;i<3;i++){
    ips.push(getANibble());
  }
  return ips;
}



// ---Random functions
//==== generate a random piect of data
  function getANibble(){
    //returns a 4 bit integer from 0-15
    return parseInt(""+Math.random()*50%16);
  }
  function getADistance(){
    // returns a integer from 800 - 1200
    return  parseInt(""+Math.random()*1000%400 + 800);
  }
//===========================================
//

/* global variables used to constantly have access to them, like in the deve tools */
var NUMBERROOMS=9;
var MIN_CONNECTS=3;
var MAX_CONNECTS=4;
// var NUMBERCONNECTS=3;

// global variable.
var rooms;



function room(name,IPaddr){
  this.address=IPaddr;// [ xx , xx, xx] 3 nibble dotted decimal
  this.name=name; // something like A or B, maybe an int
  this.connections=[]; // actually will be double array

  return this;
}

// uses global variable rooms
// this function is recursive, hopefully using
//the request function, it wont take too much ram.
function connectARoom(){
  if( ! isGraphFull(rooms)){
    addRandomConnection(rooms);
    requestAnimationFrame(connectARoom);
  }
  else{
    console.log("graph is full");
  }

}


function connectRooms(newRooms){
  var i=0;

     while( ! isGraphFull(newRooms) ){
       addRandomConnection(newRooms);
     }
     console.log("graph is full");
     return newRooms;
}

/* This function returns a room that can still make connections,
* more tricky tha nit seems becasue if we just return a random index,
* it might select a froom that is already full.
*/
function GetRandomRoom(r){
  var PartialList=[]; // mae an array the exact amount.
  var i, partialIndex=0;
  var index=0;
  // there will alwasy be 7 rooms to choose from,
  //but only numemptyrooms amount will still have connections avalible
  // so it makes an array that only has the rooms that have connections to be filled
  for(i=0;i<r.length;i++){
    if(CanAddConnectionFrom(r[i])){
      PartialList.push(r[i]); // append the pointer of the room to the temp array
      partialIndex++; //
    }
  }
  //after we make a set of rooms, we
  do{
    index=parseInt("" + (Math.random()*100)%partialIndex);
    if(partialIndex==1){
      index=0;
    }
  }while(index>=partialIndex);

  // console.log("trying out: {0}".format(PartialList[index].name));
  // only return a room if its from th list of rooms that can have connection
  return PartialList[index]; ; // one line really just returns a random room.
}

/* can add connection if they have less than 6 total connections right now.
*/
function CanAddConnectionFrom(R){

  if(R.connections.length<MAX_CONNECTS){
    return 1;
  }
  else{
    return 0;
  }
}

function IsSameRoom(r1, r2){
  if( r1.name==r2.name ){
    return 1;
  }
  else{
    return 0;
  }

} // returns a true or false
function ConnectionAlreadyExists(r1,r2){
  var  i;

  for(i=0;i<r1.connections.length;i++){
    if(r1.connections[i][0]==r2.name) {
      return 1;
    }
  }
  return 0;
}

/*In order to connect two rooms, Room A has
to show up on Room B's connections, and vice versa.
connect R1 to R2
PRE-COND: Num_connections < 6;
this function is called after
!ConnectAlreadyExists, !isSameRoom, CanAddConnection
*/

function ConnectRoom(r1,r2,len){
  r2.connections.push([r1.name,len]);
 return;
} // adds a connection in both of the rooms to each other

function addRandomConnection(roomList){
  var A,B;
  while(1)
  {
    A = GetRandomRoom(roomList); // gets a room that can be added to.
    // console.log("A"+A);
    if (CanAddConnectionFrom(A) == 1)
      break;
  }

  do
  {
   B = GetRandomRoom(roomList); // gets another room that can be added to
  //  console.log("B"+B);
  }
  while(CanAddConnectionFrom(B) == 0 || IsSameRoom(A, B) || ConnectionAlreadyExists(A, B) );

  var len=getADistance();

  // console.log("Connecting {0} to {1}".format(A.name,B.name));
  ConnectRoom(A, B,len);  //DO: Add this connection to the real variables,
  ConnectRoom(B, A,len);  //  because this A and B will be destroyed when this function terminates

}


//isGraphFull
//desc: in order to be a full room, it must have
// 3 outbound connections, if it is not full,
// than the graph will return not full.
// LENGTH will not be changed in the skope of this programs life it is 7
function isGraphFull(unAttachedRooms){
 var i;
 var numFull=unAttachedRooms.length;
  for(i=unAttachedRooms.length-1;i>=0;i--){
    if(unAttachedRooms[i].connections.length<MIN_CONNECTS){// to
      numFull-=1;
      return 0;
    }
  }
  if(numFull==unAttachedRooms.length)
    return 1;
  else {
    return 0; // if one room is not full, then graph is not null
  }
}

/* allocates memobry for rooms and gives them names
*/
function initRooms(numrooms){
  var room_index;
  var newRooms= new Array(numrooms);
  var name='A';

  for(room_index=0;room_index<numrooms;room_index++){
      newRooms[room_index]=new room(name,getIP());
      name=nextChar(name);
  }
  return newRooms;
}



function buildRooms(){
  rooms=initRooms(NUMBERROOMS);
  console.log(rooms);
  // rooms=connectRooms(rooms);
  connectARoom();

}

window.addEventListener('load', function(){
  buildRooms();


});
