import React from 'react';
import {Globals} from '../../utils';
import UserTableLists from '../UserTableLists/UserTableLists';
export class Users extends React.Component {
    constructor(props) {
        super(props);
        if(!localStorage.getItem('data'))
        this.state = {
            UserList: [],
            datastatus:'not-fetched',
        }
        else
        {
            this.state = {
                UserList: [],
            }
        }
    }
    componentDidMount() {
        Globals.showLoadingIndicator();
        fetch(Globals.instance().baseUrl + '/users')
            .then(response => response.json())
            .then((data) => {
                Globals.hideLoadingIndicator();
                if(this.state.datastatus==='not-fetched')
                {
                    localStorage.setItem('data', JSON.stringify(data));
                }
                this.setState({UserList: JSON.parse(localStorage.getItem('data'))})
            });
    }
    render()
    {return (
        <div className="container">
            <div className="card card-stats generalfont">
                <div className="card-header card-header-warning card-header-icon">
                    <div className="card-icon">
                        <i className="material-icons">assignment</i>
                    </div>
                    <div className="row pos1">
                        <span>Users</span>
                    </div>
                </div>
                <div className="card-footer generalfont">
                    <UserTableLists UserLists={this.state.UserList}/>
                </div>
            </div>
        </div>
    );
    }
}
export default Users;
