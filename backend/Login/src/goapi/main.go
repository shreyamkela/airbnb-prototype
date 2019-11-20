package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
)

var PORT string = "3001"

func main() {
	fmt.Println("Starting the Login service on port " + PORT + "...")
	router := mux.NewRouter()
	router.HandleFunc("/ping", ping).Methods("GET", "OPTIONS")
	http.ListenAndServe(":"+PORT, router)
}
