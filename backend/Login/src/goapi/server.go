package main

import (
	"fmt"
	"net/http"
)


func ping(response http.ResponseWriter, request *http.Request) {
	fmt.Println("/ping GET")
}
