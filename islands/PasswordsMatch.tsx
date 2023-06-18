import { useState , useRef } from 'preact/hooks'

export default function PasswordsMatch(props){
    const [isMatch, setIsMatch] = useState(false);
    const pass = useRef(null);
    const confirm = useRef(null);

    const handleConfirm = () =>{
        if(!pass.current || !pass.current.value){
            return setIsMatch(false);
        }
        if(!confirm.current || !confirm.current.value){
            return setIsMatch(false);
        }
        setIsMatch(pass.current.value === confirm.current.value);
    }

    return (
        <>
        <div>
            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
            <input ref={pass} type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
         </div>

        <div>
            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
            <input ref={confirm} onInput={handleConfirm} type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
        </div>
        <div className={`text-xl font-bold uppercase ${isMatch? 'text-black' : 'text-red-500'}`}>
            {isMatch? 'passwords match': 'passwords do not match'}
        </div>
        </>
    )
}