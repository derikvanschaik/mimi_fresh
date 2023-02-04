import { useState, useEffect } from "preact/hooks";
import More from '../components/More.tsx';

interface TextboxProps{
    x: number,
    y: number,
    text: string,
    handleMousedown: () => void;
    handleMouseup: () => void;
}
export default function Textbox({x, y, text, handleMousedown, handleMouseup}: TextboxProps) {
  const [hover, setHover] = useState(false);
  return (
    <div
        onMousedown={handleMousedown}
        onMouseup={handleMouseup}
        onMouseenter={() => setHover(true)}
        onMouseleave={() => setHover(false)}
        className={`scale-110 fixed top-[${y}px] left-[${x}px] border-2 border-grey-500 shadow-md rounded-lg px-4 py-3 select-none transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-125 cursor-move bg-white`}>
    {text}

    <div className={`absolute -top-1 -right-1 ${hover? 'visible': 'invisible'}`}>
        <More />
    </div>

    </div>

  );
}
