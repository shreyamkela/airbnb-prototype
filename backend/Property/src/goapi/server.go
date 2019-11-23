package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"path/filepath"
	"time"

	// "encoding/json"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/codegangsta/negroni"
	"github.com/rs/cors"

	// "github.com/rs/cors"
	"github.com/gorilla/mux"
	"github.com/unrolled/render"

	// "github.com/satori/go.uuid"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

// Mongodb config
var mongodb_server = "10.0.1.30:27017"
var mongodb_database = "cmpe281"
var mongodb_collection_dashboard = "property"

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
	mx.HandleFunc("/pingproperty", pingHandler(formatter)).Methods("GET")
	mx.HandleFunc("/property/", postProperty(formatter)).Methods("POST")
	mx.HandleFunc("/property/find/{id}", findPropertyById(formatter)).Methods("GET")
	mx.HandleFunc("/property/owner/{id}", findPropertyByOwnerId(formatter)).Methods("GET")
	mx.HandleFunc("/property/book/{id}", bookProperty(formatter)).Methods("POST")
	mx.HandleFunc("/property/search", searchProperty(formatter)).Methods("POST")
	mx.HandleFunc("/property/review/{id}", reviewProperty(formatter)).Methods("POST")
	mx.HandleFunc("/property/upload/{id}", uploadPictures(formatter)).Methods("POST")
}

// API Ping Handler (GET call)
func pingHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		formatter.JSON(w, http.StatusOK, struct{ Test string }{"API version 2.0 alive!"})
	}
}

//API to post a new property
func postProperty(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		var property Property
		json.NewDecoder(req.Body).Decode(&property)
		fmt.Println("Name of property which is to be posted is: ", property.StartDate)
		session, err := mgo.Dial(mongodb_server)
		if err != nil {
			fmt.Println("Error while connecting to database")
			return
		}
		start := property.StartDate
		end := property.EndDate

		//ref: https://golang.org/src/time/format.go
		layout := "2006-01-02"
		t, _ := time.Parse(layout, start)
		t1, _ := time.Parse(layout, end)
		fmt.Println("time converted is: ", t)

		t1 = t1.AddDate(0, 0, 1)
		fmt.Println("time converted is: ", t1)
		for d := t; !t1.Equal(d); d = d.AddDate(0, 0, 1) {
			fmt.Println("Looping through dates: ", d)
			// property.AvailableDates = append(property.AvailableDates, d)
		}
		property.PropertyID = bson.NewObjectId().Hex()
		session.SetMode(mgo.Monotonic, true)
		c := session.DB(mongodb_database).C(mongodb_collection_dashboard)

		var properties []Property
		err = c.Find(bson.M{"name": property.Name}).All(&properties)
		if err != nil {
			formatter.JSON(w, http.StatusInternalServerError, err)
		}
		if len(properties) > 0 {
			formatter.JSON(w, http.StatusInternalServerError, "Property Name Already exists")
		} else {
			var result Property
			err = c.Insert(property)
			if err != nil {
				formatter.JSON(w, http.StatusInternalServerError, err)
			}
			fmt.Println("InsertedID is:", property.PropertyID)
			fmt.Println("result is:", result)
			formatter.JSON(w, http.StatusOK, property.PropertyID)
		}
	}
}

// API to view a property based on the id
func findPropertyById(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		params := mux.Vars(req)
		var property_id string = params["id"]
		fmt.Println("Property ID to get is: ", property_id)
		session, err := mgo.Dial(mongodb_server)
		if err != nil {
			panic(err)
		}
		session.SetMode(mgo.Monotonic, true)
		c := session.DB(mongodb_database).C(mongodb_collection_dashboard)
		var result bson.M
		err = c.Find(bson.M{"_id": property_id}).One(&result)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Println("Property data:", result)
		formatter.JSON(w, http.StatusOK, result)
	}
}

func findPropertyByOwnerId(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		params := mux.Vars(req)
		var owner_id string = params["id"]
		fmt.Println("Owner ID is: ", owner_id)
		session, err := mgo.Dial(mongodb_server)
		if err != nil {
			formatter.JSON(w, http.StatusInternalServerError, err)
		}
		session.SetMode(mgo.Monotonic, true)
		c := session.DB(mongodb_database).C(mongodb_collection_dashboard)
		var result []Property
		err = c.Find(bson.M{"ownerid": owner_id}).All(&result)
		if err != nil {
			formatter.JSON(w, http.StatusInternalServerError, err)
		}
		//fmt.Println("Property data:", result)
		formatter.JSON(w, http.StatusOK, result)
	}
}

func bookProperty(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		params := mux.Vars(req)
		var property_id string = params["id"]
		fmt.Println("Property ID to book is: ", property_id)

		session, err := mgo.Dial(mongodb_server)
		if err != nil {
			formatter.JSON(w, http.StatusInternalServerError, "Server Error")
		}
		session.SetMode(mgo.Monotonic, true)
		c := session.DB(mongodb_database).C(mongodb_collection_dashboard)

		//working with request body
		var booking BookingInformation
		json.NewDecoder(req.Body).Decode(&booking)
		start := booking.StartDate
		end := booking.EndDate
		layout := "2006-01-02"
		t, _ := time.Parse(layout, start)
		t1, _ := time.Parse(layout, end)
		fmt.Println("time converted is: ", t)
		t1 = t1.AddDate(0, 0, 1)

		// Getting the property document
		var property Property
		err = c.Find(bson.M{"_id": property_id}).One(&property)
		if err != nil {
			formatter.JSON(w, http.StatusInternalServerError, err)
			return
		}

		//getting the booking dates
		var bookedDates []time.Time
		bookedDates = property.BookedDates
		// fmt.Println("time converted is: ", t1)
		for d := t; !t1.Equal(d); d = d.AddDate(0, 0, 1) {
			fmt.Println("Looping through dates: ", d)
			bookedDates = append(bookedDates, d)
		}

		var bookings []BookingInformation
		bookings = property.Bookings
		bookings = append(bookings, booking)

		//updating the document to book dates
		//ref: https://gist.github.com/border/3489566
		selector := bson.M{"_id": property_id}
		update := bson.M{"$set": bson.M{"bookeddates": bookedDates, "bookings": bookings}}
		err = c.Update(selector, update)
		if err != nil {
			formatter.JSON(w, http.StatusInternalServerError, err)
		}

		// //updating for pushing new booking
		// selector = bson.M{"_id": property_id}
		// update = bson.M{"$push": bson.M{"bookings": booking}}
		// err = c.Update(selector, update)

		// if err != nil {
		// 	formatter.JSON(w, http.StatusInternalServerError, err)
		// }

		formatter.JSON(w, http.StatusOK, "Successfully Updated")
	}
}

func searchProperty(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {

		session, err := mgo.Dial(mongodb_server)
		if err != nil {
			formatter.JSON(w, http.StatusInternalServerError, "Server Error")
		}
		session.SetMode(mgo.Monotonic, true)
		c := session.DB(mongodb_database).C(mongodb_collection_dashboard)

		//working with request body
		var searchCriteria SearchCriteria
		json.NewDecoder(req.Body).Decode(&searchCriteria)
		start := searchCriteria.StartDate
		end := searchCriteria.EndDate
		layout := "2006-01-02"
		t, _ := time.Parse(layout, start)
		t1, _ := time.Parse(layout, end)
		fmt.Println("time converted is: ", t)
		t1 = t1.AddDate(0, 0, 1)

		//getting the booking dates
		var searchDates []time.Time
		fmt.Println("time converted is: ", t1)
		for d := t; !t1.Equal(d); d = d.AddDate(0, 0, 1) {
			fmt.Println("Checking for dates in : ", d)
			searchDates = append(searchDates, d)
		}
		var result []Property
		err = c.Find(bson.M{"accomodates": bson.M{"$gte": searchCriteria.Accomodates}, "startdate": bson.M{"$lte": searchCriteria.StartDate}, "enddate": bson.M{"$gte": searchCriteria.EndDate}, "city": searchCriteria.Location}).All(&result)
		if err != nil {
			formatter.JSON(w, http.StatusInternalServerError, "Server Error")
		}
		var finalResult []Property
		for i := 0; i < len(result); i = i + 1 {
			var flag = true
			var temp Property = result[i]
			for j := 0; j < len(searchDates); j = j + 1 {
				if contains(temp.BookedDates, searchDates[j]) {
					fmt.Println("Date", searchDates[j], " is booked")
					flag = false
					break
				}
			}
			if flag == true {
				fmt.Println("adding ", temp.Name, " into finalResult")
				finalResult = append(finalResult, temp)
			}
		}
		formatter.JSON(w, http.StatusOK, finalResult)
	}
}

func reviewProperty(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		params := mux.Vars(req)
		var property_id string = params["id"]
		fmt.Println("Property ID to review is: ", property_id)

		session, err := mgo.Dial(mongodb_server)
		if err != nil {
			formatter.JSON(w, http.StatusInternalServerError, "Server Error")
		}
		session.SetMode(mgo.Monotonic, true)
		c := session.DB(mongodb_database).C(mongodb_collection_dashboard)

		//working with request body
		var review Review
		json.NewDecoder(req.Body).Decode(&review)

		//updating the document to book dates
		//ref: https://gist.github.com/border/3489566
		selector := bson.M{"_id": property_id}
		update := bson.M{"$push": bson.M{"reviews": review}}
		err = c.Update(selector, update)
		if err != nil {
			formatter.JSON(w, http.StatusInternalServerError, err)
		}
		formatter.JSON(w, http.StatusOK, "Successfully Updated")
	}
}

//ref: https://gist.github.com/ehernandez-xk/e151b69f5734c8e2d7e7347d79966bb9
//ref: https://medium.com/@yogeshdarji99/steps-to-install-awscli-on-mac-5bad783483a
//ref: https://docs.aws.amazon.com/AmazonS3/latest/dev/cors.html
//ref: https://docs.aws.amazon.com/AmazonS3/latest/dev/example-bucket-policies.html#example-bucket-policies-use-case-2
func uploadPictures(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		params := mux.Vars(req)
		var property_id string = params["id"]
		fmt.Println("Property ID is: ", property_id)

		// processing multipart form
		req.ParseMultipartForm(32 << 20)
		file, handler, err := req.FormFile("jpg")
		if err != nil {
			fmt.Println("error while parsing multipart form: ", err)
			return
		}
		defer file.Close()
		fmt.Println("file name is:", handler.Filename)
		conf := aws.Config{Region: aws.String("us-west-2")}
		sess := session.New(&conf)
		svc := s3manager.NewUploader(sess)
		fmt.Println("Uploading file to S3...")
		result, err := svc.Upload(&s3manager.UploadInput{
			Bucket: aws.String("cmpe281-propertyimages"),
			Key:    aws.String(filepath.Base(property_id + "-" + handler.Filename)),
			Body:   file,
		})

		if err != nil {
			fmt.Println("error", err)
			fmt.Println("error while uploading: ", err)
		}
		fmt.Println("After uploading")
		session, err := mgo.Dial(mongodb_server)
		if err != nil {
			formatter.JSON(w, http.StatusInternalServerError, err)
		}
		session.SetMode(mgo.Monotonic, true)
		c := session.DB(mongodb_database).C(mongodb_collection_dashboard)
		selector := bson.M{"_id": property_id}
		update := bson.M{"$set": bson.M{"image": "http://dwz5dvieyr9hn.cloudfront.net/" + handler.Filename}}
		err = c.Update(selector, update)
		if err != nil {
			formatter.JSON(w, http.StatusInternalServerError, err)
		}

		formatter.JSON(w, http.StatusOK, "Uploaded to: "+result.Location)
	}
}

// ref: https://ispycode.com/GO/Collections/Arrays/Check-if-item-is-in-array
func contains(arr []time.Time, str time.Time) bool {
	for _, a := range arr {
		fmt.Println("Comapring a: ", a, " and str: ", str)
		if a.Year() == str.Year() && a.Month() == str.Month() && a.Day() == str.Day() {
			fmt.Println("Everything is same")
			return true
		}
	}
	return false
}
