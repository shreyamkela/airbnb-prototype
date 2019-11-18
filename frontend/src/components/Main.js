import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import travelerlogin from './TravelerLogin/travelerlogin';
import ownerlogin from './OwnerLogin/ownerlogin';
import travelersignup from './TravelerSignUp/travelersignup';
import ownersignup from './OwnerSignUp/ownersignup';
import listproperty from './ListProeprty/listproperty';
import Homepage from './HomePage/Homepage';
import travelertrips from './TravelerTrips/travelertrips';
import travelerprofile from './TravelerProfile/travelerprofile';
import searchresults from './TravelerSearchResults/searchresults';
import Location from './ListPropertyLocation/Location';
import Details from './ListPropertyDetails/Details';
import photos from './ListPropertyPhotos/photos';
import price from './ListPropertyPrice/price';
import OwnerNavBar from './OwnerNavbar';
import Ownerdashboard from './OwnerDashboard/Ownerdashboard';

class Main extends Component {
    render(){
        return(
            <div>
                <Route path="/homepage" component={Homepage}/>
                <Route path="/travelerlogin" component={travelerlogin}/>
                <Route path="/ownerlogin" component={ownerlogin}/>
                <Route path="/travelersignup" component={travelersignup}/>
                <Route path="/ownersignup" component={ownersignup}/>
                <Route path="/listproperty" component={OwnerNavBar}/>
                <Route path="/listproperty/welcome" component={listproperty}/>
                <Route path="/listproperty/location" component={Location}/>
                <Route path="/listproperty/details" component={Details}/>
                <Route path="/listproperty/photos" component={photos}/>
                <Route path="/listproperty/price" component={price}/>
                <Route path="/listproperty/ownerdashboard" component={Ownerdashboard}/>
                <Route path="/travelertrips" component={travelertrips}/>
                <Route path="/travelerprofile" component={travelerprofile}/>
                <Route path="/searchresults" component={searchresults}/>
            </div>
        )
    }
}

export default Main;