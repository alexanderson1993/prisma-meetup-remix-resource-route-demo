import { tw } from "twind";

export default function CSSInJS() {
  return (
    <div className={tw`flex h-96 justify-center items-center`}>
      <h1
        className={tw`p-10 text-white font-bold text-2xl relative bg-red-500`}
      >
        This is rendered with CSS-in-JS!
      </h1>
    </div>
  );
}
