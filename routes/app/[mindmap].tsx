import { PageProps, Handler } from "$fresh/server.ts";
import MindmapIsland from "../../islands/MindmapIsland.tsx";
import { getMindmapData, updateMindmapData } from '../api/dbService.ts'
import { getCookies } from "https://deno.land/std/http/cookie.ts";

export const handler : Handler = {
  async GET(req, ctx){
    try{
      const sessionValue = getCookies(req.headers).auth
      const mindmapRows = await getMindmapData(ctx.params.mindmap, sessionValue);
      const [mindmapData] = mindmapRows;
      const parsedMindmap = JSON.parse(mindmapData.mindmap_data);
      const { lines, textboxes } = parsedMindmap;
      return ctx.render({lines, textboxes})
      
    }catch(err){
      console.log("there was an error initializing this mindmap data.")
      console.log(err)
      return ctx.render({ lines: [], textboxes: []});
    }
  },
  async POST(req, ctx){
    try{
      const { textboxes, lines } = await req.json();
      const ID = parseInt(new URL(req.url).searchParams.get("mindmapID"))
      const sessionValue = getCookies(req.headers).auth;
      await updateMindmapData(ID, {textboxes, lines}, sessionValue);    
      return new Response("Successfully updated your mindmap data",{
        status: 200,
        headers: {
          "content-type": "text/html",
        }
      })
    }catch(error){
      return new Response("Error updating your mindmap data", {
        status: 404,
        headers: {
          "content-type": "text/html",
        }
      })
    }
  }
}

export default function Mindmap(props: PageProps) {
  return (
  <div>
    <MindmapIsland
      mindmapID={props.params.mindmap}
      lines={props.data.lines} 
      textboxes={props.data.textboxes} />
  </div>
  );
}