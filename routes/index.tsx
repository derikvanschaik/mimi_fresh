import { Head } from "$fresh/runtime.ts";
import MindmapIsland from "../islands/MindmapIsland.tsx";

export default function Home({data}) {
  return (
    <>
      <Head>
        <title>MIMI</title>
      </Head>
      <div>
      <MindmapIsland isDemo/>
      </div>
    </>
  );
}
