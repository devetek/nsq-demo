// const express = require("express");
import nsq from "nsqjs";
// const app = express();
// const port = 3000;

const reader = new nsq.Reader("My_NSQ_Topic", "golang_channel", {
  nsqdTCPAddresses: "127.0.0.1:4150",
});

reader.connect();

reader.on("ready", () => {
  console.log(`Awaiting messages from NSQ topic "My NSQ Topic"...`);
});

reader.on("message", (msg) => {
  console.log(
    "%s Received message [%s]: %s",
    new Date()
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "")
      .replace(/-/g, "/"),
    msg.id,
    msg.body.toString()
  );
  msg.finish();
});

reader.on("error", (err) => {
  if (err) {
    console.log(err);
    setInterval(() => {
      reader.connect();
    }, 1000);
  }
});

// Uncomment to expose nodeJS web server
// app.listen(port, () =>
//   console.log(`NSQ Consumer is listening on port ${port}!`)
// );
