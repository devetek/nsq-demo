const fs = require("fs");
const SSH2Promise = require("ssh2-promise");

const FILE_KEY = "./../ssh-server/id_rsa_fake";
const HOST = process.env.ENV === "development" ? "localhost" : process.env.HOST;

if (fs.existsSync(FILE_KEY)) {
  const sshClient = new SSH2Promise({
    host: HOST,
    username: "root",
    identity: FILE_KEY,
    disableCache: true,
  });

  sshClient.connect().then(() => {
    // To killing their self
    const suicide = (vmOutput) => {
      sshClient
        .exec(`curl ${HOST}:8080/kill`)
        .then((data) => {
          if (process.env.ENV === "development") {
            console.log(`suicide because response ${vmOutput} triggered.`);
            console.log(data);
          }
        })
        .catch((e) => {
          if (process.env.ENV === "development") {
            console.log(`suicide because response ${vmOutput} triggered.`);
            console.log("SUICIDE ERROR STACK: ");
            console.log(e);
          }
        });
    };

    sshClient
      .exec("echo 'Starting vm-base worker, please wait....'")
      .then((data) => {
        console.log(`[${process.env.PROVIDER}]`, data);

        // Download VM Script Contract on production
        let contractScript = {
          "virtual-machine":
            "mkdir -p scripts && \
            wget -O main.py https://raw.githubusercontent.com/devetek/nsq-demo/main/scripts/main.py && \
            wget -O scripts/vm-runner.sh https://raw.githubusercontent.com/devetek/nsq-demo/main/scripts/vm-runner.sh && \
            chmod +x scripts/vm-runner.sh",
          "github-action": null,
          "cloud-build": null,
        };

        if (process.env.ENV === "development") {
          contractScript[process.env.PROVIDER] =
            "echo 'For development purpose only!'";
        }

        sshClient
          .spawn(contractScript[process.env.PROVIDER])
          .then((socket) => {
            socket.on("data", (data) => {
              console.log(`[${process.env.PROVIDER}]`, data.toString());
            });

            socket.stderr.on("data", (data) => {
              console.log(`[${process.env.PROVIDER}]`, data.toString());
            });

            socket.on("end", () => {
              sshClient
                .spawn("python3 main.py")
                .then((socket) => {
                  socket.on("data", (data) => {
                    const strOutput = data.toString();

                    if (!strOutput.includes("KRATOS-FINISHED")) {
                      console.log(strOutput);
                    }
                  });

                  socket.stderr.on("data", (data) => {
                    const strOutput = data.toString();

                    if (strOutput.includes("Address already in use")) {
                      suicide(strOutput);
                    } else if (!strOutput.includes("KRATOS-FINISHED")) {
                      // Print only non contract string
                      console.log(
                        `[${process.env.PROVIDER}][stderr]`,
                        strOutput
                      );
                    } else {
                      suicide(strOutput);
                    }
                  });

                  socket.on("end", () => {
                    sshClient.close();
                  });
                })
                .catch((e) => {
                  console.log(
                    `[${process.env.PROVIDER}][krror][exec-contract]`,
                    e.message
                  );
                });
            });
          })
          .catch((e) => {
            console.log(
              `[${process.env.PROVIDER}][krror][fetch-contract]`,
              e.message
            );
          });
      });
  });
}
