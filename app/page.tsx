import StepList from "./components/StepList";
import { Client, fql } from "fauna";

type StepQueryType = {
  data: StepType[];
};

export default async function Home() {
  const client = new Client({ secret: process.env.NEXT_PUBLIC_FAUNA_KEY });
  const res = await client.query<StepQueryType>(fql`Step.all()`);
  const steps = JSON.parse(JSON.stringify(res.data.data));
  client.close();

  return (
    <>
      <main className="flex min-h-screen min-w-full w-fit flex-col p-16 lg:p-8">
        <div className="z-10 w-full items-center justify-between font-mono text-sm lg:flex">
          <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-100 bg-gradient-to-b from-zinc-200 pb-2 pt-4 backdrop-blur-2xl lg:static lg:w-auto lg:p-4 lg:bg-none">
            <span className="gradient-title">CC. Candidates</span>
          </p>
          <div className="fixed bottom-0 left-0 pb-5 flex h-24 w-full items-end justify-center bg-gradient-to-t from-white via-white lg:static lg:size-auto lg:bg-none">
            <code>By Adam Wigren</code>
          </div>
        </div>
        <StepList steps={steps} />
      </main>
    </>
  );
}
