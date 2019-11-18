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

class Commonnavbar extends Component 
{
    constructor(props){
        super(props);
        this.state={
            flag : false
        }
    }

    render(){
        require('./Commonnavbar.css');
        return(
            <div>
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
                                    <li class="items"><img src="https://png.pngtree.com/svg/20170113/airbnb_786124.png" height="40px" width="40px"/></li>
                                </ul>
                            </div>

                        </div>
                    </nav>
                </div>
            </div>
        )
    }
}

export default Commonnavbar;