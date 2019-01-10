package main

import (
	"testing"
)

func TestRequestResponse(t *testing.T) {
	handleRequest([]byte("{\"filename\": \"test-file-name\", \"url\": \"http://test-url.document\", \"message\": \"scan-request\", \"id\": 1}"))
}
