package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"golang.org/x/crypto/bcrypt"
	"gopkg.in/mgo.v2/bson"
)

var frontendURI string = "https://airbnb-project-cmpe281.herokuapp.com"

func Ping(response http.ResponseWriter, request *http.Request) {
	fmt.Println("/signup POST")
	response.Write([]byte(`{"message":"Ping Successful!"}`))
}

func PutUser(response http.ResponseWriter, request *http.Request) {
	fmt.Println("/signup POST")
	response.Header().Set("Access-Control-Allow-Origin", frontendURI)
	response.Header().Set("Access-Control-Allow-Credentials", "true")
	response.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, content-type")
	response.Header().Add("content-type", "application/json")
	response.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")

	var user User
	json.NewDecoder(request.Body).Decode(&user)

	collection := client.Database("cmpe281").Collection("users")
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)

	var userFound UserEncrypted
	collection.FindOne(ctx, UserEncrypted{Email: user.Email, Type: user.Type}).Decode(&userFound)

	if len(userFound.Email) > 0 { // user with this email and type already exists
		response.WriteHeader(http.StatusConflict)
		response.Write([]byte(`{"message":"Email already registered for this user type."}`))
		return
	} else {
		cost := bcrypt.DefaultCost
		hash, err := bcrypt.GenerateFromPassword([]byte(user.Password), cost)

		if err != nil {
			response.WriteHeader(http.StatusBadRequest)
			response.Write([]byte(`{"message":"` + err.Error() + `"}`))
			return
		}

		userEncrypted := UserEncrypted{user.ID, user.Email, hash, user.Type}

		result, _ := collection.InsertOne(ctx, userEncrypted)
		fmt.Println(result.InsertedID)

		json.NewEncoder(response).Encode(result.InsertedID)
	}
}

func GetUser(response http.ResponseWriter, request *http.Request) {
	fmt.Println("/login POST")
	response.Header().Set("Access-Control-Allow-Origin", frontendURI)
	response.Header().Set("Access-Control-Allow-Credentials", "true")
	response.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, content-type")
	response.Header().Add("Content-Type", "application/json")
	response.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	fmt.Println("User: ", request.Body)

	var user User
	json.NewDecoder(request.Body).Decode(&user)
	fmt.Println("User: ", user)
	fmt.Println("Email: ", user.Email)
	fmt.Println("Password: ", user.Password)
	fmt.Println("Type: ", user.Type)

	collection := client.Database("cmpe281").Collection("users")
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)

	var userFound UserEncrypted
	err1 := collection.FindOne(ctx, UserEncrypted{Email: user.Email, Type: user.Type}).Decode(&userFound)
	if err1 != nil {
		response.WriteHeader(http.StatusUnauthorized)
		response.Write([]byte(`{"message":"` + err1.Error() + `"}`))
		return
	}

	err2 := bcrypt.CompareHashAndPassword(userFound.Password, []byte(user.Password))
	if err2 != nil {
		response.WriteHeader(http.StatusUnauthorized)
		response.Write([]byte(`{"message":"` + err2.Error() + `"}`))
		return
	}

	//fmt.Println("userFound: ", userFound)
	response.WriteHeader(http.StatusOK)
	json.NewEncoder(response).Encode(userFound.ID)
}

func GetUsers(response http.ResponseWriter, request *http.Request) {
	response.Header().Add("content-type", "application/json")
	var users []User
	collection := client.Database("cmpe281").Collection("users")
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{"message":"` + err.Error() + `"}`))
		return
	}
	defer cursor.Close(ctx)
	for cursor.Next(ctx) {
		var user User
		cursor.Decode(&user)
		users = append(users, user)
	}
	if err := cursor.Err(); err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{"message":"` + err.Error() + `"}`))
		return
	}
	json.NewEncoder(response).Encode(users)
}
