import { useState, useEffect } from "preact/hooks";
import More from '../components/More.tsx';

interface TextboxProps{
    x: number,
    y: number,
    text: string,
    handleMousedown: () => void;
    handleMouseup: () => void;
    handleDelete: () => void;
}
export default function Textbox({x, y, text, handleMousedown, handleMouseup, handleDelete}: TextboxProps) {
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  return (
    <div
        onMousedown={handleMousedown}
        onMouseup={handleMouseup}
        onMouseenter={() => setHover(true)}
        onMouseleave={() => setHover(false)}
        className={`scale-110 fixed top-[${y}px] left-[${x}px] border-2 border-grey-500 shadow-md rounded-lg px-4 py-3 select-none transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-125 cursor-move bg-white`}>
    {text}

    {/* More action menu icon */}
    <div
      onClick={() => setOpen(!open)}
      className={`absolute -top-1 -right-1 ${hover? 'visible': 'invisible'} cursor-pointer`}>
        <More />
    </div>

    {/* action menu */}
    <div className={`absolute z-11 ${!open? 'hidden' : ''} bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 cursor-pointer`}>
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownHoverButton">
          <li onClick={handleDelete}>
            <p
              class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" >
              Delete
            </p>
          </li>
          <li>
            <p 
              class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" >
              Edit
            </p>
          </li>
          <li>
            <p 
              class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" >
              Connect 
            </p>
          </li>
        </ul>
    </div>
    </div>

  );
}
