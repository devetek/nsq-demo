/**
 * Script contract to communicate with GCP compute engine or others cloud virtual machine through ssh..
 *
 */
import { existsSync } from "fs";
import SSH2Promise from "ssh2-promise";
import {
  ENV,
  PROVIDER,
  VIRTUAL_MACHINE_USERNAME,
  VIRTUAL_MACHINE_SSH_KEY,
} from "../constants.js";
import { vmGetFreeWorker, vmCmdContractScripts } from "./utils.js";

const main = async () => {
  try {
    if (existsSync(VIRTUAL_MACHINE_SSH_KEY)) {
      const host = vmGetFreeWorker();
      const sshClient = new SSH2Promise({
        host,
        username: VIRTUAL_MACHINE_USERNAME,
        identity: VIRTUAL_MACHINE_SSH_KEY,
        disableCache: true,
      });

      await sshClient.connect();

      const cmdContractFetch = await sshClient.spawn(vmCmdContractScripts());
      cmdContractFetch.on("data", (data) => {
        console.log(`[${PROVIDER}][stdout]`, data.toString());
      });

      cmdContractFetch.stderr.on("data", (data) => {
        console.log(`[${PROVIDER}][stderr]`, data.toString());
      });

      cmdContractFetch.on("end", async () => {
        // Execute contract when success
        const cmdContractExec = await sshClient.spawn("python3 main.py");

        cmdContractExec.on("data", (data) => {
          const strOutput = data.toString();

          if (!strOutput.includes("KRATOS-FINISHED")) {
            console.log(strOutput);
          }
        });

        cmdContractExec.stderr.on("data", async (data) => {
          const strOutput = data.toString();

          console.log(`['exec-script'][stderr]`, strOutput);
        });

        cmdContractExec.on("end", () => {
          sshClient.close();
        });
      });
    } else {
      console.log("[main]", "ssh key does not exist.");
    }
  } catch (e) {
    console.log("[main]", e.message);
  }
};

export default main;
