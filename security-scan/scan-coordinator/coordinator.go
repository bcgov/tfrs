package main

import (
	//"bytes"
	"net/http"

	//"bytes"
	//  "fmt"
	"log"

	// "time"
	"encoding/json"
	"github.com/streadway/amqp"
	"github.com/dutchcoders/go-clamd"
)

type ScanRequest struct {
	Url      string `json:"url"`
	Filename string `json:"filename"`
	Message  string `json:"message"`
	Id       int64  `json:"id"`
}

type ScanResponse struct {
	ScanComplete bool   `json:"scanComplete"`
	ScanPassed   bool   `json:"scanPassed"`
	Url          string `json:"url"`
	Message      string `json:"message"`
	Id           int64  `json:"id"`
}

func main() {

	conf := config{
		BypassMode:   getEnvBool("BYPASS_CLAMAV", false),
		ClamAVHost:   getEnv("CLAMAV_HOST", "localhost"),
		ClamAVPort:   getEnvUint16("CLAMAV_PORT", 3310),
		AMQPHost:     getEnv("AMQP_HOST", "localhost"),
		AMQPVHost:    getEnv("AMQP_VHOST", "/"),
		AMQPPort:     getEnvUint16("AMQP_PORT", 5672),
		AMQPUser:     getEnv("AMQP_USER", "guest"),
		AMQPPassword: getEnv("AMQP_PASSWORD", "guest"),
		MinioAccessKey: getEnv("MINIO_ACCESS_KEY", ""),
		MinioSecretKey: getEnv("MINIO_SECRET_KEY", ""),
	}

	if !conf.BypassMode {
		testClamAVConnection(&conf)
	}

	conn, err := amqp.Dial(getAMQPConnectionString(&conf))
	if err != nil {
		panic(err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		panic(err)
	}
	defer ch.Close()

	//declare queues
	q, err := ch.QueueDeclare(
		"security-scan-requests",
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		panic(err)
	}

	q2, err := ch.QueueDeclare(
		"security-scan-responses",
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		panic(err)
	}

	msgs, err := ch.Consume(
		q.Name,
		"",
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		panic(err)
	}

	forever := make(chan bool)

	go func() {
		for d := range msgs {
			log.Printf("Received a request: %s", d.Body)
			response := handleRequest(&conf, d.Body)

			d.Ack(false)

			responseBytes, err := json.Marshal(response)
			if err != nil {
				panic(err)
			}

			log.Printf("Sending response %s\n", responseBytes)

			err = ch.Publish(
				"",
				q2.Name,
				false,
				false,
				amqp.Publishing{
					ContentType: "application/json",
					Body:        responseBytes,
				})
		}
	}()
	log.Printf("Ready")
	<-forever
}

func testClamAVConnection(conf *config) {
	log.Printf("Verifying ClamAV connection")
	clamav := clamd.NewClamd(getClamAVConnectionString(conf))
	err := clamav.Ping()
	if err != nil {
		panic(err)
	}
}

func handleRequest(conf *config, body []byte) (response ScanResponse) {
	req := ScanRequest{}
	json.Unmarshal(body, &req)

	scanPassed := true

	if !conf.BypassMode {
		clamav := clamd.NewClamd(getClamAVConnectionString(conf))

		client := &http.Client{}
		httpreq, err := http.NewRequest(
			"GET",
			req.Url,
			nil)

		log.Printf("Streaming to ClamAV for scan")

		httpreq.Header.Add("Authorization", getMinioAuthorizationHeader(conf))
		resp, err := client.Do(httpreq)
		if err != nil {
			panic(err)
		}

		log.Printf("Got HTTP response: %+v\n", resp)

		defer resp.Body.Close()

		resultChannel,err := clamav.ScanStream(resp.Body, make(chan bool))

		if err != nil {
			panic(err)
		}

		result := <- resultChannel

		log.Printf("Scan result: %+v", result)

		scanPassed = result.Status == clamd.RES_OK
	}


	response.Id = req.Id
	response.Url = req.Url
	response.Message = "security-scan-response"
	response.ScanComplete = true
	response.ScanPassed = scanPassed

	return
}
