const fs = require("fs");
const SSH2Promise = require("ssh2-promise");

const FILE_KEY = "./../ssh-server/id_rsa_fake";

if (fs.existsSync(FILE_KEY)) {
  const sshClient = new SSH2Promise({
    host: "localhost",
    username: "root",
    identity: FILE_KEY,
    disableCache: true,
  });

  sshClient.connect().then(() => {
    console.log("Connection established");

    sshClient.exec("rm -rf scripts && ls -alh").then((data) => {
      console.log("Remove old script contract", data);

      // Download VM Script Contract
      sshClient
        .spawn(
          "mkdir -p scripts && \
            wget -O main.py https://raw.githubusercontent.com/devetek/nsq-demo/main/scripts/main.py && \
            wget -O scripts/vm-runner.sh https://raw.githubusercontent.com/devetek/nsq-demo/main/scripts/vm-runner.sh && \
            chmod +x scripts/vm-runner.sh"
        )
        .then((socket) => {
          socket.on("data", (data) => {
            console.log(data.toString());
          });

          socket.stderr.on("data", (data) => {
            console.log(data.toString());
          });

          socket.on("end", () => {
            sshClient.spawn("python3 main.py").then((socket) => {
              socket.on("data", (data) => {
                console.log(data.toString());
              });

              socket.stderr.on("data", (data) => {
                const strOutput = data.toString();

                if (strOutput === "KRATOS-FINISHED") {
                  sshClient.exec("curl localhost:8080/kill").then((data) => {
                    console.log(data);
                  });
                } else {
                  console.log(data.toString());
                }
              });

              socket.on("end", () => {
                // suicide
                sshClient.close();
              });
            });
          });
        })
        .catch((e) => {
          console.log(e);
        })
        .catch((e) => {
          console.log(e);
        });
    });
  });
}
