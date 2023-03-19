import { useState , useRef } from 'preact/hooks'
import MindmapLinkCard from '../components/MindmapLinkCard.tsx'
import Modal from '../components/Modal.tsx';

interface MindmapProps {
    mindmapList: any[]
}
enum ModalMode {
    EDIT, 
    DELETE
}
export default function MindmapList({ mindmapList }: MindmapProps){
    const [mindmaps, setMindmaps] = useState(mindmapList)
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [modalMode, setModalMode] = useState<ModalMode>(ModalMode.EDIT) // doesn't matter which one we set at first
    // index for which mindmap we are editing // deleting
    const [idx, setIdx] = useState(undefined)
    const input = useRef(undefined)

    const handleNewMindmap = () =>{
        setMindmaps([{ title: `mindmap (${mindmaps.length})`, mindmap_id: `mindmap ${mindmaps.length}`}, ...mindmaps])
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
    const handleDeleteMindmap = () =>{
        setMindmaps(mindmaps.filter( (_, i) => i !== idx))
        setOpenModal(false)
    }
    const handleEditMindmap = () =>{
        const newTitle = input.current.value;
        const newMindmaps = [...mindmaps.slice(0, idx), {...mindmaps[idx], title: newTitle}, ...mindmaps.slice(idx + 1, mindmaps.length)]
        setMindmaps(newMindmaps)
        setOpenModal(false)
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