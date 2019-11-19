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
import Location from '../ListPropertyLocation/Location';
// require('../ListPropertyDetails/Details');
// require('../ListPropertyLocation/Location');

class price extends Component
{
    constructor(props){
        super(props);
        this.state = {
            submitflag : false,
            backflag : false,
            saveflag: false,
            availableStart : "",
            availableEnd : "",
            pricePerNight : ""
        }

        this.ChangeHandler = this.ChangeHandler.bind(this);
        this.SaveButton = this.SaveButton.bind(this);
        this.BacktButton = this.BackButton.bind(this);
    }

    componentDidMount(){
        this.setState({
            availableStart : localStorage.getItem("availableStart"),
            availableEnd : localStorage.getItem("availableEnd"),
            pricePerNight : localStorage.getItem("pricePerNight")
        })
    }

    ChangeHandler(e) {
        let change = {}
        change[e.target.name] = e.target.value
        this.setState(change)
    }


    SaveButton = (e) => {
        if(this.state.availableStart!="" && this.state.availableEnd!="" && this.state.pricePerNight!="")
        {
            var newDate = new Date(this.state.availableStart)
            // console.log("Converted Date is: ",newDate)
            var year = newDate.getFullYear();
            var month = newDate.getMonth()+1;
            var day = newDate.getDate()+1;
            if(month<10)
                month = "0"+month;
            if(day<10)
                day = "0"+day;
            var stringStartDate = year + "-" + month + "-" + day;
            newDate = new Date(this.state.availableEnd);
            year = newDate.getFullYear();
            month = newDate.getMonth()+1;
            day = newDate.getDate()+1;
            if(month<10)
                month = "0"+month;
            if(day<10)
                day = "0"+day;
            var stringEndDate = year + "-" + month + "-" + day;
            localStorage.setItem('availableStart', stringStartDate);
            localStorage.setItem('availableEnd', stringEndDate);
            localStorage.setItem('pricePerNight', this.state.pricePerNight);
        }
        this.setState({
            saveflag : true
        })
    }
    // SubmitButton = (e) => {

    //     if(this.state.availableStart!="" && this.state.availableEnd!="" && this.state.pricePerNight!="")
    //     {
    //         localStorage.setItem('availableStart', this.state.availableStart);
    //         localStorage.setItem('availableEnd', this.state.availableEnd);
    //         localStorage.setItem('pricePerNight', this.state.pricePerNight);
            
    //         var headers = new Headers();
    //         e.preventDefault();

    //         const data = {
    //             country : localStorage.getItem('country'),
    //             address : localStorage.getItem('address'),
    //             city : localStorage.getItem('city'),
    //             state : localStorage.getItem('state'),
    //             zipcode : localStorage.getItem('zipcode'),
    //             propertyname : localStorage.getItem('propertyname'),
    //             propertydesc : localStorage.getItem('propertydesc'),
    //             propertytype : localStorage.getItem('propertytype'),
    //             bedrooms : localStorage.getItem('bedrooms'),
    //             bathrooms : localStorage.getItem('bathrooms'),
    //             accomodates : localStorage.getItem('accomodates'),
    //             imagefiles : localStorage.getItem('imagefiles'),
    //             availableStart : this.state.availableStart,
    //             availableEnd : this.state.availableEnd,
    //             pricePerNight : this.state.pricePerNight,
    //         }

    //         console.log("Printing the property data that is sent : \n"+JSON.stringify(data));
    //         axios.defaults.withCredentials = true;

    //         axios.post('http://localhost:3001/listproperty/price',data)
    //             .then(response => {
    //                 console.log("Status Code : ",response.status);
    //                 if(response.status === 200){
    //                     this.setState({
    //                         saveflag : true,
    //                     })
    //                     alert(response.data);

    //                     localStorage.clear();
    //                 }
    //                 else{
    //                     this.setState({
    //                         saveflag : false
    //                     })
    //                 }
    //             })
    //             .catch(err =>{
    //                 alert("Invalid input data !!");
    //             });
    //     }

    // }

    BackButton = (e) => {
        this.setState({
            backflag : true
        })
    }

    render(){
        require('./price.css');
        let redirectvar = null;
        let errormessage = null;
        if(this.state.saveflag) 
        {
            if(this.state.availableStart=="" || this.state.availableEnd=="" || this.state.pricePerNight=="")
            {
                    errormessage = (
                        <div class="alert alert-danger">
                            None of the field should be empty !!!
                        </div>
                    )
            }
            else {
                redirectvar = <Redirect to= "/listproperty/photos"/>
            }
        }
        if(this.state.backflag){
            redirectvar = <Redirect to= "/listproperty/details"/>
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
                                <br/><br/>
                                {errormessage}
                                <div class="form-group">
                                    <label class="lbl">Available start date : </label>
                                    <input onChange = {this.ChangeHandler} type = "date" class="datestyle" id="availableStart" name="availableStart"/>
                                </div><br/>
                                <div class="form-group">
                                    <label class="lbl">Available end date :&nbsp;</label>
                                    <input onChange = {this.ChangeHandler} type = "date" class="datestyle" id="availableEnd" name="availableEnd"/>
                                </div><br/>
                                <div class="form-group">
                                    <label class="lbl">Nightly base rate : &nbsp;&nbsp; </label> 
                                    <input onChange = {this.ChangeHandler} id="pricePerNight" name="pricePerNight" class="pricefield" type="number" placeholder=" $"/>
                                </div>
                                <br/><br/>  
                                <center>
                                    <button class="btn btn-primary submit-button" onClick={this.BackButton}>
                                        <span>Back</span>
                                    </button>
                                    <button class="btn btn-primary submit-button" onClick={this.SaveButton}>
                                        <span>Save</span>
                                    </button>
                                </center> 
                                <br/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default price;