import fs from "fs";
import path from "path";
const svelte = require("svelte/compiler");

export let loader = () => {
  const source = fs.readFileSync(
    path.join("app", "svelte", "App.svelte"),
    "utf8"
  );
  const { js } = svelte.compile(source, { generate: "ssr", format: "cjs" });

  const component = eval(js.code);
  const output = component.render({});

  const html = `<!DOCTYPE>
  <html>
  <head>
  <style>
  ${output.css.code}
  </style>
  </head>
  <body style="background:black; height:100%; display:flex; justify-content:center; align-items:center;">
  ${output.html}
  </body>
  </html>
  `;
  return new Response(html, {
    headers: { "content-type": "text/html" },
  });
};
