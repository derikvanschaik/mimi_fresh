import { useState, useEffect, useRef } from "preact/hooks";
import Edit from '../components/Edit.tsx';

interface TextboxProps{
    x: number,
    y: number,
    text: string,
    selected: boolean,
    handleMousedown: () => void,
    handleMouseup: () => void,
    handleDelete: () => void,
    handleEdit: (value: string) => void,
    handleSelect: () => void;
}
export default function Textbox(
  {x, y, text, selected, handleMousedown, handleMouseup, handleDelete, handleEdit, handleSelect}: TextboxProps) 
  {
  const [hover, setHover] = useState(false);
  const [editing, setEditing] = useState(false);
  const editableRef = useRef(null);
  
  return (
    <div
        onMousedown={() => {
          if (editing){
            return;
          }
          handleMousedown()
        }}
        onMouseup={() =>{
          if (editing){
            return;
          }
          handleMouseup()
        }}
        onMouseenter={() => setHover(true)}
        onMouseleave={() => setHover(false)}
        className={`fixed top-[${y}px] left-[${x}px] border-2 border-grey-500 max-w-[250px] min-w-[200px] min-h-[35px] break-all scale-110 shadow-md rounded-lg px-4 py-3 select-none transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-125 ${!editing? 'cursor-move': ''} bg-white`}
        contenteditable={editing? 'true' : 'false'}
        // this event is necessary for when text is blank
        onKeydown={(e) => {
          // this is a hack so that user can input into a blank textbox as expected
          if(e.key.length === 1 && editableRef.current.textContent === ''){
            editableRef.current.textContent = ''
          }
        }}
        ref={editableRef}
        onBlur={() => {
          setEditing(false);
          handleEdit(editableRef.current.textContent);
          editableRef.current.textContent = '';
        }}>
          {text}
    <div
      onClick={() =>{
        if (!editableRef){
          return;
        }
        setEditing(!editing);
        const willBeEditing = !editing;
        if(willBeEditing){
          // dumb hack needed for focus to work
          setTimeout(()=>{
            editableRef.current.focus();
          }, 0)
        }
      }}
      className={`absolute -top-1 -right-1 ${hover && !editing? 'visible': 'invisible'} cursor-pointer`}>
          <Edit/>
    </div>
    <div className={`absolute -top-1 -left-1 ${ (hover || selected) ? 'visible' : 'invisible' } cursor-pointer`}>
      {
        selected? 
        <input 
          checked 
          type="checkbox" 
          value="" 
          class="w-4 h-4 bg-gray-100 border-gray-300 rounded focus:ring-2" 
          onChange={ handleSelect }/> 
        :
        <input 
          type="checkbox" 
          value="" 
          class="w-4 h-4 bg-gray-100 border-gray-300 rounded focus:ring-2" 
          onChange={ handleSelect }
        />
      }
      
    </div>
    </div>

  );
}
