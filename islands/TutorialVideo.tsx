import Modal from '../components/Modal.tsx';
import { useState, useEffect, useRef } from "preact/hooks";
import Close from "../components/Close.tsx";

export default function tutorialVideo(props){
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button class='border-2 border-black px-5 py-1 rounded' onClick={() => setIsOpen(true)}>WATCH</button>
            <div>
                {
                    isOpen && 
                    <Modal>
                        <div class='absolute top-1 right-1 border-2 rounded border-black' onClick={() => setIsOpen(false)}>
                            <Close />
                        </div>
                        <iframe class='w-full' height="400" src="https://www.youtube.com/embed/v_jFrqcP0BQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen>
                        </iframe>
                    </Modal>
                }
            </div>
        </>
    )
}