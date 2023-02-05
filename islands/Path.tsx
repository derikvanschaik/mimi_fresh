import { useState, useEffect } from "preact/hooks";

export default function Path({ path}: any){
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div class='fixed top-0 left-0 rounded-lg px-3 py-2 shadow-md border-2 border-black-400'>
            <nav class="flex" aria-label="Breadcrumb">
            { 
                isOpen && 
                <ol class="inline-flex items-center space-x-1 md:space-x-3">
                    {path.map( (link: string, i: number) =>{
                        return (
                            <li class="inline-flex items-center">
                            <div class="flex items-center">
                                { 
                                    i !== 0 &&
                                    <svg aria-hidden="true" class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>

                                }
                                { 
                                    i < path.length - 1 &&
                                    <a href={"/" + path.slice(0, i+ 1).join("/")} class="ml-1 text-2xl font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">
                                        {link}
                                    </a>
                                }
                                { 
                                    i === path.length -1 
                                    &&
                                    <span class="ml-1 text-2xl font-medium text-gray-500 md:ml-2 dark:text-gray-400">{link}</span>
                                }
                            </div>
                            </li>
                        )

                    })}

                </ol>
            }
            <button onClick={() => setIsOpen(!isOpen)} class='mx-2'>
                {/* expand icon  */}
                {
                    !isOpen && 
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
                    </svg>
                }
                {/* hide icon */}
                {
                    isOpen && 
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
                    </svg>

                }

            </button>


            </nav>

        </div>
    )
}