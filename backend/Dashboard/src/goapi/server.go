package main

import (
	"fmt"
	"log"
	"net/http"
	"encoding/json" 
	"github.com/codegangsta/negroni"
	"github.com/rs/cors"
	"github.com/gorilla/mux"
	"github.com/unrolled/render"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
) 

// Mongodb config
var mongodb_server = "127.0.0.1:27017"
var mongodb_database = "cmpe281_airbnb"
var mongodb_collection_dashboard = "user_dashboard"

func NewServer() *negroni.Negroni {
	formatter := render.New(render.Options{
		IndentJSON: true,
	})
	corsObj := cors.New(cors.Options{
        AllowedOrigins: []string{"*"},
        AllowedMethods: []string{"POST", "GET", "OPTIONS", "PUT", "DELETE"},
        AllowedHeaders: []string{"Accept", "content-type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization"},
	})
	n := negroni.Classic()
	mx := mux.NewRouter()
	initRoutes(mx, formatter)
	n.Use(corsObj)
	n.UseHandler(mx)
	return n
}

func initRoutes(mx *mux.Router, formatter *render.Render) {
	mx.HandleFunc("/ping", pingHandler(formatter)).Methods("GET")
	mx.HandleFunc("/travelerprofile/{id}", travelerProfileGetHandler(formatter)).Methods("GET")
	mx.HandleFunc("/travelerprofile", travelerProfileUpdateHandler(formatter)).Methods("POST")
}

func setupResponse(w *http.ResponseWriter, req *http.Request) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
    (*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS")
    (*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}

// API Ping Handler (GET call)
func pingHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		formatter.JSON(w, http.StatusOK, struct{ Test string }{"API version 1.0 alive!"})
	}
}

// API to view a traveler's profile based on the id
func travelerProfileGetHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		params := mux.Vars(req)
		var user_id string = params["id"]
		fmt.Println("User ID: ", user_id)
		session, err := mgo.Dial(mongodb_server)
		if err != nil {
			fmt.Println("Not able to connect to the mongo server")
			panic(err)
		}
		defer session.Close()
		session.SetMode(mgo.Monotonic, true)
		c := session.DB(mongodb_database).C(mongodb_collection_dashboard)
		var result User_details
		err = c.Find(bson.M{"userid" : user_id}).One(&result)
		if err != nil {
			fmt.Println("Some error occured while getting the user details of the user : ",user_id)
			fmt.Println(err)
		}
		fmt.Println("User data:", result)
		formatter.JSON(w, http.StatusOK, result)
	}
}

// API to update a user's profile details
func travelerProfileUpdateHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		var user_details User_details
		_ = json.NewDecoder(req.Body).Decode(&user_details)	
		fmt.Println("\n------------ User details coming from frontend : \n",user_details)
		// params := mux.Vars(req)
		var user_id string = user_details.UserId
		fmt.Println( "Update request for user ID: ", user_details.UserId )
		session, err := mgo.Dial(mongodb_server)
        if err != nil {
				fmt.Println("Some error occured while connecting to the mongo server")
                panic(err)
        }
		defer session.Close()
		session.SetMode(mgo.Monotonic, true)
		c := session.DB(mongodb_database).C(mongodb_collection_dashboard)
		filter := bson.M{"userid" : user_id}
		// change := bson.M{"$set": user_details}
		change := bson.M{
			"$set": bson.M{
				"address" : user_details.Address,
				"userid" : user_details.UserId,
				"firstname" : user_details.Firstname,
				"lastname" : user_details.Lastname,
				"phonenumber" : user_details.PhoneNumber,
				"cardnumber" : user_details.CardNumber,
			},
		}
		var result1 User_details
		err1 := c.Find(bson.M{"userid" : user_id}).One(&result1)
		if err1 != nil {
			fmt.Println("No entry exists for this user, thus inserting the data")
			err = c.Insert(user_details)
			if err != nil {
				log.Fatal(err)
			}
		} else {
			fmt.Println("Updating the exsiting entry")
			err = c.Update(filter, change)
			if err != nil {
				log.Fatal(err)
			}
		}
		var result User_details
		err = c.Find(bson.M{"UserId" : user_id}).One(&result)
		fmt.Println("User details updated : \n", result)
		formatter.JSON(w, http.StatusOK, "User details updated successfully")
	}
}