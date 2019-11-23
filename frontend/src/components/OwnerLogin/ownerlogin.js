import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import cookie from 'react-cookies';
import axios from 'axios';
import {Redirect} from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.js'
import 'jquery/dist/jquery.min.js'
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/js/bootstrap.js';
import Commonnavbar from '../Commonnavbar';
// import './ownerlogin.css';
import {DASHBOARD_URL} from '../../constants/constants';
import {LOGIN_URL} from '../../constants/constants';


class ownerlogin extends Component 
{
    constructor(props){
        super(props);
        this.state = {
            email : "",
            password : "",
            flag : false,
            userFlag : '',
            userId : ""
        }

        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);

    }

    emailChangeHandler = (e) => {
        this.setState({
            email : e.target.value
        })
    }

    passwordChangeHandler = (e) => {
        this.setState({
            password : e.target.value
        })
    }

    submitLogin = (e) => {
        var headers = new Headers();
        e.preventDefault();
        if(this.state.email==""){
            alert("Email address field cannot be empty");
            if(this.state.password=="")
                alert("The password field cannot be empty");
        }
        else if(this.state.password==""){
            alert("The password field cannot be empty");
        }
        else{
            const data = {
                "Email" : this.state.email,
                "Password" : this.state.password,
                "Type" : "owner"
            }

            // axios.defaults.withCredentials = true;
            axios.post(`${LOGIN_URL}/login`, data, {headers: {"Content-Type": "application/x-www-form-urlencoded"}})
                .then(response => {
                    console.log("Status Code : ",response.status);
                    if(response.status === 200){
                        alert("Owner login successful!");
                        this.setState({
                            flag : true,
                            userId: response.data
                        })

                        var userId = response.data;

                        // TODO Kavina - get call to Dashboard endpoint to get firstname and lastname of user, and save in sessionStorage
                        console.log("USER ID: ", userId)

                        //axios.defaults.withCredentials = true;
                        axios.get(`${DASHBOARD_URL}/travelerprofile/${userId}`, {headers: {"Content-Type": "application/x-www-form-urlencoded"}})
                            .then(response1 => {
                                console.log("Response data from dashboard goapi : \n" + JSON.stringify(response1.data));
                                // var res = JSON.parse(response1.data);
                                localStorage.setItem('email', this.state.email);
                                localStorage.setItem('userId', response.data);
                                localStorage.setItem('type', "owner");
                                localStorage.setItem("firstname", response1.data.Firstname);
                                localStorage.setItem("lastname", response1.data.Lastname);
                            })
                            .catch(err =>{
                                console.error(err);
                                alert("Invalid credentials. Please try again.");
                            })

                    }
                    else{
                        this.setState({
                            flag : false
                        })
                    }
                })
                .catch(err =>{
                    alert("Invalid credentials. Please try again.");
                });
        }
    }

    render(){

        let redirectvar = null;
        if(this.state.flag==true || localStorage.getItem('type') == "owner"){
            redirectvar = <Redirect to= "/listproperty/welcome"/>
        }
        require('./ownerlogin.css');
        return(
            <div>
                {redirectvar}
                <Commonnavbar/>

                <div id="loginpagebody">
                    <div class="row">
                        <div class="text-center col-md-1"></div>
                        <div class="col-md-5 col-sm-6 hidden-xs personyzeContent">
                            {/* <a id="personyzeContent"></a> */}
                        </div>
                        <div class="text-center col-md-1"></div>
                        <div id="formContainer" class="col-md-5"><br/>
                            <div class="login-wrapper panel panel-dashboard">
                                <div class="login-form">
                                    <div class="formbodydiv1">
                                        <div class="panel-heading">
                                            <p class="panel-title">Owner login</p>
                                        </div>
                                        <div>
                                            <span>Need an account? </span>
                                            <a href="/ownersignup"> Sign Up</a>
                                        </div><hr/>
                                        <div class="panel-body">
                                            <div class="form-group">
                                                <input onChange={this.emailChangeHandler} id="loginemail" name="loginemail" class="form-control" placeholder="Email address" type="email"size="20" autoFocus/>
                                            </div>
                                            <div class="form-group">
                                                <input  onChange={this.passwordChangeHandler} id="password" name="password" class="form-control" placeholder="Password" type="password" size="20"/>
                                            </div>
                                            {/*<div class="form-group">*/}
                                            {/*    <a href="#">Forgot password?</a>*/}
                                            {/*</div>*/}
                                            <div class="from-group">
                                                <input onClick = {this.submitLogin} type="submit" class="btn btn-primary" value="Log In" id="form-submit" tabindex="4"/>
                                            </div><br/>
                                            {/*<div>*/}
                                            {/*    <input id="rememberMe" name="rememberMe" tabindex="3" checked="true" type="checkbox" value="true"/>*/}
                                            {/*    <input type="hidden" name="_rememberMe" value="on"/>*/}
                                            {/*    Keep me signed in*/}
                                            {/*</div>*/}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ownerlogin;