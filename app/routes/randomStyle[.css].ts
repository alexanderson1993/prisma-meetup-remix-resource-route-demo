import { LoaderFunction } from "remix";

export const loader: LoaderFunction = ({ request }) => {
  return new Response(
    `
  .randomColor {
    color: hsl(${Math.round(Math.random() * 360)}, 100%, 50%)
  }
  `,
    {
      headers: {
        "content-type": "text/css",
      },
    }
  );
};
