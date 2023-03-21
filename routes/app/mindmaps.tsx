import MindmapList from '../../islands/MindmapList.tsx';
import { getCookies } from "https://deno.land/std/http/cookie.ts";
import { getMindmaps, createMindmap, updateMindmapTitle, deleteMindmap } from '../api/dbService.ts'

export const handler : Handler = {
    async GET(req, ctx){
      try{
        const sessionValue = getCookies(req.headers).auth;
        const mindmaps = await getMindmaps(sessionValue);
        return ctx.render( { mindmaps, error: false })
      }catch(err){
        return ctx.render({ error: true})
      }
    },
    // MINDMAP CRUD METHODS
    async POST(req: Request, ctx){
      try{
        const {title} = await req.json()
        const sessionValue = getCookies(req.headers).auth;
        const mindmap_id = await createMindmap(title, sessionValue);
        return new Response(JSON.stringify({mindmap_id}), { status: 200 })
      }catch(err){
        return new Response(null, { status: 404 })
      }
    },
    async PUT(req, ctx){
      try{
        const {title, mindmap_id} = await req.json()
        const sessionValue = getCookies(req.headers).auth;
        await updateMindmapTitle(parseInt(mindmap_id), title, sessionValue)
        return new Response(null, { status: 200 })
      }catch(err){
        return new Response(null, { status: 404 })
      }

    },
    async DELETE(req, ctx){
      try{
        const {mindmap_id} = await req.json()
        const sessionValue = getCookies(req.headers).auth;
        await deleteMindmap(parseInt(mindmap_id), sessionValue)
        return new Response(null, { status: 200 })
      }catch(err){
        return new Response(null, { status: 404 })
      }

    }
}
export default function Mindmaps({data, params}){
    const error = data.error
    return(
      <>
        { !error && <MindmapList mindmapList={data.mindmaps} />}
        { 
          error &&
        <h1 class='text-4xl text-center px-5 py-1 bg-red-300 rounded-md'>There was an error while loading your mindmaps. Please refresh to try again.</h1>
        }
      </>
      
    )
}