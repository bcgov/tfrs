package main

import (
	"net/url"
	"strings"
	"log"
	"encoding/json"
	"github.com/streadway/amqp"
	"github.com/dutchcoders/go-clamd"
	"github.com/minio/minio-go"
	"io"
)

// AMQP message format
type ScanRequest struct {
	Url      string `json:"url"`
	Filename string `json:"filename"`
	Message  string `json:"message"`
	Id       int64  `json:"id"`
}

// AMQP message format
type ScanResponse struct {
	ScanComplete bool   `json:"scanComplete"`
	ScanPassed   bool   `json:"scanPassed"`
	Url          string `json:"url"`
	Message      string `json:"message"`
	Id           int64  `json:"id"`
}

func main() {

	//load config from environment
	conf := config{
		BypassMode:     getEnvBool("BYPASS_CLAMAV", false),
		ClamAVHost:     getEnv("CLAMAV_HOST", "localhost"),
		ClamAVPort:     getEnvUint16("CLAMAV_PORT", 3310),
		AMQPHost:       getEnv("AMQP_HOST", "localhost"),
		AMQPVHost:      getEnv("AMQP_VHOST", "/"),
		AMQPPort:       getEnvUint16("AMQP_PORT", 5672),
		AMQPUser:       getEnv("AMQP_USER", "guest"),
		AMQPPassword:   getEnv("AMQP_PASSWORD", "guest"),
		MinioAccessKey: getEnv("MINIO_ACCESS_KEY", ""),
		MinioSecretKey: getEnv("MINIO_SECRET_KEY", ""),
		MinioEndpoint:  getEnv("MINIO_ENDPOINT", ""),
		MinioSecure:    getEnvBool("MINIO_USE_SSL", false),
	}

	if !conf.BypassMode {
		testClamAVConnection(&conf)
	}

	testMinioConnection(&conf)

	//connect to rabbit
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

	//declare queues (idempotent)
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

	//goroutine to perpetually await and handle messages
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

func testMinioConnection(conf *config) {
	log.Printf("Verifying Minio connection")

	//out of date
	//	client, err := minio.New(conf.MinioEndpoint, &minio.Options{
	//		Creds:  credentials.NewStaticV4(conf.MinioAccessKey, conf.MinioSecretKey, ""),
	//		Secure: conf.MinioSecure,
	//	})
	client, err := minio.New(conf.MinioEndpoint, conf.MinioAccessKey, conf.MinioSecretKey, conf.MinioSecure)
	if err != nil {
		panic(err)
	}

	//out of date
	//_, err = client.ListBuckets(context.Background())
	_, err = client.ListBuckets()
	if err != nil {
		panic(err)
	}
}

// handle each incoming message by streaming it to clamAV for scan
func handleRequest(conf *config, body []byte) (response ScanResponse) {
	req := ScanRequest{}
	json.Unmarshal(body, &req)

	scanPassed := true

	if !conf.BypassMode {
		clamav := clamd.NewClamd(getClamAVConnectionString(conf))

		log.Printf("Streaming object to ClamAV for scan")

		u, err := url.Parse(req.Url)
		if err != nil {
			log.Print(err)
			return
		}

		tokens := strings.Split(u.Path, "/")
		if len(tokens) != 3 {
			log.Print("Unexpected URL length, don't know how to parse into bucket:object")
			return
		}

		bucket := tokens[1]
		obj := tokens[2]
		
		//out of date 
		//client, err := minio.New(conf.MinioEndpoint, &minio.Options{
		//	Creds:  credentials.NewStaticV4(conf.MinioAccessKey, conf.MinioSecretKey, ""),
		//	Secure: conf.MinioSecure,
		//})
		client, err := minio.New(conf.MinioEndpoint, conf.MinioAccessKey, conf.MinioSecretKey, conf.MinioSecure)
		if err != nil {
			log.Print(err)
			return
		}

		//out of date
		// resp, err := client.GetObject(context.Background(), bucket, obj, minio.GetObjectOptions{})
		resp, err := client.GetObject(bucket, obj, minio.GetObjectOptions{})
		if err != nil {
			log.Print(err)
			return
		}

		piper, pipew := io.Pipe()
		go func() {
			defer pipew.Close()
			defer resp.Close()
			io.Copy(pipew, resp)
		}()

		resultChannel, err := clamav.ScanStream(piper, make(chan bool))

		if err != nil {
			log.Print(err)
			return
		}

		result := <-resultChannel

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
