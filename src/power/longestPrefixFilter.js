import _ from "lodash"



///////////////////////////////////

function flipOpposite(opposite){
  var flip = {};
  console.log("opposite[1.4]: ", opposite['1.4']);
  _.mapKeys(opposite, (value,key) => {
    flip[key] = reverseOneLookUpTable(key,value);
  })
  return flip;
}

function combinePrefixWithKey(prefixs, parentKey)
{
  var reverse= {};
  _.mapKeys(prefixs, (value,key)=>{
    reverse[key] = parentKey;
  })
  return reverse;
}

function reverseOneLookUpTable(startPoint, table){
  var newTable = {};
  var prefixs={};
  var wildCard={};//there will alwasy be on
  _.mapKeys(table, (value, key)=>{
    // undefined means the route to itself
    if(key!=='undefined' ){
      // very hardcoded way to filter out the junk arrays
      if(value.length>1 && value.length<20){
        prefixs = optimizeOnesStrings(value,key);
        // console.log("prefixes for: ", startPoint,prefixs);
        // console.log("reduced table for ",startPoint,newTable);
        newTable = combinePrefixWithKey(prefixs,key)
      }
      if(value.length>20){
        wildCard["*"]=key;
      }
    }
    // console.log(`${key} is the next hop from ${startPoint} to all these:`,newTable[key] );
  })

  Object.assign(newTable,wildCard);
  return newTable;

}

function optimizeOnesStrings(stringArr,nextHop){
  var prefixs = {
  };
  _.map(stringArr, (str)=>{
    switch(str.length){
      case 1:
      prefixs[str+"*"] = nextHop;
      //getSubstrings(stringArr,str);
        break;
      case 3:
        prefixs[str+"*"] = nextHop;
        //getSubstrings(stringArr,str);
        break;
      default:
        break;
    }
  });
  return prefixs;
}


function filterOneLookUpTable(one){
  var el = {};
  _.mapKeys(one, (value,key)=>{
    if(el[String(value[0])]){
      el[value[0]].push(key);
    }
    else{
      el[String(value[0])] = [];
      el[value[0]].push(key);
    }
  });
  return el;
}



async function FilterAll(lotsofdata){
  var opposite = {}
  // console.log("one 1: " , lotsofdata['1'].routTable);
  _.mapKeys(lotsofdata, (value,key)=>{
    opposite[key] = filterOneLookUpTable(value.routTable);
  })
  return flipOpposite(opposite);
}



async function filterDickstraTable(data, callback){
    var newTables = await FilterAll(data);
    setTimeout(function(){ callback(newTables) }, 1000); // make em think the computer
    //is thinking
}


export default filterDickstraTable
