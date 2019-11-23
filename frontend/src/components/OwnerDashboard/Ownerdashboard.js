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
import {DASHBOARD_URL} from '../../constants/constants';
import {PROPERTY_URL} from '../../constants/constants';
import {BOOKING_URL} from '../../constants/constants';
const fs = require('fs');


class Ownerdashboard extends Component
{
    constructor(props){
        super(props);
        this.state = {
            information : [],
            no_of_properties : 0,
            property_information : [],
            setUserid : localStorage.getItem('userId') 
        }
    }

    componentDidMount(){
        // axios.defaults.withCredentials = true;
        axios.get(`${DASHBOARD_URL}/travelerprofile/` + this.state.setUserid)
                .then((response) => {
                    console.log("Inside get request for ownerdashboard ");
                    console.log(response.data);
                    console.log("Response data length in data information: "+response.data);
                    this.setState({
                        information : response.data,
                        no_of_properties : response.data.PropertyId.length
                    })
                    if(response.data.PropertyId)
                    {
                        // api calls for all the properties for this owner
                        var all_properties = []
                        // TODO FOR DARSHIL
                        // update the URL below based on the backend route for getting property details for a property id
                        for(let i=0; i<response.data.PropertyId.length; i++){
                            axios.get(`${PROPERTY_URL}/find/` + response.data.PropertyId[0])
                                .then((res) => {
                                    console.log("Got the details of the property : " + JSON.stringify(res.data))
                                    all_properties.push(res.data)
                                    this.setState({
                                        property_information : all_properties
                                    })
                                })
                                .catch((err) => {
                                    console.log("Some error occured : \n" + err)
                                })
                        }
                        console.log("All properties are: ",all_properties)
                        
                    }
            });
    }

    render(){
        require('./Ownerdashboard.css');
        let redirectvar = null;
        let view = null;
        let bookings_view = null;
        let displayImage = null;
        if( !localStorage.getItem("userId") )
        {
            redirectvar = <Redirect to= "/homepage"/>
        }
        // console.log("========> this.state.information.PropertyId : " + JSON.stringify(this.state.information.PropertyId))
        console.log(this.state.property_information)
        if(this.state.no_of_properties > 0)
        {
            view = this.state.property_information.map(property => {
                // TODO : see how Bookings array is stored in the property object
                if(property.bookings > 0){
                    bookings_view = property.Bookings.map(booking => {
                        return (
                            <div>
                                <div class="property_detials">
                                    <p>Booked by - {booking.TravelerId}</p>
                                </div>
                            </div>
                        )
                    })
                }
                else {
                    bookings_view = (
                        <div class="property_detials">
                            <p>Nobody has booked this property yet !!</p>
                        </div>
                    );
                }
                if(!property.image)
                    { 
                        displayImage = (
                            <div>
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
                else if(property.image)
                {
                    displayImage = (
                        <div>                            
                            <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
                                <div class="carousel-inner">
                                    <div class="carousel-item active">
                                        <img src = {property.image} height="300" width="420"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
                return(
                    <div>
                    <div class="property_detials">
                    <div class="row">
                        <div class="col-md-5">
                            {displayImage} 
                        </div>
                        <div class="col-md-7 right-side">
                            <h3>{property.name}</h3>
                            <p><u>Location </u> : {property.address}, {property.city}, {property.state}, {property.zipcode}, {property.country}</p>
                            <p><u>Property type</u> : {property.propertytype}</p>
                            <p><u>Bedrooms</u> : {property.bedrooms}, <u>Bathrooms</u> : {property.bathrooms}, <u>Accomodates</u> : {property.accomodates}</p>
                            <p><u>Available from</u>: {property.startdate}</p>
                            <p><u>Available to</u>: {property.enddate}</p>
                            <p><u>Rate</u>: ${property.tariff}</p>
                            <p>{bookings_view}</p>
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
                        <h3>No property added yet !</h3>
                    </div>
                );
        }

        return(
            <div>
                {redirectvar}
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

export default Ownerdashboard;