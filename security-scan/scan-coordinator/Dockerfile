FROM artifacts.developer.gov.bc.ca/docker-remote/golang:1.19

WORKDIR /usr/src/app

COPY go.mod ./
RUN go mod download 

COPY . .

ADD https://github.com/vishnubob/wait-for-it/compare/master...HEAD /dev/null
RUN git clone https://github.com/vishnubob/wait-for-it.git /wfi

#RUN go get -d -v ./...
#RUN go install -v ./...

RUN go build -v -o /usr/local/bin/app ./...

CMD ["scan-coordinator"]
