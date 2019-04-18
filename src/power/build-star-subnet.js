import _ from "lodash";

// #G Global variables
// #
// #
// #
var pi = Math.PI

/*return a random distance based on stuff,
anchor to anchor is like overseas, has the most distance
parent to parent is like within the same contenient, edium distance.
parent to subnet is like within the same province, lease distance.

*/
function randomDistance(type){
  var dist=0;
  switch(type){
    case "subnet":
      dist = Math.floor(Math.random()*10+1);
      break;
    case "parent":
      dist = Math.floor(Math.random()*60+20);
      break;
    case "anchor":
      dist = Math.floor(Math.random()*800+100);
      break;
    default:
    break;
  }

  return dist;
}

// ## reimplemnation of deepcopy
// # only works on arrays.
// #Desc: a recursive funciton that works with any dimensional array
function dcopy(val){
    var newarr=[];
    if(Array.isArray(val)){
        for(var i=0;i<val.length;i++){
            newarr.push(dcopy(val[i]));
        }
        return newarr;
    }
    else{
        return val;
      }
}

function randint(beg,end){
    var num = Math.random()*(end-beg)+beg;
    num= Math.floor(num);
    return num;
  }

function addVectors(a,b){
  var newarry=[]
  for(var el=0;el<a.length;el++){
    newarry[el]=a[el]+b[el];
  }
  return newarry;
}

function multiplyScalar(a,val){
  return a.map( (el) => el*val );
}


// #Subnet class
// # returns subnet based on params
// #Params:
// #   theta_i
// #   theta_f
// #   amount
// #   seperation_min
// # dsaf
class subnet{
    constructor(theta_i,theta_f,amount=5,identity=Infinity){
        this.addresses=[]
        this.theta_i=theta_i
        this.theta_f=theta_f
        this.amount=amount
        this.seprtn_max=(theta_f-theta_i)/amount //# the amount of degrees they can be seperated max
        this.cluster=[]
        for(var i=0;i<amount;i++){
          this.cluster.push({
            connections: [],
            name: ""+identity+"."+i,
            radius: 0.75,
            pos: [],
            axis: [0,0,0.25]
          })
        }

    }
    export(array){
      var info={};
      for(var r =0;r<this.cluster.length;r++){
        info.name=this.cluster[r].name;
        info.addr=this.addresses[r];
        info.dims=this.cluster[r].radius;
        info.loc={};
        info.loc.x=this.cluster[r].pos[0];
        info.loc.y=this.cluster[r].pos[1];
        info.connections=this.cluster[r].connections;
        array.push(JSON.parse(JSON.stringify(info)));
       }
    }

    setCluster(cords=[0,0,0]){
      var offset;
        for(var r =0;r<this.amount;r++){
            offset = [Math.cos(this.seprtn_max*r+this.theta_i),Math.sin(this.seprtn_max*r+this.theta_i),0];
            offset = multiplyScalar(offset,this.cluster[0].radius*10);
            this.cluster[r].pos=addVectors(cords,offset);
          }
        return
    }

    setPrefixies(prefix){
      var addr=[];
      for(var i=0;i<this.cluster.length;i++){
            // ## my bootleg way of making a deep copy each time.
            addr.push(Number(prefix[0]));
            addr.push(Number(prefix[1]));
            addr.push(Number(prefix[2]));
            addr.push(Number(prefix[3])+i+1);
            this.addresses.push(dcopy(addr));

        }
        return;
      }

}


class parentRouter{
    constructor(amount_subnet=5,pos_=[0,0,0],identity=Infinity){
        this.connections=[];
        this.pos=pos_;
        this.router={
          name: ""+identity,
          radius: 0.75,
          pos: pos_,
          axis: [0,0,0.25]
        }
        this.amount=amount_subnet;
      }

    createSubnet(t_i,t_f){
        this.net = new subnet(t_i,t_f,this.amount,this.router.name);
        this.net.setCluster(this.pos);

        for(var i=0;i<this.net.cluster.length;i++){
          this.connections.push(this.net.cluster[i].name);
          this.net.cluster[i].connections.push(this.router.name);
        }
      }

    setPrefix(prefix){
        var temp = dcopy(prefix);
        temp[2] = (Number(temp[2]+1));
        this.prefix = temp;
        this.net.setPrefixies(dcopy(this.prefix));
      }

      export(array){
        this.net.export(array);
      }

}

// # a five pointed star with on point being the anchor to another start,
// # 0 equals top, 1 equals right and so on till clockwise. the anchor does not have subnet
// # anchor also is lrger.
class star{
    constructor(anchor=0,center=[0,0,0],identity=Infinity){
        this.anch=anchor;
        this.star_points=new Array(5);
        this.center=center;
        this.star_radius = 5;
        this.name=""+identity;
        this.connections=[];
        this.router={
          connections: [],
          name: this.name
        }

        var _pos,temp;
        for(var i=0;i<5;i++){
            if(i !== this.anch){
                _pos = multiplyScalar([Math.cos(i*2*pi/5+pi/2),Math.sin(i*2*pi/5+pi/2),0],this.star_radius);
                _pos = addVectors(center,_pos);
                temp = new parentRouter(randint(2,6),_pos,this.name+"."+i)
                temp.createSubnet(i*2*pi/5+pi/2   -pi/6-pi/8, i*2*pi/5+pi/2   +pi/6+pi/8)
                this.star_points[i]=(temp);
              }
        }
        this.star_points[this.anch]=this;
        for(i=0;i<5;i++){
          if(i !== this.anch){
            this.addConnection(i,this.star_points[i]);
          }
        }
        this.setAnchor();
        this.connectAnchor();
      }
    // addes the names of 2 routers to the specified router,
    // basically the left and right router.
    //
    connectAnchor(){
      if(this.anch===0){
        this.connections.push(this.star_points[4].router.name);
      }
      else{
        this.connections.push(this.star_points[this.anch-1].router.name);
      }
      //to the right of
      if(this.anch===4){
        this.connections.push(this.star_points[0].router.name);

      }
      else{
        this.connections.push(this.star_points[this.anch+1].router.name);
      }
    }
    addConnection(index,router){
      // to the left of
      if(index===0){
        router.connections.push(this.star_points[4].router.name);
      }
      else{
        router.connections.push(this.star_points[index-1].router.name);
      }
      //to the right of
      if(index===4){
        router.connections.push(this.star_points[0].router.name);

      }
      else{
        router.connections.push(this.star_points[index+1].router.name);
      }

    }

    setAnchor(){
        var _pos=[Math.cos(pi/2 + 2*pi/5 * this.anch),Math.sin(pi/2 + 2*pi/5 * this.anch),0]
        _pos=multiplyScalar(_pos,this.star_radius)
        _pos=addVectors(_pos,this.center);
        this.anchor={
          radius: 1.25,
          pos: _pos,
          axis: [0,0,0.25]
        }
        return
      }
    //
    // #a recursive almost function
    // # based on the value that it receives and the amount dedicated to the subnet, it does that
    setAllAddresses(anchorAddress){
        this.prefix=anchorAddress.split('.') //# this will also be the address of the anchor
        for(var i =0;i<this.star_points.length;i++){
          if(i !== this.anch)
            this.star_points[i].setPrefix(anchorAddress.split('.'))
          }
        return
      }
      export(array,index){
        var info={};
        info.name=this.star_points[index].router.name;
        info.dims=this.star_points[index].router.radius;
        info.loc={};
        info.loc.x=this.star_points[index].router.pos[0];
        info.loc.y=this.star_points[index].router.pos[1];
        info.connections=this.star_points[index].connections;
        array.push(JSON.parse(JSON.stringify(info)));
      }

      exportIdentities(array){
        var info={};
        info.name=this.name;
        info.dims=this.anchor.radius;
        info.loc={};
        info.loc.x=this.anchor.pos[0];
        info.loc.y=this.anchor.pos[1];
        info.connections=this.connections;
        array.push(JSON.parse(JSON.stringify(info)));
        for(var i=0;i<this.star_points.length;i++){
          if(i !== this.anch){
            this.export(array,i);
            this.star_points[i].export(array);
          }
        }

        return array;

      }
}



function buildStars(){
  var stars = [];
  stars.push(new star(3,[-15,15,0],0));
  stars.push(new star(2,[15,15,0],1));
  stars.push(new star(0,[0,-15,0],2));

  stars[0].setAllAddresses("69.47.00.00")
  stars[1].setAllAddresses("69.48.00.00")
  stars[2].setAllAddresses("69.49.00.00")
  stars[0].connections.push(stars[1].name);
  stars[0].connections.push(stars[2].name);
  stars[1].connections.push(stars[0].name);
  stars[1].connections.push(stars[2].name);
  stars[2].connections.push(stars[1].name);
  stars[2].connections.push(stars[0].name);
  // builds the classes and throws them into the scope with the callback
  return stars;
}

function connectionType(num1,num2){
  var val = (num1>num2) ? num1 : num2;
  switch(val){
    case 1:
      return "anchor";
    case 3:
      return "parent";
    default:
      return "subnet";
  }
}

function optimizeConnections(routers){
  var connDict = {};

  _.map(routers,( { name, connections })=>{

    connections.forEach( (el, index) =>{
      if( !connDict[name+el] || !connDict[el+name]){
        connDict[(name+el).toString()] = {
          link: [name,el],
          dist: randomDistance(connectionType(name.length,el.length))
        }
      }
    });

  });

  console.log("dictionary of connections: ", connDict);

}
//convert uni-directional to bi-directional graph
// needs to look like: where: { a: { b: cost of a->b }
// var graph = {
//     a: {e:1, b:1, g:3},
//     b: {a:1, c:1},
//     c: {b:1, d:1},
//     d: {c:1, e:1},
//     e: {d:1, a:1},
//     f: {g:1, h:1},
//     g: {a:3, f:1},
//     h: {f:1}
// };
function formatForDijkstra(routers){
  var connDict = {}

  _.map(routers, ({ name, connections}) =>{
      if(connDict[name]){
        connections.forEach( (el,index) =>{
          if(!connDict[name][el]){
            connDict[name][el] = randomDistance(connectionType(name.length,el.length));
          }
        });
      }
      else{
        connDict[name]={}
        connections.forEach( (el,index) =>{
          if(!connDict[name][el]){
            connDict[name][el] = randomDistance(connectionType(name.length,el.length));
          }
        });      }
  });
  console.log("dictionary of connections: ", connDict);

}

function turnStarsIntoRouters(callback){
  var stars = buildStars();
  var routers = [];
  var connections = [];
  for(var i=0;i<stars.length;i++){
    //export the info into a programmically readable format.
    stars[i].exportIdentities(routers);
  }
// /{"address":[3,1,1],"name":"A","connections":[["B",123],["F",255]]}
  console.log("info in an array: ",routers);
  // connections = optimizeConnections(routers);
  connections = formatForDijkstra(routers);
  // now we have a bunch of duplicated connections, presiceley, double.
  // so now they have everything except connections.
  var routerDict = {};
  routers.forEach( (el, index) => {
    if(Array.isArray(el.name))
      el.name = el.name.join('.');
    routerDict[el.name]=el;
  });
  console.log("array dict", routerDict);

  callback(routerDict,routers);

}



export { turnStarsIntoRouters };
