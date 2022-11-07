package main

import (
	"log"
	"time"

	"github.com/nsqio/go-nsq"
)

func main() {
	config := nsq.NewConfig()
	p, err := nsq.NewProducer("127.0.0.1:4150", config)
	if err != nil {
		log.Panic(err)
	}
	err = p.Publish("My_NSQ_Topic", []byte("Topic created from Golang"))
	if err != nil {
		log.Panic(err)
	}

	err = p.DeferredPublish("My_NSQ_Topic", 2000*time.Millisecond, []byte("This message gonna arrive 1 sec later."))
	if err != nil {
		log.Panic(err)
	}
}
