import * as React from "react";
import { virtualSheet, getStyleTagProperties } from "twind/sheets";
import { setup } from "twind";
import { sharedTwindConfig } from "../../twind.shared";
import { renderToString } from "react-dom/server";

const styleContext = React.createContext<string>("");

declare var global: typeof globalThis & {
  __sheet: ReturnType<typeof virtualSheet>;
  __cssByHash: Record<string, string>;
};

export function initStyles() {
  // We should only have one instance of the virtual sheet
  if (!global.__sheet) {
    // We'll naively assume that the server is always the same
    // and cache the sheet css by hash here
    global.__cssByHash = {};
    // Create the virtual sheet
    global.__sheet = virtualSheet();
    // Create the twind config
    setup({
      ...sharedTwindConfig,
      sheet: global.__sheet,
    });
  }
}

export function renderWithStyles(children: React.ReactNode) {
  const crypto = require("crypto");
  // Reset the virtual sheet before render
  global.__sheet.reset();
  // Render the app
  renderToString(<>{children}</>);
  // Harvest the styles
  let { textContent } = getStyleTagProperties(global.__sheet);
  // Remove whitespace from styles
  textContent = textContent.replace(/\n/g, "");
  // Hash the styles
  const hash = crypto
    .createHash("md5")
    .update(textContent)
    .digest("hex")
    .substring(0, 10);
  // Store the styles by hash
  global.__cssByHash[hash] = textContent;
  // Feed the hash to the app and render again
  return [
    renderToString(
      <styleContext.Provider value={hash}>{children}</styleContext.Provider>
    ),
    getPathForHash(hash),
  ];
}

export function getStylesByHash(hash: string) {
  return global.__cssByHash[hash];
}

export function useStyles() {
  const hash = React.useContext(styleContext);

  if (!hash) {
    return null;
  }

  return <link rel="stylesheet" href={getPathForHash(hash)} />;
}

function getPathForHash(hash: string) {
  return `/cssInJs/styles?hash=${hash}`;
}
