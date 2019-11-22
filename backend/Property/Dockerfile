FROM golang:latest 
EXPOSE 8080
RUN mkdir /app 
ADD . /app/ 
WORKDIR /app 
ENV GOPATH /app
RUN cd /app ; make go-get ; cd src ; ls ; cd .. ; go install goapi
CMD ["/app/bin/goapi"]
