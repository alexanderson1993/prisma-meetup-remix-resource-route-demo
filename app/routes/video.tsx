import {
  MetaFunction,
  LoaderFunction,
  Form,
  useActionData,
  ActionFunction,
  LinksFunction,
  useTransition,
} from "remix";
import { useLoaderData, json, Link } from "remix";
import { cache } from "~/github-cache";
import indexStylesUrl from "~/styles/index.css";

type IndexData = {};
type ActionData = {
  username?: string;
  error?: string;
};

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: indexStylesUrl }];
};

export let action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const username = formData.get("githubUsername");

  const cacheUser = cache.find((user) => user.login === username);

  if (cacheUser) {
    return {
      username: cacheUser.login,
    };
  }

  const checkUsernameRequest = await fetch(
    "https://api.github.com/users/" + username
  );

  const validUsername = (await checkUsernameRequest.status) === 200;

  if (checkUsernameRequest.status === 403) {
    return {
      error:
        "Github API rate limit exceeded. Please try on oft the Remix Team Members (those are cached) or try again later.",
    };
  }

  if (!validUsername) {
    return {
      error: "Not a valid GitHub username",
    };
  }

  return {
    username,
  };
};

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
  return {
    title: "Remix & Remotion Demo",
    description: "Using remotion.dev on a Remix Resource Route!",
  };
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  let actionData = useActionData<ActionData>();
  let transition = useTransition();

  return (
    <div className="remix__page">
      <main>
        <h2 style={{ fontSize: "1.75rem", paddingBottom: "1rem" }}>
          Welcome to a simple Remix & Remotion Demo!
        </h2>
        <h3 style={{ fontSize: "1.25rem", paddingBottom: "1rem" }}>
          Taken from{" "}
          <a
            style={{ color: "cyan" }}
            href="https://github.com/lgastler/remix-remotion-demo"
          >
            https://github.com/lgastler/remix-remotion-demo
          </a>
        </h3>
        <p>
          You can try the demo at the bottom with your GitHub username. Or go
          directly to <code>/api/video/:yourGitHubUsername</code> to hit the
          resource route directly.
        </p>
        <div className="video__container">
          <div>
            <h3>Render a custom video with your GitHub Profile</h3>
            <Form method="post" className="remix__form">
              <input
                type="text"
                name="githubUsername"
                autoComplete="off"
                placeholder="Your GitHub Username"
              />
              <button>Create Video</button>
              {actionData?.error ? <p>{actionData.error}</p> : null}
            </Form>
            {
              <p>
                {transition.state === "submitting"
                  ? "Checking username..."
                  : transition.state === "loading"
                  ? "Generating your video ..."
                  : null}
              </p>
            }
          </div>
        </div>
        <div>
          {actionData?.username ? (
            <video
              width={1920 / 2}
              height={1080 / 2}
              src={`/api/video/${actionData?.username}`}
              autoPlay
              muted
              controls
            />
          ) : null}
        </div>
      </main>
    </div>
  );
}
