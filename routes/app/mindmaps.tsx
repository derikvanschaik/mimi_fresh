import { getMindmaps } from '../api/dbService.ts'
import MindmapLinkCard from '../../components/MindmapLinkCard.tsx'

export const handler : Handler = {
    async GET(req, ctx){
      try{
        const mindmaps = await getMindmaps();
        return ctx.render( { mindmaps })
      }catch(err){
        return ctx.render( { message: 'there was an Error with server. Sorry :( '})
      }
    }
}
export default function Mindmaps({data, params}){
    return(
      <div class='w-3/4 mx-auto my-0'>
          <h1 class='text-xl font-bold mb-4 mt-3 py-3  text-center'>Mindmaps:</h1>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {
                data.mindmaps &&
                data.mindmaps.map(mindmap => <MindmapLinkCard title={mindmap.title} id={mindmap.mindmap_id} />)
          }
        </div>
      </div>
    )
}