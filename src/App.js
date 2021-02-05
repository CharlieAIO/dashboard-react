import './static/styles/main.css';
import {BrowserRouter as Router, Switch, Route, useLocation } from 'react-router-dom'
import React from 'react';

import Home from './components/home/home'
import Licenses from './components/licenses/licenses'
import Users from './components/users/users'
import Settings from './components/settings/settings'
import SiteHome from './components/siteHomePage/home'
import Dashboard from './components/userDashboard/dashboard'
import Bind from './components/bindPage/bindPage'
import PurchasePage from './components/purchasePage/purchase'


const App = () => { 


  return (
    <div className="h-screen flex w-screen overflow-hidden bg-other-100 dark:bg-darkOther-100" id="baseBackground">

      <Router>

          {/* <div className="container mx-auto"> */}
            <Switch>
              <Route exact path='/' component={SiteHome} />
              <Route exact path='/dashboard' component={Dashboard} />
              <Route exact path='/bind' component={Bind} />
              <Route exact path='/purchase' component={PurchasePage} />

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

export default App;
