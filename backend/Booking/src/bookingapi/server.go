package main

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"time"

	// "encoding/json"

	"github.com/codegangsta/negroni"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"github.com/unrolled/render"

	// "github.com/satori/go.uuid"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

// Mongodb config
var mongodb_server = "52.13.14.228:27017"
var mongodb_database = "cmpe281_airbnb"
var mongodb_collection_booking = "user_booking"

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
	mx.HandleFunc("/Booking", BookingPostHandler(formatter)).Methods("POST")
	mx.HandleFunc("/Booking/{id}", BookingDeleteHandler(formatter)).Methods("DELETE")
	mx.HandleFunc("/Booking/{id}", BookingGetHandler(formatter)).Methods("GET")
	mx.HandleFunc("/BookingByTraveller/{traveller_id}", BookingTravellerGetHandler(formatter)).Methods("GET")
	mx.HandleFunc("/BookingByProperty/{property_id}", BookingPropertyGetHandler(formatter)).Methods("GET")
	mx.HandleFunc("/BookingReview", BookingPropertyReviewHandler(formatter)).Methods("PUT")

}

// API Ping Handler (GET call)
func pingHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		formatter.JSON(w, http.StatusOK, struct{ Test string }{"AirBNB Booking Service is alive!"})
	}
}

//Api call to update the review on the booking
func BookingPropertyReviewHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		var booking Booking
		_ = json.NewDecoder(req.Body).Decode(&booking)
		fmt.Println("In update of review")
		fmt.Println(booking)
		session, err := mgo.Dial(mongodb_server)
		if err != nil {
			fmt.Println("Mongo server error")
			panic(err)
		}
		defer session.Close()
		session.SetMode(mgo.Monotonic, true)
		c := session.DB(mongodb_database).C(mongodb_collection_booking)
		var resultFind bson.M
		errFind := c.Find(bson.M{"id": booking.Id}).One(&resultFind)
		if errFind != nil {
			fmt.Println("Not able to find the booking!")
			formatter.JSON(w, http.StatusForbidden, struct{ Message string }{"Not able to find the booking!"})
			return
		} else {
			comment := booking.Comment
			filter := bson.M{"_id": resultFind["_id"]}
			updated := bson.M{"$set": bson.M{"comment": comment}}
			err = c.Update(filter, updated)
			if err != nil {
				fmt.Println("Error while updating")
				panic(err)
			}
		}
		fmt.Println(" Booking details updated")
		formatter.JSON(w, http.StatusOK, "Booking updated successfully")
	}
}

// API to post a booking
func BookingPostHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		session, err := mgo.Dial(mongodb_server)
		if err != nil {
			panic(err)
		}
		defer session.Close()
		session.SetMode(mgo.Monotonic, true)
		c := session.DB(mongodb_database).C(mongodb_collection_booking)
		var booking Booking
		_ = json.NewDecoder(req.Body).Decode(&booking)
		rand.Seed(time.Now().UnixNano())
		// booking.Id = strconv.Itoa(rand.Intn(100000000000))
		booking.Id = bson.NewObjectId().Hex()
		fmt.Println("Wohoo: ", booking)
		// count, err := c.Find(bson.M{"Id": booking.Id}).Limit(1).Count()
		var resultFind bson.M
		errFind := c.Find(bson.M{"id": booking.Id}).One(&resultFind)
		if errFind != nil {
			fmt.Println("No entry exists for this user, thus inserting the data")
			err = c.Insert(booking)
			if err != nil {
				fmt.Println("DB: Not able to insert!")
			}
		} else {
			fmt.Println("Booking already exists with this ID!")
			formatter.JSON(w, http.StatusForbidden, struct{ Message string }{"Booking already Exists!"})
			return
		}
		var result bson.M
		err = c.Find(bson.M{"id": booking.Id}).One(&result)
		if err != nil {
			fmt.Println("DB: Not able to find!")
		}
		fmt.Println("Booking Details : \n", result)
		formatter.JSON(w, http.StatusOK, result["id"])
	}
}

// API to get a booking
func BookingGetHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		params := mux.Vars(req)
		var bookingID string = params["id"]
		fmt.Println("Params: ", params)
		session, err := mgo.Dial(mongodb_server)
		if err != nil {
			panic(err)
		}
		defer session.Close()
		session.SetMode(mgo.Monotonic, true)
		c := session.DB(mongodb_database).C(mongodb_collection_booking)
		var resultFind Booking
		errFind := c.Find(bson.M{"id": bookingID}).One(&resultFind)
		if errFind != nil {
			fmt.Println("Not able to find the booking!")
			formatter.JSON(w, http.StatusForbidden, struct{ Message string }{"Not able to find the booking!"})
			return
		} else {
			fmt.Println("Booking Details : \n", resultFind)
			formatter.JSON(w, http.StatusOK, resultFind)
		}
	}
}

// API to get all bookings based on traveller-id
func BookingTravellerGetHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		params := mux.Vars(req)
		var travellerID string = params["traveller_id"]
		fmt.Println("Params traveller: ", params)
		session, err := mgo.Dial(mongodb_server)
		if err != nil {
			// panic(err)
			fmt.Println(err)
		}
		defer session.Close()
		session.SetMode(mgo.Monotonic, true)
		c := session.DB(mongodb_database).C(mongodb_collection_booking)
		var resultFind []bson.M
		errFind := c.Find(bson.M{"traveller_id": travellerID}).All(&resultFind)
		if errFind != nil {
			fmt.Println("Not able to find the booking!")
			formatter.JSON(w, http.StatusForbidden, struct{ Message string }{"Not able to find the booking!"})
			return
		} else {
			fmt.Println("Booking Details : \n", resultFind)
			formatter.JSON(w, http.StatusOK, resultFind)
		}
	}
}

// API to get bookings based on property-id
func BookingPropertyGetHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		params := mux.Vars(req)
		var propertyID string = params["property_id"]
		fmt.Println("Params property-id: ", params)
		session, err := mgo.Dial(mongodb_server)
		if err != nil {
			// panic(err)
			fmt.Println(err)
		}
		defer session.Close()
		session.SetMode(mgo.Monotonic, true)
		c := session.DB(mongodb_database).C(mongodb_collection_booking)
		var resultFind []Booking
		errFind := c.Find(bson.M{"property_id": propertyID}).All(&resultFind)
		if errFind != nil || len(resultFind) == 0 {
			fmt.Println("Not able to find the booking on property ID!")
			formatter.JSON(w, http.StatusOK, resultFind)
			// formatter.JSON(w, http.StatusForbidden, struct{ Message string }{"Not able to find the booking on property ID!"})
			return
		} else {
			fmt.Println("Booking Details : \n", resultFind)
			formatter.JSON(w, http.StatusOK, resultFind)
		}
	}
}

// API to delete a booking
func BookingDeleteHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		params := mux.Vars(req)
		var bookingID string = params["id"]
		// fmt.Println(params)
		fmt.Println("Booking ID: ", bookingID)
		session, err := mgo.Dial(mongodb_server)
		if err != nil {
			panic(err)
		}
		defer session.Close()
		session.SetMode(mgo.Monotonic, true)
		c := session.DB(mongodb_database).C(mongodb_collection_booking)
		var resultFind bson.M
		errFind := c.Find(bson.M{"id": bookingID}).One(&resultFind)
		if errFind != nil {
			fmt.Println("Not able to find the booking!")
			formatter.JSON(w, http.StatusForbidden, struct{ Message string }{"Not able to find the booking!"})
			return
		} else {
			fmt.Println("Booking exists with this ID!")
			err = c.Remove(bson.M{"id": bookingID})
			formatter.JSON(w, http.StatusOK, struct{ Message string }{"Booking cancelled!"})
		}
	}
}
