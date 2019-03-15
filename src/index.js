import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import {buildRooms} from "./power/build-links"

var Rooms;

// function renderPlacementField(){
//
// }

function renderSvgField(rooms){
  Rooms = rooms;
  ReactDOM.render(<App field={Rooms}/>, document.getElementById('root'));
}


//Here we set the app to assign the data to a local variable
//which is rendered in the <App />
buildRooms(renderSvgField);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
