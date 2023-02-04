import { useState, useEffect } from "preact/hooks";

interface TextboxProps{
    x: number,
    y: number,
    text: string,
    handleMousedown: () => void;
    handleMouseup: () => void;
}
export default function Textbox({x, y, text, handleMousedown, handleMouseup}: TextboxProps) {
  return (
    <div
        onMousedown={handleMousedown}
        onMouseup={handleMouseup}
        className={`fixed top-[${y}px] left-[${x}px] border-2 border-grey-500 shadow-md rounded-lg px-4 py-3 select-none transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 cursor-move bg-white`}>
    {text}
    </div>

  );
}
