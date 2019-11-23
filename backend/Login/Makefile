all: clean

go-get:
	rm -rf src/github.com
	rm -rf src/gopkg.in
	rm -rf src/go.mongodb.org
	rm -rf src/golang.org
	go get -v github.com/gorilla/mux
	go get -v go.mongodb.org/mongo-driver/bson/primitive
	go get -v go.mongodb.org/mongo-driver/mongo
	go get -v go.mongodb.org/mongo-driver/mongo/options
	go get -v golang.org/x/crypto/bcrypt
	go get -v gopkg.in/mgo.v2
	go get -v gopkg.in/mgo.v2/bson

clean: 
	find . -name 'goapi' -type f -exec rm -f {} \; 
	go clean

run:
	go run src/app/$(app).go

main:
	go run src/app/main.go

format:
	go fmt goapi

install:
	go install goapi

build:
	go build goapi

start:
	./goapi

docker-build: 
	docker build -t goapi .
	docker images

mongodb-run:
	docker run --name mongodb --network goapi -p 27017:27017 -d mongo

docker-run:
	docker run \
            --network goapi \
			--name goapi -p 3001:3001 -td goapi
	docker ps

docker-shell:
	docker exec -it goapi bash 

docker-ip:
	docker-machine ip

docker-ps:
	 docker ps --all --format "table {{.ID}}\t{{.Names}}\t{{.Image}}\t{{.Status}}\t"

docker-ps-ports:
	 docker ps --all --format "table {{.Names}}\t{{.Ports}}\t"

network-create:
	docker network create --driver bridge goapi

network-inspect:
	docker network inspect goapi

docker-network:
	docker network ls
