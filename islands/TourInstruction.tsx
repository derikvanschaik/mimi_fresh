import Overlay from "../components/Overlay.tsx";
export default function TourInstruction({ tourIdx, handleSubmitTourStep, height}){
    const getCurrentInstructionOfTour = (idx) =>{
        let html;
        switch(idx) {
          case 0:
            html = <p>First Click Ok to dismiss this element. <br />
             Once closed, click the green button in the bottom left displaying 'ADD +' . <br />
             </p>;
            break;
          case 1:
            html = <p>
            Well done! Here is your first textbox. <br />
            Hover your mouse over the textbox to see the action icons appear. <br />
            </p>;
            break;
        }
        return <div>
                {html}
                <button onClick={ handleSubmitTourStep }
                class='border-2 border-green-500 px-2 py-1 rounded'>Ok</button>
              </div>
      }

      const getCurrentPositionOfTour = (idx) =>{
        if(idx === 0){
          return `top-[${height - 150}px] left-[${0}px]`
        }else if (idx === 1){
          // where the new textbox sets the textbox function by default (500, 500)
          return `top-[${500 - 250}px] left-[${500}px]`
        }
      }
    return (
        <>
        <Overlay />
        <div 
          className={`absolute z-10 ${getCurrentPositionOfTour(tourIdx)} rounded text-4-xl border-3 border-blue-300 px-5 py-1 bg-white`}>
          {getCurrentInstructionOfTour(tourIdx)}
        </div>
        </>
    )
}