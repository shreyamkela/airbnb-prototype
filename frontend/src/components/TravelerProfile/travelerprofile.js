import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import axios from 'axios';
import 'jquery/dist/jquery.js'
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/js/bootstrap.js';
import {DASHBOARD_URL} from '../../constants/constants';

class travelerprofile extends Component 
{
    constructor(props){
        super(props);
        this.state={
            flag : false,
            setUsername : localStorage.getItem('firstname'),
            setUserid : localStorage.getItem('userId'),
            usertype : "",
            firstname : "",
            lastname : "",
            contact : "",
            cardnumber : "",
            address : ""
        }
        
        this.handleLogout = this.handleLogout.bind(this);
        this.ChangeHandler = this.ChangeHandler.bind(this);
        this.SaveChanges = this.SaveChanges.bind(this)
    }

    componentDidMount(){
        
        // axios.defaults.withCredentials = true;
        axios.get(`${DASHBOARD_URL}/travelerprofile/` + this.state.setUserid)
                .then((response) => {
                    console.log("\nPrinting the response.data : \n", JSON.stringify(response.data))
                    this.setState({
                        firstname: response.data.Firstname,
                        lastname: response.data.Lastname,
                        address : response.data.Address,
                        contact : response.data.PhoneNumber,
                        cardnumber : response.data.CardNumber
                    }) 
            });
    }

    handleLogout = () => {
        // cookie.remove('cookieT', { path: '/' })
        sessionStorage.removeItem('SessionEmail');
        sessionStorage.removeItem('SessionUsername');
        localStorage.clear();
    }

    ChangeHandler(e) {
        let change = {}
        change[e.target.name] = e.target.value
        this.setState(change)
    }

    SaveChanges = (e) => {
        var headers = new Headers();
        e.preventDefault();

        const data = {
            Firstname : this.state.firstname,
            Lastname : this.state.lastname,
            PhoneNumber : this.state.contact,
            Address : this.state.address,
            CardNumber : this.state.cardnumber,
            UserId : this.state.setUserid
        } 
        // axios.defaults.withCredentials = true;
        axios.post(`${DASHBOARD_URL}/travelerprofile` ,data)
            .then(response => {
                console.log("Status Code : ",response.status);
                console.log("Response data : ", response.data)
                if(response.status === 200){
                    this.setState({
                        flag : true,
                    })
                    alert(response.data);
                }
                else{
                    this.setState({
                        flag : false
                    })
                }
            })
            .catch(err =>{
                alert("Invalid input data !!");
            });
        }

    render(){
        require('./travelerprofile.css');
        let redirectvar = null;
        // if( cookie.load('cookieT')!="traveler" ){
        //     redirectvar = <Redirect to= "/homepage"/>
        // }
        if( !localStorage.getItem("userId") )
        {
            redirectvar = <Redirect to= "/homepage"/>
        }
        return(
            <div>
                {redirectvar}
                <div id="navbardiv">

                    <nav class="navbar navbar-default navbar-expand-sm" id="nav">
                        <div class="container-fluid">
                            <div class="navbar-header">
                                    <a href="http://localhost:3000/homepage" class="navbar-brand">
                                        <p class="heading1">Airbnb</p>
                                    </a>
                            </div>

                            <div>
                                <ul class="nav navbar-nav navbar-right" id="ulist">
                                    <li class="items"><a href="#" class="nav-item mainlink1"> TripBoards </a></li>

                                    <li class="dropdown items">
                                        <a href="#" class="dropdown-toggle mainlink1" data-toggle="dropdown"> {this.state.setUsername} <span class="caret"></span></a>
                                        <ul class="dropdown-menu dropdown-menu-right mymenu">
                                            <li class="listitems"><a class="dropdown-item menulinks1" href="#" role="menu">Inbox</a></li>
                                            <li class="listitems"><a class="dropdown-item menulinks1" href="http://localhost:3000/travelertrips" role="menu">My trips</a></li>
                                            <li class="listitems"><a class="dropdown-item menulinks1" href="http://localhost:3000/travelerprofile" role="menu">My profile</a></li>
                                            <li class="listitems"><a class="dropdown-item menulinks1" href="#" role="menu">Account</a></li>
                                            <li class="listitems"><Link to="/homepage" onClick = {this.handleLogout} class="dropdown-item menulinks1" role="menu">Logout</Link></li>
                                        </ul>
                                    </li>

                                    <li class="dropdown items">
                                        <a href="#" class="dropdown-toggle mainlink1" data-toggle="dropdown"> Help <span class="caret"></span></a>
                                        <ul class="dropdown-menu dropdown-menu-right mymenu">
                                            <li class="listitems"><a class="dropdown-item menulinks1" href="#">Visit help center</a></li>
                                            <li class="dropdown-item listitems">Travelers</li>
                                            <li class="listitems"><a class="dropdown-item menulinks1" href="#"> How it works </a></li>
                                            <li class="listitems"><a class="dropdown-item menulinks1" href="#"> Security center </a></li>
                                            <li class="dropdown-item listitems">Homeowners</li>
                                            <li class="listitems"><a class="dropdown-item menulinks1" href="#"> How it works </a></li>
                                            <li class="listitems"><a class="dropdown-item menulinks1" href="#"> List your property </a></li>
                                            <li class="listitems"><a class="dropdown-item menulinks1" href="#"> Community </a></li>
                                            <li class="listitems"><a class="dropdown-item menulinks1" href="#"> Discovery Hub </a></li>
                                            <li class="dropdown-item listitems">Property managers</li>
                                            <li class="listitems"><a class="dropdown-item menulinks1" href="#"> List your properties </a></li>
                                        </ul>
                                    </li> 

                                    <li class="items"><img src="https://png.pngtree.com/svg/20170113/airbnb_786124.png" height="35px" width="35px"/></li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
                
                <div class="mainbody">
                    <br/>

                    <div class="text-center profileinfo">
                        <h3>Edit your details</h3>
                        <br></br>
                        <div class="text-center infoform">
                            <div class="form-group">
                                <input onChange = {this.ChangeHandler} id="firstname" name="firstname" class="form-control" type="text" size="20" placeholder="First name" defaultValue={this.state.firstname}/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.ChangeHandler} id="lastname" name="lastname" class="form-control" type="text" size="20" placeholder="Last name" defaultValue={this.state.lastname}/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.ChangeHandler} id="address" name="address" class="form-control" type="text" size="15" placeholder="Address" defaultValue={this.state.address}/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.ChangeHandler} id="contact" name="contact" class="form-control" type="tel" size="13" placeholder="Contact no." defaultValue={this.state.contact}/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.ChangeHandler} id="cardnumber" name="cardnumber" class="form-control" type="text" size="25" placeholder="Credit/Debit card number" defaultValue={this.state.cardnumber}/>
                            </div>
                        </div>
                        <br></br>
                        <button onClick = {this.SaveChanges} class="btn btn-primary mybutton" type="submit">Save changes</button>
                    </div>

                </div>

            </div>
        )
    }
}

export default travelerprofile