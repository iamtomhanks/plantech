import React from 'react'
import Home from './Home'
import { Switch, Route } from 'react-router-dom'
import '../css/Home.css'

export class MainApp extends React.Component {

  render() {
    return (
      <div>
          <Switch>
            <Route exact path='/' component={Home}/>
          </Switch>
      </div>
    );
  }
}

export default MainApp;
