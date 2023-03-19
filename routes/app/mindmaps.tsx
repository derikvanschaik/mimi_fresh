import { getMindmaps } from '../api/dbService.ts'
// import MindmapLinkCard from '../../components/MindmapLinkCard.tsx'
import MindmapList from '../../islands/MindmapList.tsx';

export const handler : Handler = {
    async GET(req, ctx){
      try{
        const mindmaps = await getMindmaps();
        return ctx.render( { mindmaps, error: false })
      }catch(err){
        return ctx.render({ error: true})
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