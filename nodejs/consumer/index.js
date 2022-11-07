const express = require("express");
const nsq = require("nsqjs");
const app = express();
const port = 3000;

const reader = new nsq.Reader("My_NSQ_Topic", "My_NSQ_Channel", {
  nsqdTCPAddresses: "127.0.0.1:4150",
});

reader.connect();

reader.on("message", (msg) => {
  console.log("Received message [%s]: %s", msg.id, msg.body.toString());
  msg.finish();
});

app.listen(port, () =>
  console.log(`NSQ Consumer is listening on port ${port}!`)
);
