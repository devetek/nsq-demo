import fetch from "node-fetch";
import { ENV, DEFAULT_BRANCH, DEV_BRANCH } from "./../constants.js";

/**
 *
 * Function to check vm status free or not by make HTTP call
 * worker will response with contract data: {"process": {"pid": 31, "name": "kratos"}}
 *
 * @returns {boolean} Return status of member idle or busy
 */
const vmIsWorkerFree = async (address) => {
  try {
    const response = await fetch(`http://${address}:8080/api`);

    const data = response.json();

    if (data?.process?.ppid) {
      return true;
    }
  } catch (e) {
    console.error(`[utils][isWorkerFree]`, e.message);
  }

  return false;
};

const vmGetFreeWorker = () => {
  if (ENV === "development") {
    return "localhost";
  }

  /**
   *
   * Get real members from cloud API and re-validate with vmQueue from SSOT
   * TODO: replace with real data from storage / database
   * TODO: Replace with real logic to get data from cloud API (gcp, aws, azure, digital ocean, alicloud, etc)
   */

  // TODO: replace with real data from SSOT, such as Redis, PostgreSQL, File
  const vmQueue = [
    {
      address: "127.0.0.1",
      status: "idle",
    },
    {
      address: "127.0.0.1",
      status: "idle",
    },
  ];

  // TODO: replace with real logic
  const pickOneUseStatic =
    vmQueue[Math.floor(Math.random() * vmQueue.length)].address;

  if (vmIsWorkerFree(pickOneUseStatic)) {
    return pickOneUseStatic;
  }

  return vmGetFreeWorker();
};

const vmCmdContractScripts = (branch = DEFAULT_BRANCH) => {
  if (ENV === "development" && DEV_BRANCH === "")
    return `echo "[${ENV}] - Hi developers!"`;

  const selectedBranch = DEV_BRANCH || branch;
  const scriptManagerFileName = DEV_BRANCH
    ? "kratos-agent-manager-dev"
    : "kratos-agent-manager";
  const scriptContractFileName = DEV_BRANCH
    ? "kratos-agent-worker-dev"
    : "kratos-agent-worker";

  return `wget -O ${scriptManagerFileName} https://raw.githubusercontent.com/devetek/nsq-demo/${selectedBranch}/nodejs/providers/virtual-machine/scripts/kratos-agent-manager && \
wget -O ${scriptContractFileName} https://raw.githubusercontent.com/devetek/nsq-demo/${selectedBranch}/nodejs/providers/virtual-machine/scripts/kratos-agent-worker && \
chmod +x ${scriptContractFileName}`;
};

export { vmIsWorkerFree, vmGetFreeWorker, vmCmdContractScripts };
