import React from 'react'
import { NavLink } from 'react-router-dom';

export class UserListItem extends React.Component{
    state = { // state for component that stores cheese name and chees nation
        editing: false,
        name: '',
        email: ''
    }
    userEdit = (e) => { // called when user click edit button
        const {User} = this.props;
        this.setState({
            name: User.name,
            email: User.email
        })
        this.setState({ editing: true });
    }

    userInputChange = (e) => { // update state from inputs
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleApply = (e) => { // called when user click apply button
        if (this.state.name.trim() ==='' || this.state.email === '') {
            return;
        }
        const {User,onRename} = this.props;
        onRename(User.id,{
            name: this.state.name,
            email:this.state.email
        });

        this.setState({ editing: false });
    }

    render(){
        const {User}=this.props;
            return (
                <tr>
                <td>
                <NavLink exact to={'/update/' + User.id}>
                   <button  className="btn btn-primary pull-right">
                       <span className="font-size">EDIT</span>
                       <div className="ripple-container"></div>
                   </button>
                 </NavLink>
                </td>
                <td>
                {User.name}
                </td>
                <td>
                 {User.username}
                 </td>
                 <td>
                  {User.email}
                 </td>
                  </tr>
        );
        }
    }
export default UserListItem