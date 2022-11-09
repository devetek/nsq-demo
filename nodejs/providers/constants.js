const {
  ENV = "development",
  DEV_BRANCH = "beta",
  PROVIDER = "virtual-machine",
  DEFAULT_BRANCH = "main",
  /**
   * Specific environment for virtual machine provider
   */
  VIRTUAL_MACHINE_USERNAME = "root",
  VIRTUAL_MACHINE_SSH_KEY = "./ssh-server/id_rsa_fake",
  /**
   * Specific environment for github action provider
   */
} = process.env;

const ISDEV = ENV === "development";

export {
  ENV,
  ISDEV,
  PROVIDER,
  DEV_BRANCH,
  DEFAULT_BRANCH,
  VIRTUAL_MACHINE_USERNAME,
  VIRTUAL_MACHINE_SSH_KEY,
};
