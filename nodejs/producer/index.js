const nsq = require("nsqjs");

const w = new nsq.Writer("127.0.0.1", 4150);

w.connect();

w.on("ready", () => {
  w.deferPublish(
    "My_NSQ_Topic",
    [`NodeJS message gonna arrive 1 sec later at ${new Date().toISOString()}.`],
    3000000
  );
  w.deferPublish(
    "My_NSQ_Topic",
    [`NodeJS message gonna arrive 2 sec later at ${new Date().toISOString()}.`],
    500000
  );
  w.publish(
    "My_NSQ_Topic",
    `Topic created from NodeJS at ${new Date().toISOString()}`,
    (err) => {
      if (err) {
        console.log(err);
      }
      w.close();
    }
  );
});

w.on("error", (err) => {
  if (err) {
    console.log(err.message);
  }
});

w.on("closed", () => {
  // console.log("Writer closed");
});
