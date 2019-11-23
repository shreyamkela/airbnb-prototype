package main

type User_details struct {
	UserId string `bson:"_id"`
	Firstname string
	Lastname string
	Address string
	PhoneNumber string
	PropertyId []string
	BookingId []string
	CardNumber string 
}

type Owner_property_ids struct {
	OwnerId string
	PropertyId string
}

type Traveler_booking_ids struct {
	TravelerId string
	BookingId string
}
