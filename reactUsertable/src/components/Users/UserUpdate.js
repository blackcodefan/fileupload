import React from 'react';
import {Globals} from '../../utils';
import {NavLink} from "react-router-dom";

export class UserUpdate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            username:'',
            email:'',
            address:{street:'',
                    suite: '',
                    city: '',
                    zipcode:'',
                    geo: {
                        lat:'',
                        lng:''
                    }}
        }
    }
    componentDidMount() {
        Globals.showLoadingIndicator();
        const {match} = this.props;
        var users=[];
        users=JSON.parse(localStorage.getItem('data'));
        var fetchId=match.params.userId;
        let url = Globals.instance().baseUrl + '/users/' + fetchId;

        fetch(url)
            .then(response => response.json())
            .then((data) => {
                console.log(data);
                Globals.hideLoadingIndicator();
            });
        this.setState
        ( {name: users[fetchId].name,
            username:users[fetchId].username,
            email:users[fetchId].email,
            address:users[fetchId].address
            })
    }
    userInputChange = (e) => { // update state from inputs

        this.setState({
            [e.target.name]: e.target.value,
        });
        console.log(this.state)
    };
    userAddressChange = (e) => { // update state from inputs

        const {address} = this.state;
        const currentAddress = address;
        const {name, value} = e.target;
        currentAddress[name] = value;
        this.setState({address: currentAddress});
        console.log(this.state.address)
    };
    userAddressGeoChange = (e) => { // update state from inputs
        const {geo} = this.state.address;
        const currentGeo = geo;
        const {name, value} = e.target;
        geo[name] = value;
        this.setState({geo: currentGeo});
    };
    //update the userprofiles
    userUpdate=()=>{
        const{match}=this.props;
        var UserList=JSON.parse(localStorage.getItem('data'));
        var UserCol=UserList[match.params.userId-1];
        UserCol.name=this.state.name;
        UserCol.username=this.state.username;
        UserCol.email=this.state.email;
        UserCol.address.street=this.state.address.street;
        UserCol.address.suite=this.state.address.suite;
        UserCol.address.city=this.state.email;
        UserCol.address.zipcode=this.state.address.zipcode;
        UserCol.address.geo.lat=this.state.address.geo.lat;
        UserCol.address.geo.lng=this.state.address.geo.lng;
        //This is the part that updated data save in localStorage.You can put this in your database.
        localStorage.setItem('data',JSON.stringify(UserList));
    };
    render()
    {
       return (

         <div className="container generalfont">
            <div className="card card-stats">
                <div className="card-header card-header-warning card-header-icon">
                    <div className="card-icon">
                        <i className="material-icons">account_box</i>
                    </div>
                    <div className="row pos1"><span>User Profile</span></div>
                </div>
                <form>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-11">
                                <div className="form-group bmd-form-group">
                                    <label className="bmd-label-floating" >Name</label>
                                    <input type="text" className="form-control" onChange={this.userInputChange} value={this.state.name} name="name"/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-11">
                                <div className="form-group bmd-form-group">
                                    <label className="bmd-label-floating" >UserName</label>
                                    <input type="text" className="form-control" onChange={this.userInputChange} value={this.state.username} name="username"/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-11">
                                <div className="form-group bmd-form-group">
                                    <label className="bmd-label-floating">Email</label>
                                    <input type="text" className="form-control" onChange={this.userInputChange} value={this.state.email} name="email"/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-11">
                                <div className="form-group bmd-form-group">
                                    <label className="bmd-label-floating">Address_street</label>
                                    <input type="text" className="form-control" onChange={this.userAddressChange} value={this.state.address.street} name="street"/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-11">
                                <div className="form-group bmd-form-group">
                                    <label className="bmd-label-floating">Address_suite</label>
                                    <input type="text" className="form-control" onChange={this.userAddressChange} value={this.state.address.suite} name="suite"/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-11">
                                <div className="form-group bmd-form-group">
                                    <label className="bmd-label-floating">Address_city</label>
                                    <input type="text" className="form-control" onChange={this.userAddressChange} value={this.state.address.city} name="city"/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-11">
                                <div className="form-group bmd-form-group">
                                    <label className="bmd-label-floating">Address_zipcode</label>
                                    <input type="text" className="form-control" onChange={this.userAddressChange} value={this.state.address.zipcode} name="zipcode"/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-11">
                                <div className="form-group bmd-form-group">
                                    <label className="bmd-label-floating">Address_geo_lat</label>
                                    <input type="text" className="form-control" onChange={this.userAddressGeoChange} value={this.state.address.geo.lat} name="lat"/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-11">
                                <div className="form-group bmd-form-group">
                                    <label className="bmd-label-floating">Address_geo_lng</label>
                                    <input type="text" className="form-control" onChange={this.userAddressGeoChange} value={this.state.address.geo.lng} name="lng"/>
                                </div>
                            </div>
                        </div>
                        <div className="row btn-align">
                        <NavLink exact to={'/users'}><button  onClick={this.userUpdate} className="btn btn-primary pull-left">Update</button></NavLink>
                        </div>
                    </div>
                </form>
            </div>
         </div>

       );
    }
}
export default UserUpdate;
