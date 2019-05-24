export const SEARCH_PERFORMED= "SEARCHING";
export const SEARCH_SUCCESS = "SEARCH_SUCC";
export const SEARCH_ERROR = " SEARCH_ERR";
export const PERFORMED = "MAKING REQUEST"
export const searchError= (error) => ({type: SEARCH_ERROR, error});


export const animateAction = (toFrom,curr) =>{

  return{
    type: PERFORMED,
    current: curr,
    data: toFrom,
    animating: true,
  }
}

export const doneAnimating = () => {
  return {
    type: SEARCH_SUCCESS,
    animating: false,
  }
}
export const performSearch = (searchTerm) => async dispatch => {


  const res = {}

    if(res.data){
      dispatch({
        type: SEARCH_SUCCESS,
        payload:  res.data
      });
    }
    else{
      dispatch({
        type: SEARCH_ERROR,
        payload: "something went wrong"
      })
    }

}
