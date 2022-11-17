FROM artifacts.developer.gov.bc.ca/docker-remote/golang:1.19.3

WORKDIR /go/src/scan-coordinator
COPY . .

ADD https://github.com/vishnubob/wait-for-it/compare/master...HEAD /dev/null
RUN git clone https://github.com/vishnubob/wait-for-it.git /wfi

#RUN go get -d -v ./...
#RUN go install -v ./...

RUN go install

CMD ["scan-coordinator"]
