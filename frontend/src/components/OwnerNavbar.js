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

class OwnerNavbar extends Component 
{
    constructor(props){
        super(props);
    }

    handleLogout = () => {
        // cookie.remove('cookieO', { path: '/' })
        localStorage.clear();
    }

    render(){
        require('./OwnerNavbar.css');
        return(
            <div>
                <div id="navbardiv">
                <nav class="navbar navbar-default navbar-expand-sm" id="nav">
                        <div class="container-fluid">
                            <div class="navbar-header">
                                    <a href="http://localhost:3000/listproperty/welcome" class="navbar-brand">
                                        <p class="heading1">Airbnb</p>
                                    </a>
                            </div>

                            <div>
                                <ul class="nav navbar-nav navbar-right" id="ulist">

                                    <li class="dropdown items">
                                        <a href="#" class="dropdown-toggle mainlinks1" data-toggle="dropdown"> My Account <span class="caret"></span></a>
                                        <ul class="dropdown-menu dropdown-menu-right mymenu">
                                            <li class="listitems"><a class="dropdown-item menulinks1" href="#" role="menu">Account Settings</a></li>
                                            <li class="listitems"><a class="dropdown-item menulinks1" href="http://localhost:3000/listproperty/ownerdashboard" role="menu">Property Details</a></li>
                                            {/* <li class="listitems"><a class="dropdown-item menulinks1" href="#" role="menu">Logout</a></li> */}
                                            <li class="listitems"><Link to="/homepage" onClick = {this.handleLogout} class="dropdown-item menulinks1" role="menu">Logout</Link></li>
                                        </ul>
                                    </li>

                                    <li class="items"><img src="https://png.pngtree.com/svg/20170113/airbnb_786124.png" height="35px" width="35px"/></li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        )
    }
}

export default OwnerNavbar;