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
import SideNavbar from '../SideNavbar';
const fs = require('fs');


class Ownerdashboard extends Component
{
    constructor(props){
        super(props);
        this.state = {
            information : [],
            no_of_properties : 0,
            property_information : [],
            setUserid : localStorage.getItem('setUserid') 
        }
    }

    componentDidMount(){
        // axios.defaults.withCredentials = true;
        axios.get(`${DASHBOARD_URL}/travelerprofile/` + this.state.setUserid)
                .then((response) => {
                    console.log("Inside get request for ownerdashboard ");
                    console.log(response.data);
                    console.log("Response data length in data information: "+response.data.length);
                    this.setState({
                        information : response.data,
                        no_of_properties : response.data.PropertyId.length
                    })
                    if(response.data.PropertyId.length > 0)
                    {
                        // api calls for all the properties for this owner
                        var all_properties = []
                        for(let i=0; i<response.data.PropertyId.length; i++){
                            axios.get(`${PROPERTY_URL}/owner/` + response.data.PropertyId[0])
                                .then((res) => {
                                    console.log("Got the details of the property : " + res.data.Name)
                                    all_properties.push(res.data)
                                })
                                .catch((err) => {
                                    console.log("Some error occured : \n" + err)
                                })
                        }
                        this.setState({
                            property_information : all_properties
                        })
                    }
            });
    }

    render(){
        require('./Ownerdashboard.css');
        let redirectvar = null;
        let view = null;
        let bookings_view = null;
        // console.log("========> this.state.information.PropertyId : " + JSON.stringify(this.state.information.PropertyId))
        if(this.state.no_of_properties > 0)
        {
            view = this.state.property_information.map(property => {
                // TODO : see how Bookings array is stored in the property object
                if(property.Bookings > 0){
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
                return(
                    <div>
                    <div class="property_detials">
                        <h3>{property.Name}</h3>
                        <p><u>Location </u> : {property.Address}, {property.City}, {property.State}, {property.Zipcode}, {property.Country}</p>
                        <p><u>Property type</u> : {property.PropertyType}</p>
                        <p>Bedrooms : {property.Bedrooms}, Bathrooms : {property.Bathrooms}, Accomodates : {property.Accomodates}</p>
                        <p>Rate : ${property.Tariff}</p>
                        <p>{bookings_view}</p>
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