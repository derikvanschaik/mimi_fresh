import { Head } from "$fresh/runtime.ts";
import TutorialVideo from '../islands/TutorialVideo.tsx';

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
            <p class='text-center text-lg w-1/2 mx-auto mb-2'>
              Want to know how to use MIMI? Watch our short demo: <TutorialVideo />
            </p>
          </div>
        </div>
    </>
  );
}
