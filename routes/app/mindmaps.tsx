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
        <>
        <h1>Mindmaps:</h1>
            {
                data.mindmaps &&
                data.mindmaps.map(mindmap => <MindmapLinkCard title={mindmap.title} id={mindmap.mindmap_id} />)
            }
        </>
    )
}