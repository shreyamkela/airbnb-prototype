all: clean

go-get:
	rm -rf src/github.com
	rm -rf src/gopkg.in
	go get -v github.com/codegangsta/negroni
	go get -v github.com/streadway/amqp
	go get -v github.com/gorilla/mux
	go get -v github.com/unrolled/render
	go get -v github.com/satori/go.uuid
	go get -v gopkg.in/mgo.v2
	go get -v gopkg.in/mgo.v2/bson
	go get -v github.com/rs/cors

clean: 
	find . -name 'bookingapi' -type f -exec rm -f {} \; 
	go clean

run:
	go run src/bookingapi/main.go

main:
	go run src/bookingapi/main.go

format:
	go fmt bookingapi

install:
	go install bookingapi

build:
	go build bookingapi

start:
	./bookingapi

br:
	go build bookingapi
	./bookingapi

docker-build: 
	docker build -t bookingapi .
	docker images

mongodb-run:
	docker run --name mongodb --network bookingapi -p 27017:27017 -d mongo

docker-run:
	docker run \
            --network bookingapi \
			--name bookingapi -p 3001:3001 -td bookingapi
	docker ps

docker-shell:
	docker exec -it bookingapi bash 

docker-ip:
	docker-machine ip

docker-ps:
	 docker ps --all --format "table {{.ID}}\t{{.Names}}\t{{.Image}}\t{{.Status}}\t"

docker-ps-ports:
	 docker ps --all --format "table {{.Names}}\t{{.Ports}}\t"

network-create:
	docker network create --driver bridge bookingapi

network-inspect:
	docker network inspect bookingapi

docker-network:
	docker network ls