import { useState, useEffect, useRef } from "preact/hooks";
import Close from "../components/Close.tsx";
import Textbox from '../islands/Textbox.tsx';
import Modal from '../components/Modal.tsx';


interface TextBox {
  x: number, 
  y: number, 
  text: string
}

export default function MindmapIsland(props : any) {

  const [h, setH] = useState(0);
  const [w, setW] = useState(0);
  // rename this to tid or smthn
  const [tIdx, setTidx] = useState(null);
  const [pos, setPos] = useState({ x: 0, y: 0});
  const [textboxes, setTextboxes] = useState<TextBox[]>(props.textboxes)
  const [lines, setLines ] = useState(props.lines);
  const canvasRef = useRef(null);
  const [successfulSave, setSuccessfulSave] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
  useEffect(() =>{

    setSuccessfulSave(null);

  }, [lines, textboxes])

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
  // saves the current state of the mindmap to the backend
  const saveMindmapState = async () =>{
    const data = { lines, textboxes};
    try{
      const response = await fetch(`/app/mindmap?mindmapID=${props.mindmapID}`, {
        method: "POST",
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", 
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer", 
        body: JSON.stringify(data),
      });
      if(response.status == 200){
        setSuccessfulSave(true)
      }else{
        setSuccessfulSave(false)
      }
    }catch(err){
      setSuccessfulSave(false)
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
  const deleteTextboxes = () =>{

    const selected = textboxes.filter(t => t.selected);
    let newLines = lines;
    selected.forEach( textbox => {
      const { x, y } = textbox;
      newLines = lines.filter( line =>{
        return ( line.from.x !== x && line.from.y !== y ) && (line.to.x !== x && line.to.y !== y);
      })
    })
    setLines(newLines);
    setTextboxes(textboxes.filter( t => !t.selected));
  }

  const editTextbox = async (i: number, text: string) => {
    const newTextboxes = 
    [...textboxes.slice(0, i),
      { ...textboxes[i], text},
    ...textboxes.slice(i+1, textboxes.length)
    ]
    setTextboxes(newTextboxes);
      const data = { lines, textboxes: newTextboxes};
      try{
        const response = await fetch(`/app/mindmap?mindmapID=${props.mindmapID}`, {
          method: "POST",
          mode: "cors", // no-cors, *cors, same-origin
          cache: "no-cache", 
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow",
          referrerPolicy: "no-referrer", 
          body: JSON.stringify(data),
        });
        if(response.status == 200){
          setSuccessfulSave(true)
        }else{
          setSuccessfulSave(false)
        }
      }catch(err){
        setSuccessfulSave(false)
      }
      
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
  const addTextBox = () =>{
    setTextboxes(
      [...textboxes, 
        {x : 500, y: 500, text: 'NEW TEXTBOX', selected: false, id: crypto.randomUUID()}
      ])
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
    if (t1 === undefined || t2 === undefined) {
      return 'connect';
    } 
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
      {/* delete textboxes confirmation */}
      {
        isDeleteModalOpen && 
      <Modal>
        <div>
          <p class='px-5 py-5 bg-border-4 border-red-600 rounded bg-red-100'>
            Confirm deletion.
          </p>
        </div>
        <div class='flex flex-row justify-center'>
          <button onClick={() =>{
            deleteTextboxes();
            setIsDeleteModalOpen(false);

          }} class='rounded border-red-500 bg-red-100 border-2 textwhite px-5 py-2'>Delete</button>
          <button class='ml-2 rounded border-black border-2 px-5 py-2' onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
        </div>
      </Modal>
      }


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
              handleEdit = {(val: string) => editTextbox(i, val)}
              handleSelect={() => toggleSelect(i) }/>
          )
        })
      }
    {/* TEXTBOX ACTIONS (DELETE, ADD, CONNECT, DISCONNECT) */}
    <div class='fixed bottom-2 left-2 flex flex-row'>
      <button
        onClick={addTextBox}
        class="inline-block px-6 py-2 border-2 border-green-500 bg-green-500 text-white font-medium leading-tight uppercase rounded-full hover:bg-black hover:text-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out">
        Add +
      </button>

      {
        <button
          disabled={ textboxes.filter(t => t.selected).length !== 2 }
          onClick={getConnectedStatus() === 'connect'? connectSelectedTextboxes: disconnectSelectedTextboxes}
          className={`${textboxes.filter(t => t.selected).length !== 2 ? 'cursor-not-allowed bg-gray-300 text-muted text-white' : 'bg-gray-400 text-black'} px-5 py-2 rounded`}>
          { 
          getConnectedStatus()
          }
        </button>
      }
      
      {  
        <button
          disabled={textboxes.filter(t => t.selected).length === 0}
          className={`${textboxes.filter(t => t.selected).length === 0? 'cursor-not-allowed bg-red-100 text-muted' : 'bg-red-500'} text-white px-5 py-2 rounded`} 
          onClick={() => setIsDeleteModalOpen(true)}>
          DELETE
        </button>
      }
    </div>


    <div class='fixed top-1 right-2 scale-150'>
      <Close navigate='/app/mindmaps'/>
    </div>

    {/* Notification bar */}
    <div class='fixed top-1 left-1'>
      <div class='flex flex-row justify-center items-center'>
        <button 
          class={`border-2 border-black px-5 py-1 rounded-lg ${successfulSave === false? 'bg-red-50': (successfulSave=== true? 'bg-green-50' : 'bg-gray-50')}`}
          onClick={saveMindmapState}>Save Changes { successfulSave !== null && ( successfulSave === true? <span>&#10003;</span> : <span>X</span> )}</button>
        </div>
      </div>
    </div>
  );
}
