package main

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var client *mongo.Client

var mongoURI string = "mongodb://localhost:27017"
var PORT string = "3001"

func main() {
	fmt.Println("Starting the Login service on port " + PORT + "...")
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	client, _ = mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	router := mux.NewRouter()
	router.HandleFunc("/signup", PutUser).Methods("POST", "OPTIONS") // Enabling OPTIONS is necessary. Refer - https://stackoverflow.com/questions/39507065/enable-cors-in-golang
	router.HandleFunc("/login", GetUser).Methods("POST", "OPTIONS")
	//router.HandleFunc("/allusers", GetUsers).Methods("GET")
	http.ListenAndServe(":"+PORT, router)
}
