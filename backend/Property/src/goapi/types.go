package main

import (
	"time"
)

type Property struct {
	PropertyID   string `bson:"_id"`
	OwnerID      string
	Country      string
	Address      string
	City         string
	State        string
	Zipcode      string
	Name         string
	PropertyType string
	Bedrooms     int
	Bathrooms    int
	Accomodates  int
	StartDate    string
	EndDate      string
	BookedDates  []time.Time
	Tariff       int
	Reviews      []Review
	Image        string
	Bookings     []BookingInformation
}

type BookingInformation struct {
	StartDate    string
	EndDate      string
	BookingID    string
	TravelerName string
}

type SearchCriteria struct {
	StartDate   string
	EndDate     string
	Location    string
	Accomodates int
}

type Review struct {
	TravelerName string
	Comment      string
}
