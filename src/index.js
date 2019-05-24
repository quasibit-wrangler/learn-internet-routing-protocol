import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {turnStarsIntoRouters} from "./power/build-star-subnet";
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import reducer from "./reducers"
import {createLogger} from 'redux-logger'
// function renderPlacementField(){
//
// }

var Rooms;
const store = createStore(
  reducer,
  applyMiddleware(createLogger()),
)

function renderSvgField(rooms,array,conns){
  Rooms = rooms;
  ReactDOM.render(
    <Provider store={store}>
      <App lookup={conns} arr={array} field={Rooms}/>
    </Provider>, document.getElementById('root'));
}


//Here we set the app to assign the data to a local variable
//which is rendered in the <App />
// buildRooms(renderSvgField);
turnStarsIntoRouters(renderSvgField);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
