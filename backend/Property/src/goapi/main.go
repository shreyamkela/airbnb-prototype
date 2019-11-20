package main

import (
	"fmt"
	"os"
)

func main() {

	port := os.Getenv("PORT")
	if len(port) == 0 {
		port = "8080"
	}

	server := NewServer()
	server.Run(":" + port)
	fmt.Println("Server started on port 8080")
}
