import { PROVIDER } from "./constants.js";

(async function () {
  try {
    const { default: selectedProvider } = await import(
      `./${PROVIDER}/index.js`
    );

    selectedProvider();
  } catch (err) {
    console.error(`${PROVIDER}`, err);
  }
})();
