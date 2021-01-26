import './static/styles/main.css';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import React, { Component } from 'react';

import Home from './components/home/home'
import Licenses from './components/licenses/licenses'
import Users from './components/users/users'
import Settings from './components/settings/settings'
import SiteHome from './components/siteHomePage/home'

class App extends Component {
  render() {
    return (
      <div className="h-screen flex overflow-hidden bg-other_light-100" >


        <Router>

            {/* <div className="container mx-auto"> */}
              <Switch>
                <Route exact path='/' component={SiteHome} />
                <Route exact path='/home' component={Home} />
                <Route exact path='/licenses' component={Licenses}/>
                <Route exact path='/users' component={Users}/>
                <Route exact path='/settings' component={Settings}/>
              </Switch>
            {/* </div> */}
          

        </Router>

      </div>
    );
  }
}

export default App;
