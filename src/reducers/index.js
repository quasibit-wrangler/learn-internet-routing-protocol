import { combineReducers } from 'redux';
import {PERFORMED,SEARCH_PERFORMED} from "../actions/search";

const initialState ={
  animating: false,
};

function search(state,action) {
  if(state === undefined){
    return initialState;
  }
  else{
    switch(action.type){
      case SEARCH_PERFORMED:
        var term = action.searchTerm;
        return {
           ...state,
          term
        };
      case PERFORMED:
        return{
          ...state,
          current: action.current,
          data: action.data,
          animating: action.animating,
        }
      default:
        return state;
    }
  }
}


export default combineReducers({
  search,
});
