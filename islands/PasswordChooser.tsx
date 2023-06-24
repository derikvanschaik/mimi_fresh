import { useEffect, useRef } from 'preact/hooks'
import generatePassword from '../utils/passwordGenerator.ts'

export default function PasswordsMatch(props){
    
    const pass = useRef(null);
    const feedbackpass = useRef(null);

    useEffect(()=>{
        generateRandomPassword();
    }, [])

    const generateRandomPassword = async () =>{
        const password = await generatePassword(30);

        if(pass && pass.current){
            pass.current.value = password;
        }
        if(feedbackpass && feedbackpass.current){
            feedbackpass.current.value = password;
        }
    }

    return (
        <>
        <div>
            <button type="button" onClick={generateRandomPassword} className='px-3 py-2 border-2 border-blue-500 mb-2'>Generate New Password</button>
            <input ref={pass} type="text" name="feedback" disabled placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
            {/* actual password field that gets submitted to server */}
            <input name="password" type="hidden" ref={feedbackpass}/>
            <p className='px-2 py-3 font-medium text-gray-400'>
                In order to enforce web security practices, 
                we are not allowing users to choose their own passwords.
            </p>
         </div>
        </>
    )
}