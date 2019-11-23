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
import {DASHBOARD_URL, PROPERTY_URL} from '../../constants/constants';
import {BOOKING_URL} from '../../constants/constants';
// import '../../App.css';

class travelertrips extends Component 
{
    constructor(props){
        super(props);
        this.state={
            flag : false,
            setUsername : localStorage.getItem('firstname'),
            setUserid : localStorage.getItem('userId'),
            information : [], 
            no_of_booking : 0,
            booking_information : [],
            comment : {},
        }

        this.handleLogout = this.handleLogout.bind(this);
        this.ReviewBooking = this.ReviewBooking.bind(this);
        this.ChangeHandler = this.ChangeHandler.bind(this);
    }

    componentDidMount(){
        // axios.defaults.withCredentials = true;
        axios.get(`${DASHBOARD_URL}/travelerprofile/` + this.state.setUserid)
                .then((response) => {
                    console.log("Printing the response data : ");
                    console.log(response.data);
                    this.setState({
                        information: response.data,
                        no_of_booking : response.data.BookingId.length
                    })
                    if(response.data.BookingId.length > 0)
                    {
                        var all_bookings = []
                        for(let i=0;i<response.data.BookingId.length;i++)
                        {
                            //TODO FOR VINAY
                            // update the URL here below according to the backend route
                            console.log("Have to fetch the booking details of the booking id : " + response.data.BookingId[i])
                            axios.get(`${BOOKING_URL}/Booking/` + response.data.BookingId[i])
                                .then((response1) => {
                                    console.log("Got the details of the booking " + response.Id)
                                    all_bookings.push(response1.data)
                                    this.setState({
                                        booking_information : all_bookings
                                    })
                                })
                                .catch((err) => {
                                    console.log("Some error occured \n" + err)
                                })
                        }
                        
                    }
                })
                .catch((err) => {
                    console.log("Some error occured \n" + err)
                })
        }

    handleLogout = () => {
        // cookie.remove('cookieT', { path: '/' })
        sessionStorage.removeItem('SessionEmail');
        sessionStorage.removeItem('SessionUsername');
        localStorage.clear();
    }

    ChangeHandler(e, booking_id) {
        console.log("Booking id : " + booking_id)
        let existing_comments = this.state.comment
        let new_comment = e.target.value
        existing_comments[booking_id] = new_comment
        this.setState({
            comment : existing_comments
        })
    }

    ReviewBooking = (property_id, booking_id) => {
        console.log("Review button pressed for booking id : " + booking_id)
        console.log("Posting a comment for the review : " + property_id)
        console.log("New comment to add to the database : " + this.state.comment[booking_id])
        console.log("Printing the state variable change : " + JSON.stringify(this.state.comment))

        var propertyId = property_id
        var bookingId = booking_id
        var comment = this.state.comment[booking_id]

        // TODO : DARSHIL
        // make an api call to the property database for updating this comment under this property_id
        const data = {
            TravelerName : localStorage.getItem("firstname"),
            Comment : comment
        }
        axios.post(`${PROPERTY_URL}/review/${propertyId}`,data)
            .then(response => {
                if(response.status===200){
                    // TODO : VINAY
                    // make an api call to the booking database and add this comment under this booking_id
                    const data1={
                        Id:bookingId,
                        Comment:data.Comment
                    }
                    axios.put(`${BOOKING_URL}/BookingReview`,data1)
                    .then(response => {
                        if(response.status===200){
                            window.location.reload();
                        }
                        else{
                            console.log("Adding review to Booking failed")
                        }
                    })    
                }
                else{
                    console.log("Adding review to property failed")
                }
            })
    }

    render(){
        require('./travelertrips.css');
        let redirectvar = null;
        let view = null;
        let review_button = null;
        if( !localStorage.getItem("userId") )
        {
            redirectvar = <Redirect to= "/homepage"/>
        }
        if(this.state.no_of_booking>0){
            view = this.state.booking_information.map(booking => {
                var booking_comment = booking.Comment
                if(booking_comment == null || booking_comment == "") {
                    booking_comment = "Enter your comment here ......"
                    review_button = (
                        <button type="button" class="btn btn-primary book-button" onClick = {() => {this.ReviewBooking(booking.Property_id, booking.Id)}} name="ReviewButton" >
                            <span>Review this booking</span>
                        </button>
                    );
                }
                else {
                    review_button = (
                        <button type="button" class="btn btn-primary book-button" name="ReviewButton" disabled>
                            <span>Review this booking</span>
                        </button>
                    );
                }
                return(
                    <div>
                    <div class="property_detials">
                        <h3>Booked the property : {booking.Property_name}</h3>
                        {/* <p>{property.address}, {property.city}, {property.state}, {property.zipcode}, {property.country}</p> */}
                        {/* <p>{property.propertyType} - Bedrooms : {property.bedrooms}, Bathrooms : {property.bathrooms}</p> */}
                        <p>Booking from <b>{booking.From}</b> to <b>{booking.To}</b></p>
                        {/* <p>You paid $ <b>{property.pricePerNight}</b> per night </p> */}
                        {/* <p>Property owner : {property.ownerEmail}</p> */}
                        <br></br>
                        <input onChange = {(e) => this.ChangeHandler(e, booking.Id)} id="comment" name="comment" class="form-control" type="text" size="50" placeholder={booking_comment}/>
                        {review_button}
                    </div>
                    <hr></hr>
                    </div>
                )
            })
        }
        else{
            view = (
                <div class="property_detials">
                    <h3>No trips scheduled yet !!</h3>
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
                    <h2 class="header1">My trips</h2><hr></hr>
                        <br></br>
                        {view}
                    </div>     
                </div>
        </div>
        )
    }
}

export default travelertrips;