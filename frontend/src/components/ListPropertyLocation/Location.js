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
import SideNavbar from '../SideNavbar';

class Location extends Component
{
    constructor(props){
        super(props);
        this.state = {
            saveflag : false,
            country : "",
            address : "",
            city : "",
            state : "",
            zipcode : "",
            placecountry : "Country",
            placeaddress : "Address",
            placecity : "City",
            placestate : "State",
            placezip : "Zipcode"
        }

        this.ChangeHandler = this.ChangeHandler.bind(this);
        this.SaveButton = this.SaveButton.bind(this);
    }

    componentDidMount(){
        this.setState({
            country : localStorage.getItem('country'),
            address : localStorage.getItem('address'),
            city : localStorage.getItem('city'),
            state : localStorage.getItem('state'),
            zipcode : localStorage.getItem('zipcode'),
        })
    }

    ChangeHandler(e) {
        let change = {}
        change[e.target.name] = e.target.value
        this.setState(change)
      }

    SaveButton = (e) => {

        if(this.state.country!="" && this.state.address!="" && this.state.city!="" && this.state.state!="" && this.state.zipcode!="")
        {    
            localStorage.setItem('country', this.state.country);
            localStorage.setItem('address', this.state.address);
            localStorage.setItem('city', this.state.city);
            localStorage.setItem('state', this.state.state);
            localStorage.setItem('zipcode', this.state.zipcode);

        }

        this.setState({
            saveflag : true,
        })
        }

    render(){
        require('./location.css');
        let redirectvar = null;
        let errormessage = null;
        if(this.state.saveflag) 
        {
            if(this.state.country=="" || this.state.address=="" || this.state.city=="" || this.state.state=="" || this.state.zipcode=="")
            {
                    errormessage = (
                        <div class="alert alert-danger">
                            None of the field should be empty !!!
                        </div>
                    )
            }
            else {
                redirectvar = <Redirect to= "/listproperty/details"/>
            }
        }
        
        if(localStorage.getItem("type")=="traveller")
        {
            redirectvar = <Redirect to= "/homepage"/>
        }else if(!localStorage.getItem("userId")){
            alert("Not logged in!!!")
            redirectvar = <Redirect to="/ownerlogin"/>
        }
        
        return(
            <div>
                {redirectvar}
                <div id="mainbody" class="row">

                    <SideNavbar/>

                    <div class="col-md-8 rightsidecontent">
                        <div class="container">
                            <div class="formbody">
                                <br/>
                                <h5 class="heading4">Enter the location of your rentals</h5>
                                <br/>
                                {errormessage}
                                <div class="form-group">
                                    <input onChange = {this.ChangeHandler} id="country" name="country" class="form-control" type="text" size="20" placeholder={this.state.placecountry} defaultValue={localStorage.getItem('country')}/>
                                </div>
                                <div class="form-group">
                                    <textarea onChange = {this.ChangeHandler} class="form-control" rows="3" cols="50" name="address" id="address" placeholder={this.state.placeaddress} defaultValue={localStorage.getItem('address')}/>
                                </div>
                                <div class="form-group">
                                    <input onChange = {this.ChangeHandler} id="city" name="city" class="form-control" type="text" size="20" placeholder={this.state.placecity} defaultValue={localStorage.getItem('city')}/>
                                </div>
                                <div class="form-group">
                                    <input onChange = {this.ChangeHandler} id="state" name="state" class="form-control" type="text" size="20" placeholder={this.state.placestate} defaultValue={localStorage.getItem('state')}/>
                                </div>
                                <div class="form-group">
                                    <input onChange = {this.ChangeHandler} id="zipcode" name="zipcode" class="form-control" type="text" size="20" placeholder={this.state.placezip} defaultValue={localStorage.getItem('zipcode')}/>
                                </div>
                                <center>
                                    <button class="btn btn-primary save-button" onClick={this.SaveButton}>
                                        <span>Save</span>
                                    </button>
                                </center>
                                <br/> <br/>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default Location;