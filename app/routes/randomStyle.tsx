export const links = () => {
  return [
    {
      rel: "stylesheet",
      href: "/randomStyle.css",
    },
  ];
};
export default function RandomStyle() {
  return <h1 className="randomColor">This should have random colors.</h1>;
}
