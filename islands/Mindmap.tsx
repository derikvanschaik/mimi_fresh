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
  const LINES = [
    { from: {x: 600, y: 300}, to: {x: 230, y: 89}}
  ]

  const [textboxes, setTextboxes] = useState<TextBox[]>(TBOXES)
  const [lines, setLines ] = useState(LINES);

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
      updateLines(textboxes[tIdx].x, textboxes[tIdx].y, newTbox.x, newTbox.y);
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

  useEffect(()=>{
    drawLines();
  }, [lines, h, w]);

  const drawLines = () =>{
    const ctx = canvasRef.current.getContext("2d");
    // erase prev lines 
    ctx.clearRect(0, 0, w, h);

    for(const { from, to } of lines){
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    }
  }
  // update when box pos changes 
  const updateLines = (oldX: number, oldY: number, newX: number, newY: number) =>{
    for(let i = 0; i < lines.length; i++){
      const {from, to} = lines[i];

      if ( from.x === oldX && from.y === oldY){
        setLines([...lines.slice(0, i), 
          {from: {x: newX, y: newY}, to: lines[i].to },
          ...lines.slice(i + 1, lines.length)
        ]);
        break;
      }
      if( to.x === oldX && to.y === oldY){
        setLines([...lines.slice(0, i), 
          {from: lines[i].from , to: {x: newX, y: newY} },
          ...lines.slice(i + 1, lines.length)
        ]);
        break;

      }
    }
  }

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
