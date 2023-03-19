import { PageProps, Handler } from "$fresh/server.ts";
import MindmapIsland from "../../islands/MindmapIsland.tsx";
import { getMindmapData, updateMindmapData } from '../api/dbService.ts'

export const handler : Handler = {
  async GET(req, ctx){
    try{
      const mindmapRows = await getMindmapData(ctx.params.mindmap);
      const [mindmapData] = mindmapRows;
      const parsedMindmap = JSON.parse(mindmapData.mindmap_data);
      const { lines, textboxes } = parsedMindmap;
      return ctx.render({lines, textboxes})
      
    }catch(err){
      console.log("there was an error initializing this mindmap data.")
      return ctx.render({ lines: [], textboxes: []});
    }
  },
  async POST(req, ctx){
    try{
      const payload = req.body
      if (payload === null) {
        return new Response("Invalid body",{
          status: 404,
          headers: {
            "content-type": "text/html",
          }
       })
      }
      let requestString = '';
      const decoder = new TextDecoder()
      for await (const chunk of payload) {
        requestString += decoder.decode(chunk)
      }
      const ID = parseInt(new URL(req.url).searchParams.get("mindmapID"))
      await updateMindmapData(ID, requestString);    
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
