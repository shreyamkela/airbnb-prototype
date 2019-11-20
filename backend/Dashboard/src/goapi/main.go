package main

import (
	"os"
	"fmt"
)

func main() {

	port := os.Getenv("PORT")
	if len(port) == 0 {
		port = "3001"
	}

	server := NewServer()
	server.Run(":" + port)
	fmt.Println("Server started on port 3001")
}
