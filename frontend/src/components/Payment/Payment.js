import React, { Component } from 'react';
import { Link, Redirect } from "react-router-dom";
import Axios from 'axios';
// import url from '../../config/config';
// import './Payment.css'
import { BOOKING_URL, PROPERTY_URL, DASHBOARD_URL } from '../../constants/constants';

class Payment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            From: localStorage.getItem("StartDate"),
            To: localStorage.getItem("endDate"),
            property_id: localStorage.getItem("currentPropertyId"),
            property_name: localStorage.getItem("currentPropertyName"),
            owner_id: localStorage.getItem("currentPropertyOwner"),
            traveller_id: localStorage.getItem("userId"),
        }
    }

    componentDidMount = async (e) => {
        console.log(this.state)
    }

    makePayment = (e) => {
        e.preventDefault();
        const data = {
            From: this.state.From,
            To: this.state.To,
            property_id: this.state.property_id,
            property_name: this.state.property_name,
            traveller_id: this.state.traveller_id,
            owner_id: this.state.owner_id
        }
        console.log(data)
        Axios.post(BOOKING_URL + `/Booking`, data)
            .then((response) => {
                console.log("response", response.data);
                alert("Payment Successful")

                const data = {
                    StartDate: this.state.From,
                    EndDate: this.state.To,
                    BookingID: response.data,
                    TravelerName: localStorage.getItem("firstname")
                }


                Axios.post(`${PROPERTY_URL}/${this.state.property_id}/book`, data)
                    .then(response => {
                        console.log("Status Code : ", response.status);
                        if (response.status === 200) {
                            const data1 = {
                                BookingId: data.BookingID,
                                TravelerId: this.state.traveller_id
                            }
                            Axios.put(`${DASHBOARD_URL}/travelerupdatebooking`, data1)
                                .then(response => {
                                    console.log("Status Code : ", response.status);
                                    if (response.status === 200) {
                                        alert("Congrats, you have booked this property !!!");
                                    }
                                    else {
                                        this.setState({
                                            flag: false
                                        })
                                    }
                                })
                                .catch(err => {
                                    alert("Cannot book property due to some error");
                                });
                        }
                        else {
                            this.setState({
                                flag: false
                            })
                        }
                    })
                    .catch(err => {
                        alert("Cannot book property due to some error");
                    });
            })
            .catch((err) => {
                console.log(err);
                // alert(err.response.data);
            })


        this.setState({
            redirectVar: <Redirect to="/homepage"></Redirect>
        })
    }

    render() {
        // require('./Payment.css');
        return (
            <div className="">
                <center>
                    {this.state.redirectVar}
                    {/* PAYMENT CARD START */}
                    <form class="payment container">
                        <div className="col-sm-6 formContainer" style={{ margin: "25px" }}>
                            <div class="panel panel-default credit-card-box">
                                <div class="panel-heading display-table">
                                    <div class="row display-tr">
                                        <h3 class="panel-title display-td">Payment Details</h3>
                                        <img class="img-responsive pull-right" src="http://i76.imgup.net/accepted_c22e0.png" />
                                    </div>
                                </div>
                            </div>
                            <div className="row justify-content-center">
                                <label className="col-sm-2">Price</label>
                                <input className="form-control col-sm-4" type="text" name="price" value={this.state.regFee} disabled></input>
                            </div>
                            <div className="row justify-content-center">
                                <label className="col-sm-2" >Discount</label>
                                <input className="form-control col-sm-4" type="text" name="discount" value={this.state.discount} disabled></input>
                            </div>
                            <div className="row justify-content-center">
                                <label className="col-sm-2" >Total</label>
                                <input className="form-control col-sm-4" type="text" name="finalValue" value={this.state.regFee * (1 - this.state.discount / 100)} disabled></input>
                            </div>
                            <div className="row justify-content-right">
                                <label for="cardNumber" className="col-sm-4">CARD NUMBER</label>
                                <input type="number" maxlength="16" className="form-control col-sm-8" name="cardNumber" placeholder="Valid Card Number" autocomplete="cc-number" required autofocus />
                            </div>

                            <div className="row justify-content-right">
                                <label for="cardNumber" className="col-sm-4">EXPIRATION DATE</label>
                                <input type="date" maxlength="5" class="form-control col-sm-8" name="cardExpiry" placeholder="MM / YY" autocomplete="cc-exp" required />
                            </div>
                            <div className="row justify-content-right">
                                <label for="cardNumber" className="col-sm-4">CVV</label>
                                <input type="number" maxlength="3" class="form-contro col-sm-8" name="cardCVC" placeholder="CVV" autocomplete="cc-csc" required />
                            </div>
                            <div className="row justify-content-center">
                                <button className="form_element btn btn-success" name="pay" onClick={this.makePayment} >Make payment</button>
                            </div>
                        </div>

                    </form>
                    {/* PAYMENT CARD END */}

                </center>
            </div>
        );
    }
}

export default Payment;