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
import 'bootstrap/dist/js/bootstrap.min.js';
import {PROPERTY_URL} from '../../constants/constants'

class searchresults extends Component
{
    constructor(props){
        super(props);

        this.state={
            setUsername : localStorage.getItem('username'),
            information : [], 
            imageinfo : [],
            imageView : '',
            encodedImage : [],
            image_number : [],
            flag : false,
            startDate:'',
            endDate:'',
            location:''

        }

        this.handleLogout = this.handleLogout.bind(this);
        this.BookProperty = this.BookProperty.bind(this);
    }

    componentDidMount(){

        if(this.props.location.state){
            this.setState({
                information: this.props.location.state.responseData,
                startDate:this.props.location.state.startDate,
                endDate:this.props.location.state.endDate,
                location:this.props.location.state.location
            })
        }

    }

    handleLogout = () => {
        localStorage.clear();
        localStorage.removeItem('email');
        localStorage.removeItem('username');
    }

    BookProperty = (id,name,owner) => {

        //TODO: 
        // For Vinay
        // e = propertyID. Make a booking call to your rest api. Do a Payment.
        // On successful payment. the below rest call will be made on my rest api with the exact const data. Give me a bookingId to pass to my rest call.
        localStorage.setItem("StartDate",this.state.startDate)
        localStorage.setItem("endDate",this.state.endDate)
        localStorage.setItem("currentPropertyId",id)
        localStorage.setItem("currentPropertyName",name)
        localStorage.setItem("currentPropertyOwner",owner)
        this.setState({
            flag : true,
        })
        
    }

    render(){
        require('./searchresults.css');

        let redirectvar = null;
        // if( cookie.load('cookieT')!="traveler"){
        //     redirectvar = <Redirect to= "/homepage"/>
        // }

        if(!localStorage.getItem("userId")){
            redirectvar = <Redirect to= "/homepage"/>
        }
        if(this.state.flag){
            redirectvar = <Redirect to= "/payment"/>
        }

        let displayImage = null;
        let reviews = null;
        let view = null;
        if(this.state.information.length>0)
        {
            view = this.state.information.map(property => {
                    console.log(property.Image)
                    if(!property.Image)
                    {
                        
                        displayImage = (
                            <div>
                                {/* <img src = {this.state.encodedImage[0]} height="200" width="300"/> &nbsp;&nbsp;
                                <img src = {this.state.encodedImage[1]} height="200" width="300"/> &nbsp;&nbsp;
                                <img src = {this.state.encodedImage[2]} height="200" width="300"/> &nbsp;&nbsp; */}

                                <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
                                    <div class="carousel-inner">
                                        <div class="carousel-item active">
                                            <img src = "http://dwz5dvieyr9hn.cloudfront.net/airbnb.png" height="300" width="420"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    else if(property.Image)
                    {
                        displayImage = (
                            <div>
                                {/* <img src = {this.state.encodedImage[3]} height="200" width="300"/> &nbsp;&nbsp;
                                <img src = {this.state.encodedImage[4]} height="200" width="300"/> &nbsp;&nbsp;
                                <img src = {this.state.encodedImage[5]} height="200" width="300"/> &nbsp;&nbsp; */}
                            
                                <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
                                    <div class="carousel-inner">
                                        <div class="carousel-item active">
                                            <img src = {property.Image} height="300" width="420"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                
                    reviews = property.Reviews.map(review => {
                        return(
                            <div>
                                <p class="text-left text-dark bg-light">{review.Comment}</p>
                                <p class="text-right font-weight-light">Posted by: {review.TravelerName}</p>
                                <br></br>
                            </div>
                        )
                    })
                return(
                    <div>
                    <div class="property_detials">
                        <div class="row">
                            <div class="col-md-5">
                                {displayImage} 
                            </div>
                            <div class="col-md-7 right-side">
                                <h3>{property.Name}</h3><br></br>
                                <p class="info">{property.Address}, {property.City}, {property.State}, {property.Zipcode}, {property.Country}</p>
                                <p class="info">{property.PropertyType} - Bedrooms : {property.Bedrooms}, Bathrooms : {property.Bathrooms}, Accomodates : {property.Accomodates}</p>
                                <p class="price">$ {property.Tariff} per night</p>
                                <hr></hr>
                                <h4><b>Reviews</b></h4><br></br>
                                <p class="info">{reviews}</p>
                                <hr></hr>
                                <button class="btn btn-primary book-button" onClick = {() => {this.BookProperty(property.PropertyID)}} name="BookButton" value={property.PropertyID}>
                                    <span>Book</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <hr></hr>
                    </div>
                )
            })
        }
        else
        {
            view = (
                    <div class="property_detials">
                        <h3>No matches found !</h3>
                    </div>
                );
        }

        return(
            <div>
                {redirectvar}
                <div id="navbardiv">

                    <nav class="navbar navbar-default navbar-expand-sm" id="nav">
                        <div class="container-fluid">
                            <div class="navbar-header">
                                    <a href="/homepage" class="navbar-brand">
                                        <p class="heading1">Airbnb</p>
                                    </a>
                            </div>

                            <div>
                                <ul class="nav navbar-nav navbar-right" id="ulist">
                                    <li class="items"><a href="#" class="nav-item mainlinks1"> TripBoards </a></li>

                                    <li class="dropdown items">
                                        <a href="#" class="dropdown-toggle mainlinks1" data-toggle="dropdown"> {this.state.setUsername} <span class="caret"></span></a>
                                        <ul class="dropdown-menu dropdown-menu-right mymenu">
                                            <li class="listitems"><a class="dropdown-item menulinks1" href="#" role="menu">Inbox</a></li>
                                            <li class="listitems"><a class="dropdown-item menulinks1" href="/travelertrips" role="menu">My trips</a></li>
                                            <li class="listitems"><a class="dropdown-item menulinks1" href="/travelerprofile" role="menu">My profile</a></li>
                                            <li class="listitems"><a class="dropdown-item menulinks1" href="#" role="menu">Account</a></li>
                                            <li class="listitems"><Link to="/homepage" onClick = {this.handleLogout} class="dropdown-item menulinks1" role="menu">Logout</Link></li>
                                        </ul>
                                    </li>

                                    <li class="dropdown items">
                                        <a href="#" class="dropdown-toggle mainlinks1" data-toggle="dropdown"> Help <span class="caret"></span></a>
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

                <div id="mainbody">
                    <div class="container main-content">
                        <br></br>
                        {view}
                    </div>     
                </div>

            </div>
        )
    }
}

export default searchresults;