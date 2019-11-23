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
import swal from 'sweetalert';
import {DASHBOARD_URL} from '../../constants/constants'
import {PROPERTY_URL} from '../../constants/constants'

class photos extends Component
{
    constructor(props){
        super(props);
        this.state = {
            saveflag : false,
            backflag : false,
            selectedFile : null,
            no_of_images : '',
            filenames : '',
            flag:false
        }

        this.SubmitButton = this.SubmitButton.bind(this);
        this.BackButton = this.BackButton.bind(this);
        this.fileChangeHandler = this.fileChangeHandler.bind(this);
    }

    SubmitButton = (e) => {

        console.log("After pressing SAVE button")

        console.log("this.state.selectedFile");
        console.log(this.state.selectedFile);


        const data = {
                Country:localStorage.getItem("country"),
                OwnerID:localStorage.getItem("userId"),
                Address:localStorage.getItem("address"),
                City:localStorage.getItem("city"),
                State:localStorage.getItem("state"),
                Zipcode:localStorage.getItem("zipcode"),
                Name:localStorage.getItem("propertyname"),
                PropertyType:localStorage.getItem("propertytype"),
                Bedrooms:parseInt(localStorage.getItem("bedrooms")),
                Bathrooms:parseInt(localStorage.getItem("bathrooms")),
                Accomodates:parseInt(localStorage.getItem("accomodates")),
                StartDate:localStorage.getItem("availableStart"),
                EndDate:localStorage.getItem("availableEnd"),
                Tariff:parseInt(localStorage.getItem("pricePerNight"))
        }

        swal({
            title: 'Property being posted',
            text: 'Please Wait',
            button: false
          })

        axios.post(`${PROPERTY_URL}/`,data)
            .then(response => {
                if(response.status === 200){
                    var propertyId = response.data
                    let formData = new FormData();
                    formData.append('jpg', this.state.selectedFile);
                    axios.post(`${PROPERTY_URL}/upload/${propertyId}`,formData)
                        .then(response2 => {
                            if(response2.status === 200){
                                console.log("Property Posted Successfully")
                                this.setState({
                                    flag:true
                                })
                                swal("Congratulations", "Property posted successfully", "success");
                                localStorage.removeItem("country")
                                localStorage.removeItem("address")
                                localStorage.removeItem("city")
                                localStorage.removeItem("state")
                                localStorage.removeItem("zipcode")
                                localStorage.removeItem("propertyname")
                                localStorage.removeItem("propertytype")
                                localStorage.removeItem("bedrooms")
                                localStorage.removeItem("bathrooms")
                                localStorage.removeItem("accomodates")
                                localStorage.removeItem("availableStart")
                                localStorage.removeItem("availableEnd")
                                localStorage.removeItem("pricePerNight")
                            }
                        })
                        //#TODO:
                        //For Kavina:
                        // access propertyId that is initialized above and add it to the owner's dashboard. 
                        
                        //updating the owner dashboard database and adding this property under the owner
                        const owner_update_data = {
                            "OwnerId" : localStorage.getItem("userId"),
                            "PropertyId" : propertyId
                        }
                        axios.put(`${DASHBOARD_URL}/ownerupdateproperty`, owner_update_data)
                            .then((response3) => {
                                console.log("Response from Dashboard backend api : " + response3.data)
                            })
                }
            })
        // let formData = new FormData();

        // console.log("Total image file uploaded : "+this.state.no_of_images);

        // for(let i=0;i<this.state.no_of_images;i++){
        //     formData.append('selectedFile', this.state.selectedFile[i]);
        //     formData.append('fileName', this.state.filenames[i]);
        // }

        // console.log(formData);

        // e.preventDefault();
        // axios.defaults.withCredentials = true;
        // axios.post('http://localhost:3001/listproperty/photos', formData)
        //   .then((result) => {
        //         console.log("Result : "+result);
        //         axios.post('http://localhost:3001/listproperty/photos/'+this.state.filenames)
        //             .then(response => {
        //                 console.log("Inside the second route")
        //                 console.log("Response obtained is : ")
        //                 // console.log(response.data);
        //                 localStorage.setItem('imagefiles',response.data);
        //                 console.log("Checking local storage")
        //                 console.log(localStorage.getItem('imagefiles'))
        //         });
        //   });

        // this.setState({
        //     saveflag : true
        // })
    }

    BackButton = (e) => {
        this.setState({
            backflag : true
        })
    }

    fileChangeHandler(e){

        console.log("Event target files : \n");
        console.log(e.target.files[0]);
        this.setState({
            selectedFile : e.target.files[0]
        })

        // const leng = e.target.files.length
        // console.log("No of images : "+leng);

        // // console.log("Printing the file names : ")
        // let filenames = []
        // for(let j=0;j<leng;j++)
        // {
        //     filenames.push(e.target.files[j].name)
        //     // console.log(e.target.files[j].name);
        // }

        // this.setState({
        //     filenames
        // })

        // setTimeout(() => {
        //     console.log("this.state.filenames : ")
        //     console.log(this.state.filenames);
        // }, 200);

        // let selectedFile =[]
        // for(let i=0;i<leng;i++)
        // {
        //     console.log("i : "+i);
        //     console.log(e.target.files[i]);
        //     selectedFile.push(e.target.files[i])
        //     // this.setState({
        //     //     // selectedFile:[...this.state.selectedFile, e.target.files[i]]
        //     //     selectedFile : this.state.selectedFile.concat(e.target.files[i])
        //     //     // selectedFile.push(e.target.files)
        //     // })
        // }
        
        // this.setState({
        //     selectedFile
        // })

        // setTimeout(() => {
        //     console.log("this.state.selectedFile : ")
        //     console.log(this.state.selectedFile);
        // }, 200);

    } 

    render(){
        require('./photos.css');
        let redirectvar = null;
        let uploadForm = null;
        if(this.state.saveflag){
            redirectvar = <Redirect to= "/listproperty/price"/>
        }
        if(this.state.backflag){
            redirectvar = <Redirect to= "/listproperty/details"/>
        }
        //FIXME:
        if(localStorage.getItem("type")=="traveller")
        {
            redirectvar = <Redirect to= "/homepage"/>
        }else if(!localStorage.getItem("userId")){
            alert("Not logged in!!!")
            redirectvar = <Redirect to="/ownerlogin"/>
        }

        if(this.state.flag){
            redirectvar = <Redirect to ="/listproperty/ownerdashboard"/>
        }

        if(this.state.selectedFile){
            uploadForm = <div class="text-center photouploadbox">
                <form>
                    <label class="file-upload-button">
                        Photo Selected
                    </label>
                </form>
            </div>
        }else{
            uploadForm = <div class="text-center photouploadbox">
                <form>
                    <label class="file-upload-button">
                        Select photos to upload
                        <input type="file" id="filename" name="selectedFile" onChange = {this.fileChangeHandler}/><br/>
                    </label>
                </form>
            </div>
        }
        return(
            <div>
                {redirectvar}
                <div id="mainbody" class="row">

                    <SideNavbar/>

                    <div class="col-md-8 rightsidecontent">
                        <div class="container">
                            <div class="formbody">
                                <br/>
                                <h3 class="heading4">Add photos of your property</h3><hr/>
                                <p class="text">
                                    Showcase your property’s best features (no pets or people, please).
                                </p>
                                <div class="text-center photouploadbox">
                                    {/* {<form>
                                    <label class="file-upload-button">
                                        Select photos to upload
                                        <input type="file" id="filename" name="selectedFile" onChange = {this.fileChangeHandler}/><br/>
                                    </label>
                                    </form>} */}
                                    {uploadForm}
                                </div>
                                <center>    
                                    <button class="btn btn-primary save-button" onClick={this.BackButton}>
                                        <span>Back</span>
                                    </button>
                                    <button class="btn btn-primary save-button" onClick={this.SubmitButton}>
                                        <span>Submit</span>
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

export default photos;