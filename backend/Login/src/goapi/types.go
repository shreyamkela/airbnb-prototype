package main

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID       primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Email    string             `json:"email,omitempty" bson:"email,omitempty"`
	Password string             `json:"password,omitempty" bson:"password,omitempty"`
	Username string             `json:"username,omitempty" bson:"username,omitempty"`
	Type     string             `json:"type,omitempty" bson:"type,omitempty"`
}

type UserEncrypted struct {
	ID       primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Email    string             `json:"email,omitempty" bson:"email,omitempty"`
	Password []byte             `json:"password,omitempty" bson:"password,omitempty"`
	Username string             `json:"username,omitempty" bson:"username,omitempty"`
	Type     string             `json:"type,omitempty" bson:"type,omitempty"`
}
