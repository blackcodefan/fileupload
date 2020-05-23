import React from 'react'
import UserListItem from "./UserListItem"
export class UserTableLists extends React.Component {
    render() {
        const {UserLists} = this.props;
        // create jsx list from data
        const list = UserLists.map((User) => {
            return (<UserListItem key={User.id} User={User}/>);
        });

        // render
        return(
            <table
                   className="table table-striped
                               table-responsive-lg
                               table-responsive-md
                               table-responsive-sm
                               table-responsive-xl">
                <thead>
                    <tr>
                        <th>*</th>
                        <th className="font-size"><b>Name</b></th>
                        <th className="font-size"><b>UserName</b></th>
                        <th className="font-size"><b>Email</b></th>
                    </tr>
                </thead>
                <tbody>
                    {list}
                </tbody>
            </table>
    )
    }
}
export default UserTableLists