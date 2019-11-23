import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.js'
import 'jquery/dist/jquery.min.js'
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/js/bootstrap.js';
import SideNavbar from '../SideNavbar';

class lisproperty extends Component 
{
    constructor(props){
        super(props);
        this.state = {
            flag : false
        }

        this.SubmitButton = this.SubmitButton.bind(this);
    }

    SubmitButton = (e) => {
        this.setState({
            flag : true
        })
    }

    render(){
        require('./listproperty.css');
        let redirectvar = null;
        if(this.state.flag){
            redirectvar = <Redirect to= "/listproperty/location"/>
        }
        if(localStorage.getItem("type")=="traveller")
        {
            redirectvar = <Redirect to= "/homepage"/>
        }
        return(
            <div>
                {redirectvar}
                <div id="mainbody" class="row">

                    <SideNavbar/>
 
                    <div class="col-md-8 rightsidecontent">
                        <div class="container">
                            <br/>
                            <h2><center>Welcome to Airbnb</center></h2>
                            <br/>
                            <h2><center>List a new property</center></h2>
                            <br/>
                            <center>
                                <button class="btn btn-primary continue-button" onClick={this.SubmitButton}>
                                    <span>Continue</span>
                                </button>
                            </center>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default lisproperty;