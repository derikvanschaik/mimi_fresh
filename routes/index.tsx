import { Head } from "$fresh/runtime.ts";
import { getMindmaps } from './api/dbService.ts'
import MindmapLinkCard from '../components/MindmapLinkCard.tsx'

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
  const style = {
    backgroundImage: 'url("background.avif")',
    // backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  }
  return (
    <>
      <Head>
        <title>MIMI</title>
      </Head>
        <div style={style}>
            <h1 class='ml-3 border-black text-sm font-extrabold'>
            Mindmapping with MIMI
            </h1>
          {/* header */}
          <div class='flex flex-col items-center bg-opacity-90'>
                <ul class='text-3xl'>
                  <li class='font-light line-through text-gray-400 py-2 px-5'>Most Overpowered</li>
                  <li class='font-light line-through text-gray-400 py-2 px-5'>Most feature rich</li>
                  <li class='font-light line-through text-gray-400 py-2 px-5'>Most AI Integrated</li>
                  <li class='font-light line-through text-gray-400 py-2 px-5'>Most Complex</li>
                </ul>
                <span class='italic font-extrabold text-2xl md:text-3xl lg:text-6xl text-indigo-200'>Simplest <span class='text-green-800'>&#10003;</span></span>
                <h1 
                  class='text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-12 py-2'>
                    mindmapping software on the web: <span class='text-gray-300 italic'>MIMI</span> 
                </h1>
          </div>

          <div class='bg-red-50 py-6'>
            <h1 class='font-bold text-black text-4xl text-center my-3 '>GET STARTED</h1>
            <p class='text-center text-2xl font-bold w-1/2 mx-auto mb-2'>
              Click on any of the mindmaps below to start mindmapping
            </p>
            {/*  */}
            <div class="w-4/5 md:w-1/2 my-0 mx-auto">
              { data.message  && <h1>{data.message}</h1>}
              { 
                data.mindmaps &&
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  { data.mindmaps.map((mindmap) =>{
                    return (
                      <div class='my-3'>
                        <MindmapLinkCard title={mindmap.title} id={mindmap.mindmap_id} />
                      </div>
                    )
                  })}
                </div>
              }              
            </div>
          </div>
        </div>
    </>
  );
}
