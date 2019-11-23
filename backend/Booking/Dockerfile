FROM golang:latest 
EXPOSE 8080
RUN mkdir /app 
ADD . /app/ 
WORKDIR /app 
ENV GOPATH /app
RUN cd /app ;make go-get; go install bookingapi
CMD ["/app/bin/bookingapi"]