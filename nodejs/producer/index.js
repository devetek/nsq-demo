const nsq = require("nsqjs");

const w = new nsq.Writer("127.0.0.1", 4150);

w.connect();

w.on("ready", () => {
  w.publish("My_NSQ_Topic", "Topic created from NodeJS", (err) => {
    if (err) {
      console.log(err);
    }
  });
  w.deferPublish(
    "My_NSQ_Topic",
    ["This message gonna arrive 1 sec later."],
    1000,
    (err) => {
      if (err) {
        console.log(err);
      }
      w.close();
    }
  );
});

w.on("closed", () => {
  console.log("Writer closed");
});
