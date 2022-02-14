import type { MetaFunction, LoaderFunction } from "remix";
import { useLoaderData, json, Link } from "remix";

type IndexData = {
  demos: Array<{ name: string; to: string }>;
};

// Loaders provide data to components and are only ever called on the server, so
// you can connect to a database or run any server side code you want right next
// to the component that renders it.
// https://remix.run/api/conventions#loader
export let loader: LoaderFunction = () => {
  let data: IndexData = {
    demos: [
      {
        to: "github",
        name: "Webhook APIs",
      },
      {
        to: "randomStyle",
        name: "Dynamically Generated CSS",
      },
      {
        to: "cssInJs",
        name: "Cached CSS-in-JS",
      },
      {
        to: "svelte",
        name: "Dynamically Generated JS",
      },
      {
        to: "video",
        name: "Video On Demand",
      },
    ],
  };

  // https://remix.run/api/remix#json
  return json(data);
};

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
  return {
    title: "Remix Starter",
    description: "Welcome to remix!",
  };
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  let data = useLoaderData<IndexData>();

  return (
    <div className="remix__page">
      <aside>
        <h2 style={{ fontSize: "2rem", fontWeight: "bold" }}>
          Demos In This App
        </h2>
        <ul>
          {data.demos.map((demo) => (
            <li key={demo.to} className="remix__page__resource">
              <Link to={demo.to} prefetch="intent">
                {demo.name}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
