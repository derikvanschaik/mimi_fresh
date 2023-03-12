import { Head } from "$fresh/runtime.ts";
import { getMindmaps } from './api/dbService.ts'

export const handler : Handler = {
  async GET(_, ctx){
    try{
      const mindmaps = await getMindmaps();
      return ctx.render( { mindmaps })
    }catch(err){
      return ctx.render( { message: 'there was an Error with server. Sorry :( '})
    }
  }
}

export default function Home({data}) {
  return (
    <>
      <Head>
        <title>Fresh App</title>
      </Head>
      <div class="p-4 mx-auto max-w-screen-md">
        { data.message  && <h1>{data.message}</h1>}
        { 
          data.mindmaps &&
          <ul>
            { data.mindmaps.map((mindmap) =>{
              return (
                <li>
                  <a href={`/${mindmap.mindmap_id}`}>{mindmap.title}</a>
                </li>

              )
            })}
          </ul>
        }

        
      </div>
    </>
  );
}
