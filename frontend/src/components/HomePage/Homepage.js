import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import cookie from 'react-cookies';
import axios from 'axios';
import {Redirect} from 'react-router';
import 'jquery/dist/jquery.js'
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/js/bootstrap.js';
import './homepage.css';

class Homepage extends Component {
    constructor(props){

        super(props);

        this.state={
            flag : false,
            username : sessionStorage.getItem('SessionUsername'),
            location : '',
            startDate : '',
            endDate : '',
            guests : ''
        }

        this.SearchButton = this.SearchButton.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.ChangeHandler = this.ChangeHandler.bind(this);
    }


    SearchButton = (e) => {
        var headers = new Headers();
        e.preventDefault();
        if(this.state.location == "" || this.state.startDate == "" || this.state.endDate == "" || this.state.guests == "")
            alert("None of the fields can be empty");
        else{
            const data = {
                location : this.state.location,
                startDate : this.state.startDate,
                endDate : this.state.endDate,
                guests : this.state.guests
            }

            axios.defaults.withCredentials = true;
            axios.post('http://localhost:3001/homepage/data',data)
                .then(response => {
                    console.log("Status Code : ",response.status);
                    if(response.status === 200){
                        alert("Traveler request for search property submitted successfully");
                        this.setState({
                            flag : true,
                        })
                    }
                    else{
                        this.setState({
                            flag : false
                        })
                    }
                })
                .catch(err =>{
                    alert("Invalid request for search property");
                });
        }
    }

    handleLogout = () => {
        cookie.remove('cookieT', { path: '/' })
        // window.location.reload();
        sessionStorage.removeItem('SessionEmail');
        sessionStorage.removeItem('SessionUsername');
    }

    ChangeHandler(e) {
        let change = {}
        change[e.target.name] = e.target.value
        this.setState(change)
    }

    render(){
        let redirectvar = null
        // console.log("Username is : "+this.state.username)
        if(cookie.load('cookieT') && this.state.flag==true){
            redirectvar = <Redirect to= "/searchresults"/>
        }
        if(!cookie.load('cookieT') && this.state.flag==true){
            alert("You need to log in first!");
        }

        let usernamedropdown = null;
        if(cookie.load('cookieT')){
            usernamedropdown = (
                <li class="dropdown items">
                    <a href="#" class="dropdown-toggle mainlinks" data-toggle="dropdown"> {this.state.username} <span class="caret"></span></a>
                    <ul class="dropdown-menu dropdown-menu-right mymenu">
                        <li class="listitems"><a class="dropdown-item menulinks" href="#" role="menu">Inbox</a></li>
                        <li class="listitems"><a class="dropdown-item menulinks" href="http://localhost:3000/travelertrips" role="menu">My trips</a></li>
                        <li class="listitems"><a class="dropdown-item menulinks" href="http://localhost:3000/travelerprofile" role="menu">My profile</a></li>
                        <li class="listitems"><a class="dropdown-item menulinks" href="#" role="menu">Account</a></li>
                        {/* <li class="listitems"><a onClick={this.handleLogout} class="dropdown-item menulinks" role="menu">Logout</a></li> */}
                        <li class="listitems"><Link to="/homepage" onClick = {this.handleLogout} class="dropdown-item menulinks" role="menu">Logout</Link></li>
                    </ul>
                </li>
            ); 
        }
        else{
            usernamedropdown = (
                <li class="dropdown items">
                    <a href="#" class="dropdown-toggle mainlinks" data-toggle="dropdown"> <b>Login </b> <span class="caret"></span></a>
                    <ul class="dropdown-menu dropdown-menu-right mymenu">
                        <li class="listitems"><a class="dropdown-item menulinks" href="http://localhost:3000/travelerlogin" role="menu">Traveller login</a></li>
                        <li class="listitems"><a class="dropdown-item menulinks" href="http://localhost:3000/ownerlogin" role="menu">Owner login</a></li>
                    </ul>
                </li>
            )
        }
        
        return(
            <div id="mainbodydiv">
            {redirectvar}
            <div id="navbardiv">

                <nav class="navbar navbar-default navbar-expand-sm" id="nav">
                    <div class="container-fluid">
                        <div class="navbar-header">
                                <a href="http://localhost:3000/homepage" class="navbar-brand">
                                    <p class="heading">Airbnb</p>
                                </a>
                        </div>

                        <div>
                            <ul class="nav navbar-nav navbar-right" id="ulist">
                                <li class="items"><a href="#" class="nav-item mainlinks"> <b>TripBoards </b></a></li>

                                {usernamedropdown}

                                <li class="dropdown items">
                                    <a href="#" class="dropdown-toggle mainlinks" data-toggle="dropdown"> <b>Help </b><span class="caret"></span></a>
                                    <ul class="dropdown-menu dropdown-menu-right mymenu">
                                        <li class="listitems"><a class="dropdown-item menulinks" href="#">Visit help center</a></li>
                                        <li class="dropdown-item listitems">Travelers</li>
                                        <li class="listitems"><a class="dropdown-item menulinks" href="#"> How it works </a></li>
                                        <li class="listitems"><a class="dropdown-item menulinks" href="#"> Security center </a></li>
                                        <li class="dropdown-item listitems">Homeowners</li>
                                        <li class="listitems"><a class="dropdown-item menulinks" href="#"> How it works </a></li>
                                        <li class="listitems"><a class="dropdown-item menulinks" href="#"> List your property </a></li>
                                        <li class="listitems"><a class="dropdown-item menulinks" href="#"> Community </a></li>
                                        <li class="listitems"><a class="dropdown-item menulinks" href="#"> Discovery Hub </a></li>
                                        <li class="dropdown-item listitems">Property managers</li>
                                        <li class="listitems"><a class="dropdown-item menulinks" href="#"> List your properties </a></li>
                                    </ul>
                                </li> 
                                
                                <li class="items"><img alt="Airbnb logo" class="site-header-birdhouse__image" role="presentation" src="https://png.pngtree.com/svg/20170113/airbnb_786124.png" height="35px" width="35px"/></li>
                            </ul>
                        </div>

                    </div>
                </nav>
            </div>

            <div id="bodydiv">
                    <div class="container">
                        <h1 class="mainlinks">
                            Book beach houses, cabins, <br/>
                            condos and more, worldwide
                        </h1>
                        <br></br>
                        <form>
                            <div class="row no-gutter">
                                <div class="col-md-4">
                                    <input onChange = {this.ChangeHandler} type = "text" name="location" id="location" placeholder="Where do you want to go?" class="form-control" />
                                    <span class="glyphicon glyphicon-map-marker form-control-feedback"></span>
                                </div>
                                <div class="col-md-2">
                                    <input onChange = {this.ChangeHandler} type="date" name="startDate" id="startDate" class="form-control js-Date" min="2018-09-30" max="2018-12-31"/>
                                    <i class="icon-calendar form-control-icon" aria-hidden="true">
                                    </i>
                                </div>
                                <div class="col-md-2">
                                    <input onChange = {this.ChangeHandler} type="date" name="endDate" id="endDate" class="form-control js-Date" min="2018-09-30" max="2018-12-31"/>
                                </div>
                                <div class="col-md-2">
                                    <input onChange = {this.ChangeHandler} type="number" name="guests" id="guests" class="form-control" min="1" max="200" placeholder="Guests"/>
                                </div>
                                <div class="col-md-2">
                                    <button onClick={this.SearchButton} class="btn btn-primary btn-lg searchbox-submit searchSubmit" data-effect="ripple" type="button" tabindex="5" data-loading-animation="true">
                                        Search
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    <br/><br/>
                    <div id="bodyfoot">
                        <div class="row">
                            <div class="text-center col-md-1 col-md-offset-1"></div>
                            <div class="my-class text-center col-md-3 col-md-offset-1">
                                <strong class="mainlinks">Your whole vacation starts here</strong><br/>
                                <span class="mainlinks">Choose a rental from the world's best selection</span>
                            </div>
                            <div class="text-center col-md-1 col-md-offset-1"></div>
                            <div class="my-class text-center col-md-3 col-md-offset-1">
                                <strong class="mainlinks">Book and stay with confidence</strong><br/>
                                <span><a href="#" class="mainlinks">Secure payments, peace of mind</a></span>
                            </div>
                            <div class="text-center col-md-1 col-md-offset-1"></div>
                            <div class="my-class text-center col-md-3 col-md-offset-1">
                                <strong class="mainlinks">Your vacation your way</strong><br/>
                                <span class="mainlinks">More space, more privacy, no compromises</span>
                            </div>
                            
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default Homepage;

