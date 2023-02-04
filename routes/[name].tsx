import { PageProps } from "$fresh/server.ts";
import Mindmap from "../islands/Mindmap.tsx";

export default function Greet(props: PageProps) {
  return (
  <div>
    <Mindmap />
  </div>
  );
}
