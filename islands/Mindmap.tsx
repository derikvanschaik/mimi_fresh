import { useState, useEffect, useRef } from "preact/hooks";
// import { Button } from "../components/Button.tsx";
import Textbox from '../islands/Textbox.tsx';

interface TextBox {
  x: number, 
  y: number, 
  text: string
}


export default function Mindmap(props: any) {
  const [h, setH] = useState(0);
  const [w, setW] = useState(0);
  const [tIdx, setTidx] = useState(null);
  const [pos, setPos] = useState({ x: 0, y: 0});

  const TBOXES = [
    { x: 600, y: 300, text: 'hello world'},
    { x: 230, y: 89, text: 'Again hello!'}
  ]

  const [textboxes, setTextboxes] = useState<TextBox[]>(TBOXES)

  const canvasRef = useRef(null);

  useEffect(()=>{
    setH(window.innerHeight);
    setW(window.innerWidth);
  }, [])

  useEffect( () =>{
    const handleMousedown = (e) =>{
      setPos({ x: e.clientX, y: e.clientY});
    }
    const handleMousemove = (e) =>{
      if(tIdx === null){
        return;
      }
      const newTbox =  {
        x: textboxes[tIdx].x + (e.clientX - pos.x),
        y: textboxes[tIdx].y + (e.clientY - pos.y),
        text: textboxes[tIdx].text,
      }
      setTextboxes([
        ...textboxes.slice(0, tIdx),
        newTbox,
         ...textboxes.slice(tIdx + 1, textboxes.length)
        ]);

      setPos({ x: e.clientX, y: e.clientY})
    }
    const handleMouseup = (e) =>{
      setTidx(null);
    }
    document.addEventListener("mousedown", handleMousedown);
    document.addEventListener("mouseup", handleMouseup);
    document.addEventListener("mousemove", handleMousemove);

    return () =>{
      document.removeEventListener("mousedown", handleMousedown);
      document.removeEventListener("mouseup", handleMouseup);
      document.removeEventListener("mousemove", handleMousemove);
    }
  }, [textboxes, tIdx])

  return (
    <div>
      <canvas height={h} width={w} ref={canvasRef}>
      </canvas>
      {
        textboxes.map( (t, i) =>{
          return (
            <Textbox
              x={t.x} 
              y={t.y} 
              text={t.text} 
              handleMousedown={() => setTidx(i)}
              handleMouseup={() => setTidx(null)}/>
          )

        })
      }

    </div>
  );
}
