import { useState , useRef } from 'preact/hooks'
import MindmapLinkCard from '../components/MindmapLinkCard.tsx'
import Modal from '../components/Modal.tsx';

interface MindmapProps {
    mindmapList: any[]
}
enum ModalMode {
    EDIT, 
    DELETE,
    ERROR
}
export default function MindmapList({ mindmapList }: MindmapProps){
    const [mindmaps, setMindmaps] = useState(mindmapList)
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [modalMode, setModalMode] = useState<ModalMode>(ModalMode.EDIT) // doesn't matter which one we set at first
    // index for which mindmap we are editing // deleting
    const [idx, setIdx] = useState(undefined)
    const input = useRef(undefined)

    const handleNewMindmap = async () =>{
        try{
            const title = `mindmap (${mindmaps.length})`
            const response = await fetch('/app/mindmaps', {
                method: "POST",
                mode: "cors", // no-cors, *cors, same-origin
                cache: "no-cache", 
                credentials: "same-origin",
                headers: {
                  "Content-Type": "application/json",
                },
                redirect: "follow",
                referrerPolicy: "no-referrer", 
                body: JSON.stringify({ title }),
            })
            if(response.status !== 200){
                throw new Error('Unable to save mindmap')
            }
            const {mindmap_id} = await response.json()
            setMindmaps([{ title, mindmap_id}, ...mindmaps])
        }
        catch(err){
            setOpenModal(true)
            setModalMode(ModalMode.ERROR)
        }
    }
    const handleOpenEditMindmap = (idx: number) => {
        setIdx(idx)
        setOpenModal(true)
        setModalMode(ModalMode.EDIT)
    }
    const handleOpenDeleteMindmap = (idx: number) => {
        setIdx(idx)
        setOpenModal(true)
        setModalMode(ModalMode.DELETE)
    }
    const handleDeleteMindmap = async () =>{
        try{
            setMindmaps(mindmaps.filter( (_, i) => i !== idx))
            setOpenModal(false)

            const { mindmap_id } = mindmaps[idx];
            const response = await fetch('/app/mindmaps', {
                method: "DELETE",
                mode: "cors", // no-cors, *cors, same-origin
                cache: "no-cache", 
                credentials: "same-origin",
                headers: {
                  "Content-Type": "application/json",
                },
                redirect: "follow",
                referrerPolicy: "no-referrer", 
                body: JSON.stringify({ mindmap_id }),
            })
            if(response.status !== 200){
                throw new Error('Unable to delete mindmap')
            }
        }
        catch(err){
            setOpenModal(true)
            setModalMode(ModalMode.ERROR)
        }

    }
    const handleEditMindmap = async () =>{
        try{

            const title = input.current.value;
            const { mindmap_id } = mindmaps[idx]
            const newMindmaps = [...mindmaps.slice(0, idx), {...mindmaps[idx], title }, ...mindmaps.slice(idx + 1, mindmaps.length)]
            setMindmaps(newMindmaps)
            setOpenModal(false)

            const response = await fetch('/app/mindmaps', {
                method: "PUT",
                mode: "cors", // no-cors, *cors, same-origin
                cache: "no-cache", 
                credentials: "same-origin",
                headers: {
                  "Content-Type": "application/json",
                },
                redirect: "follow",
                referrerPolicy: "no-referrer", 
                body: JSON.stringify({ title ,  mindmap_id }),
            })
            if(response.status !== 200){
                throw new Error('Unable to delete mindmap')
            }
        }
        catch(err){
            setOpenModal(true)
            setModalMode(ModalMode.ERROR)
        }
    
    }
    return(
        <div class='w-3/4 mx-auto my-0'>
            {
                openModal && 
                <Modal>
                    { 
                        modalMode === ModalMode.DELETE
                        &&
                        <div>
                            <h1>Are you sure you want to delete this mindmap and all of its data?</h1>
                            <button onClick={handleDeleteMindmap} class='border-1 border-red-500 px-5 py-1 mr-2 rounded-md'>Yes</button>
                            <button onClick={() => setOpenModal(false) } class='border-1 border-black px-5 py-1 rounded-md'>No</button>
                        </div>
                    }
                    { 
                        modalMode === ModalMode.EDIT &&
                        <div>
                            <h1>New Title: </h1>
                            <input placeholder='enter new title' ref={input}/>
                            <button onClick={handleEditMindmap} class='border-1 border-black px-5 py-1 mr-2 rounded-md'>Submit</button>
                            <button onClick={() => setOpenModal(false)} class='border-1 border-black px-5 py-1 rounded-md'>Cancel</button>
                        </div>
                    }
                    { 
                        modalMode === ModalMode.ERROR &&
                        <div class='border-2 border-red-900 bg-red-300 px-5 py-1 rounded-lg'>
                            There was an error trying to process your request on the server. Sorry about that!
                            <button onClick={() => setOpenModal(false)} class='border-1 border-black px-5 py-1 rounded-md'>Close</button>
                        </div>
                    }
                </Modal>
            }
            <h1 class='text-xl font-bold mb-4 mt-3 py-3  text-center'>Mindmaps:</h1>
            <button
                onClick={handleNewMindmap}
                class='border-2 px-3 py-1 border-black rounded mb-4'>New</button>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {
                mindmaps.map( (mindmap, idx) => {
                    return (
                        <div class='px-3 py-2 border-1 border-gray-100 relative'>
                            <div class='flex flex-row justify-around'>
                                <button
                                    onClick={()=>handleOpenDeleteMindmap(idx)}
                                    class='text-red-600'>Delete</button>
                                <button
                                    onClick={()=>handleOpenEditMindmap(idx)}
                                    class='text-blue-600'>Edit</button>
                            </div>
                            <MindmapLinkCard 
                                title={mindmap.title} 
                                id={mindmap.mindmap_id} />
                        </div>
                    )
                })
            }
            </div>
        </div>
       )
}