import Overlay from "./Overlay.tsx";
export default function Modal(props: any){
return (
          <Overlay>
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  {props.children}
              </div>
          </Overlay>
);
}