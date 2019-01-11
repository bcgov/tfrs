package main

import (
	"fmt"
	"os"
	"strconv"
)

type config struct {
	//if true, don't actually scan the file
	BypassMode bool

	ClamAVHost string
	ClamAVPort uint16

	AMQPHost     string
	AMQPVHost    string
	AMQPPort     uint16
	AMQPUser     string
	AMQPPassword string

	MinioEndpoint	string
	MinioAccessKey	string
	MinioSecretKey	string
	MinioSecure		bool
}

func getAMQPConnectionString(config *config) string {
	return fmt.Sprintf(
		"amqp://%s:%s@%s:%d/%s",
		config.AMQPUser,
		config.AMQPPassword,
		config.AMQPHost,
		config.AMQPPort,
		config.AMQPVHost)
}

func getClamAVConnectionString(config *config) string {
	return fmt.Sprintf(
		"tcp://%s:%d",
		config.ClamAVHost,
		config.ClamAVPort)
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

func getEnvBool(key string, fallback bool) bool {
	if value, ok := os.LookupEnv(key); ok {

		parsed, _ := strconv.ParseBool(value)

		return parsed
	}
	return fallback
}

func getEnvUint16(key string, fallback uint16) uint16 {
	if value, ok := os.LookupEnv(key); ok {

		parsed, _ := strconv.ParseUint(value, 10, 16)

		return uint16(parsed)
	}
	return fallback
}
