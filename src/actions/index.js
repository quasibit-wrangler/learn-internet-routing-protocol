import axios from 'axios';

//now we have different user types that we will fetch,
//
import { SEND_PACKET, FETCH_USER, LOGOUT, FETCH_SURVEYS } from './types';

export const sendPacket = () => dispatch => {


  dispatch({ type: SEND_PACKET, payload: "asdf" })
}



export const submitSurvey = (formValues, history)  => async dispatch => {
  const res = await axios.post("/api/surveys",formValues);
  // dispatch({ type: SURVEY_SENT, payload: res.data})
  history.push('/surveys'); // redirect user ack to dashboard
  dispatch({ type: FETCH_USER, payload: res.data });
  return { type: 'submit_survey' }
}
