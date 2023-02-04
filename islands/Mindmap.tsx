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
    { x: 230, y: 89, text: 'Again hello!'},
    {x: 100, y: 100, text: 'hey there babyyy'},
    { x: 400, y: 400, text: 'new link'},
    { x: 800, y: 700, text: 'yes baby we love new links!'}
  ]
  const LINES = [
    { from: {x: 600, y: 300}, to: {x: 230, y: 89}},
    { from: {x: 100, y: 100}, to: {x: 230, y:89 }},
    {from:{x: 400, y: 400}, to:{ x: 800, y: 700}},
    {from:{x: 230, y: 89}, to:{ x: 800, y: 700}},
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
    const newLines = [];
    for(let i = 0; i < lines.length; i++){
      const {from, to} = lines[i];
      let newLine = {from, to};
      if ( from.x === oldX && from.y === oldY){
        newLine = {from: {x: newX, y: newY}, to: lines[i].to }
      }
      else if( to.x === oldX && to.y === oldY){
        newLine = {from: lines[i].from , to: {x: newX, y: newY} }
      }
      newLines.push(newLine);
    }
    setLines(newLines);
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
