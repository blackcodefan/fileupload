import React from 'react';
import { Route, BrowserRouter as Router,Redirect  } from 'react-router-dom';
import {Users} from '../Users/Users';
import {UserUpdate} from '../Users/UserUpdate'
import LoadingIndicator from './loading-indicator';
export class App extends React.Component {
    render()
    {
        return (
        <div className="TimesNewRoman">
        <Router>
            <Route exact path='/' render = {() => (<Redirect to='/users'/>)}/>
            <Route exact path='/users' component={Users}/>
            <Route exact path='/update/:userId' component={UserUpdate}/>
            <LoadingIndicator/>
        </Router>
        </div>
            );
    }
}
export default App;
