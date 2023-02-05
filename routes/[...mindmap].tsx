import { PageProps, Handler } from "$fresh/server.ts";
import Mindmap from "../islands/Mindmap.tsx";
import Path from "../islands/Path.tsx";

export const handler : Handler = {
  GET(_, ctx){
    const path = ctx.params.mindmap.split("/");

    const TBOXES = [
      { x: 600, y: 300, text: 'hello world', id: "90192", selected: false},
      { x: 230, y: 89, text: 'Again hello!', id: "9102390", selected: false},
      {x: 100, y: 100, text: 'hey there babyyy', id: "77", selected: false},
      { x: 400, y: 400, text: 'new link', id: "78979", selected: false},
      { x: 800, y: 700, text: 'yes baby we love new links!', id: "87", selected: false}
    ]
    const LINES = [
      { from: {x: 600, y: 300}, to: {x: 230, y: 89}},
      { from: {x: 100, y: 100}, to: {x: 230, y:89 }},
      {from:{x: 400, y: 400}, to:{ x: 800, y: 700}},
      {from:{x: 230, y: 89}, to:{ x: 800, y: 700}},
    ]
    return ctx.render({ lines: LINES, textboxes: TBOXES, path: path });
  }
}
export default function Greet(props: PageProps) {
  // console.log(props.data)

  return (
  <div>
    <Path path={props.data.path} />
    <Mindmap lines={props.data.lines} textboxes={props.data.textboxes}/>
  </div>
  );
}
