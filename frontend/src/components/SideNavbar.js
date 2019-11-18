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

class SideNavbar extends Component 
{
    constructor(props){
        super(props);
    }

    render(){
        require('./SideNavbar.css');
        return(
            <div>
                <div class="col-md-4 col-xs-4 sidebar">
                    <ul class="sidebar-nav">
                        <li class="itemlist">
                            <a class="sidebaritems" href="http://localhost:3000/listproperty/location">Location</a>
                        </li>
                        <li class="itemlist">
                            <a class="sidebaritems" href="http://localhost:3000/listproperty/details">Details</a>
                        </li>
                        {/* <li class="itemlist">
                            <a class="sidebaritems" href="http://localhost:3000/listproperty/photos">Photos</a>
                        </li> */}
                        <li class="itemlist">
                            <a class="sidebaritems" href="http://localhost:3000/listproperty/price">Pricing</a>
                        </li>
                    </ul>
                </div>
            </div>
        )
        }
}

export default SideNavbar;