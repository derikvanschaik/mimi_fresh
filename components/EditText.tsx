import { useRef, useEffect } from "preact/hooks";
import { Button } from './Button.tsx';

export default function EditText({ handleSubmit, handleCancel, value }: any){
    const textRef = useRef(null);
    useEffect(() =>{
        if(textRef && textRef.current){
            textRef.current.focus();
        }
    }, []);
    return (
        <>
        <textarea class='w-full h-full' ref={textRef}>{value}</textarea>
        <Button onClick={(e) => {
            handleSubmit(textRef.current.value)
        }
        }
        >Submit</Button>
        <Button onClick={handleCancel}>Cancel</Button>
        </>
    )
}