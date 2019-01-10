package main

import (
	"testing"
)

func TestRequestResponse(t *testing.T) {
	conf := config{
		BypassMode: true,
	}
	handleRequest(&conf,[]byte("{\"filename\": \"test-file-name\", \"url\": \"http://test-url.document\", \"message\": \"scan-request\", \"id\": 1}"))
}

