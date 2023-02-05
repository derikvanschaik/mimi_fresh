import { useState, useEffect, useRef } from "preact/hooks";
import Close from "../components/Close.tsx";
import Textbox from '../islands/Textbox.tsx';

interface TextBox {
  x: number, 
  y: number, 
  text: string
}


export default function Mindmap(props : any) {
  const [h, setH] = useState(0);
  const [w, setW] = useState(0);
  // rename this to tid or smthn
  const [tIdx, setTidx] = useState(null);
  const [pos, setPos] = useState({ x: 0, y: 0});


  const [textboxes, setTextboxes] = useState<TextBox[]>(props.textboxes)
  const [lines, setLines ] = useState(props.lines);

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

      updateLines(textboxes[tIdx].x, textboxes[tIdx].y, textboxes[tIdx].x + (e.clientX - pos.x), textboxes[tIdx].y + (e.clientY - pos.y));
      setTextboxes([
        ...textboxes.slice(0, tIdx),
        {
          ...textboxes[tIdx],
           x:  textboxes[tIdx].x + (e.clientX - pos.x),
           y: textboxes[tIdx].y + (e.clientY - pos.y)
          },
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
  const deleteTextbox = (i: number) =>{
    const { x, y } = textboxes[i];
    setLines(lines.filter( line =>{
      return ( line.from.x !== x && line.from.y !== y ) && (line.to.x !== x && line.to.y !== y);
    }));
    setTextboxes(textboxes.filter((_, idx: number): boolean => idx !== i ));
  }

  const editTextbox = (i: number, text: string) => {
    setTextboxes(
      [...textboxes.slice(0, i),
        { ...textboxes[i], text},
      ...textboxes.slice(i+1, textboxes.length)
      ]);
  }
  const toggleSelect = (i: number) =>{
    setTextboxes(
      [
        ...textboxes.slice(0, i),
        {...textboxes[i], selected: !textboxes[i].selected },
        ...textboxes.slice(i + 1, textboxes.length)

      ]
    )
  }
  const connectSelectedTextboxes = () =>{
    const selected = textboxes.filter(t => t.selected);
    if(selected.length !== 2){
      return;
    }
    const [t1, t2] = selected;
    setLines(
      [...lines, 
        { from: {x: t1.x, y: t1.y}, to:{ x: t2.x, y: t2.y }} ]
    );
    setTextboxes(textboxes.map( t => { return {...t, selected: false} }));
  }

  const disconnectSelectedTextboxes = () =>{
    const selected = textboxes.filter(t => t.selected);
    if(selected.length !== 2){
      return;
    }
    const [t1, t2] = selected;
    setLines(
      lines.filter( line => {
        // match -- filter out
        if ( ( line.from.x === t1.x && line.from.y === t1.y ) && (line.to.x === t2.x && line.to.y === t2.y)){
          return false;
        }
        if(( line.to.x === t1.x && line.to.y=== t1.y ) && (line.from.x === t2.x && line.from.y === t2.y) ){
          return false;
        }
        // keep
        return true;
      
      })
    )
    setTextboxes(textboxes.map( t => { return {...t, selected: false} }));
  }
  const getConnectedStatus = () =>{
    const [t1, t2] = textboxes.filter(t => t.selected);
    const l = lines.filter( line => {
      if ( ( line.from.x === t1.x && line.from.y === t1.y ) && (line.to.x === t2.x && line.to.y === t2.y)){
        return true;
      }
      if(( line.to.x === t1.x && line.to.y=== t1.y ) && (line.from.x === t2.x && line.from.y === t2.y) ){
        return true;
      }
      return false;
    
    }) 
    if (l.length === 0){
      return 'connect';
    }  
    return 'disconnect';

  }

  return (
    <div>
      <canvas height={h} width={w} ref={canvasRef}>
      </canvas>
      {
        textboxes.map( (t, i) =>{
          return (
            <Textbox
              selected={t.selected}
              key={t.id}
              x={t.x} 
              y={t.y}
              text={t.text} 
              handleMousedown={() => setTidx(i)}
              handleMouseup={() => setTidx(null) }
              handleDelete={() => deleteTextbox(i)}
              handleEdit = {(val: string) => editTextbox(i, val)}
              handleSelect={() => toggleSelect(i) }/>
          )
        })
      }
    {/* menu buttons */}
    <button
      onClick={() => {setTextboxes([...textboxes, {x : 500, y: 500, text: 'NEW TEXTBOX', selected: false}])}}
      class="scale-115 fixed bottom-2 left-2 inline-block px-6 py-2 border-2 border-green-500 bg-green-500 text-white font-medium text-lg leading-tight uppercase rounded-full hover:bg-black hover:text-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out">
      Add 
    </button>
    {
      textboxes.filter(t => t.selected).length === 2 
      && 
      <button
        onClick={getConnectedStatus() === 'connect'? connectSelectedTextboxes: disconnectSelectedTextboxes}
        class="scale-115 fixed bottom-2 left-32 inline-block px-6 py-2 border-2 border-grey-700 bg-white-500 text-black font-medium text-lg leading-tight uppercase rounded-full hover:bg-black hover:text-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out">
        { 
         getConnectedStatus()
        }
      </button>
    }


    <div class='fixed top-1 right-2 scale-150'>
      <Close navigate='/'/>
    </div>
    </div>
  );
}
